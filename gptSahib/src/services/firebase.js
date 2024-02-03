import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyCPmQngpOEGe8NCFAPdraSSxkH7ogstc6w",
  authDomain: "gptsahib-e26ab.firebaseapp.com",
  projectId: "gptsahib-e26ab",
  storageBucket: "gptsahib-e26ab.appspot.com",
  messagingSenderId: "676228888864",
  appId: "1:676228888864:web:bac29dd21aed4d91fc7f45",
};

firebase.initializeApp(firebaseConfig);

export async function signUpWithEmailPassword({
  email,
  password,
  name,
  setSucess,
  setError,
}) {
  try {
    const userCredential = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);

    await sendEmailVerification();
    toast("Verification Link sent to " + email);
    const user = userCredential.user;
    await createUserDocument(user.uid, name, email);
    setSucess(true);
    return user;
  } catch (error) {
    errorSet({ setError: setError, errorCode: error.code });
  }
}

export async function sendEmailVerification() {
  try {
    const user = firebase.auth().currentUser;
    await user.sendEmailVerification();
  } catch (error) {
    toast.error(error);
  }
}

export async function signInWithEmailPassword(
  email,
  pass,
  setSucess,
  setError
) {
  try {
    //console.log("hello");
    const userCredential = await firebase
      .auth()
      .signInWithEmailAndPassword(email, pass);
    setSucess(true);
    const user = userCredential.user;
    localStorage.setItem("id", user.uid);
  } catch (error) {
    //console.log(error);
    errorSet({ setError: setError, errorCode: error.code });
    // throw error;
  }
}

export async function createUserDocument(userId, name, email) {
  try {
    const userRef = firebase.firestore().collection("users").doc(userId);
    await userRef.set({
      name: name,
      email: email,
      objectId: userId,
    });
  } catch (error) {
    throw error;
  }
}

export async function signInWithGoogle({ setSucess }) {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const userCredential = await firebase.auth().signInWithPopup(provider);

    const user = userCredential.user;
    const name = user.displayName;
    const email = user.email;
    await createUserDocument(user.uid, name, email);

    setSucess(true);
    localStorage.setItem("id", user.uid);
  } catch (error) {
    //console.log(error.message);
    setSucess(false);
  }
}

export const getUserByObjectId = async ({ objectId, setUser, setSideBar }) => {
  try {
    const userRef = firebase.firestore().collection("users").doc(objectId);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      const userData = userDoc.data();

      setUser({
        id: userDoc.id,
        ...userData,
      });
      fetchHistory({ userId: userDoc.id, setSideBar: setSideBar });
    } else {
      setUser({ error: "User not found" });
      // throw new Error("User not found");
    }
  } catch (error) {
    //console.log(error.message);
    setUser({ error: error.message });
  }
};

export const getHistory = async ({ objectId, setUser }) => {
  try {
    const userRef = firebase.firestore().collection("users").doc(objectId);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      const userData = userDoc.data();

      setUser({
        id: userDoc.id,
        ...userData,
      });
    } else {
      setUser({ error: "User not found" });
      // throw new Error("User not found");
    }
  } catch (error) {
    //console.log(error.message);
    setUser({ error: error.message });
  }
};

export const fetchHistory = async ({ userId, setSideBar }) => {
  try {
    const firestore = firebase.firestore();
    const userRef = firestore.collection("users").doc(userId);
    const historyRef = userRef.collection("history");

    const snapshot = await historyRef.orderBy("timestamp", "desc").get();
    //console.log(snapshot);
    if (snapshot.empty) {
      setSideBar([]);
    } else {
      const documents = snapshot.docs.map((doc) => doc.data());
      const documentList = Object.values(documents); // Convert the documents to an array
      setSideBar(documentList);
    }
  } catch (error) {
    console.error("Error retrieving history:", error);
  }
};

export const addHistory = async ({ userId, uid, data }) => {
  try {
    const firestore = firebase.firestore();
    const userRef = firestore.collection("users").doc(userId);
    const historyRef = userRef.collection("history").doc(uid);
    await historyRef.set({
      data: data,
      uid: uid,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating document:", error);
  }
};

export const createHistory = async ({ uid, data, setNewChat, setCurrId }) => {
  try {
    const historyRef = firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .collection("history")
      .doc();

    await historyRef.set({
      data: data,
      uid: historyRef.id,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setCurrId(historyRef.id);
    localStorage.setItem("currId", historyRef.id);
    setNewChat(false);
    //console.log("Document created successfully");
  } catch (error) {
    console.error("Error creating document:", error);
  }
};

export const sendPasswordResetEmail = ({ email, setError }) => {
  firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(() => {
      toast.success("Reset Link sent to " + email);
      // //console.log("Password reset email sent successfully");
    })
    .catch((error) => {
      // console.error("Error sending password reset email:", error);
      errorSet({ setError: setError, errorCode: error.code });
    });
};

function errorSet({ setError, errorCode }) {
  switch (errorCode) {
    case "auth/invalid-email":
      toast.error("Invalid email address.");
      break;
    case "auth/user-disabled":
      toast.error("This user account has been disabled.");
      break;
    case "auth/user-not-found":
      toast.error("User not found.");
      break;
    case "auth/wrong-password":
      toast.error("Incorrect password.");
      break;
    case "auth/email-already-in-use":
      toast.error("Email address is already in use.");
      break;
    case "auth/weak-password":
      toast.error("The password is too weak.");
      break;
    case "auth/popup-closed-by-user":
      toast.error("The sign-in popup was closed by the user.");
      break;
    case "auth/popup-blocked":
      toast.error("The sign-in popup was blocked by the browser.");
      break;
    case "auth/operation-not-supported-in-this-environment":
      toast.error(
        "This operation is not supported in the current environment."
      );
      break;
    case "auth/invalid-verification-code":
      toast.error("The verification code is invalid.");
      break;

    default:
      toast.error(errorCode);
      break;
  }
}

export const getResp = async ({ query, setError, setAns }) => {
  try {
    const response = await fetch(
      "https://asia-south1-hidden-cosmos-391410.cloudfunctions.net/function-2",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: query }),
      }
    );
    const responseData = await response.json();
    setAns(responseData.answer);
  } catch (error) {
    setError(error.message);
  }
};
