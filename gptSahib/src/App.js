import logo from "./logo.svg";
import "./App.css";
import Main from "./screens/main";
import Login from "./screens/login";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Signup from "./screens/signup";
import ChatPage from "./screens/chat";
import { useEffect, useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [login, setLogin] = useState();

  useEffect(() => {
    setLogin(localStorage.getItem("login"));
  }, [login]);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <ToastContainer />
      <BrowserRouter>
        {" "}
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />;
          {login == "true" ? (
            <Route path="/chat" element={<ChatPage />} />
          ) : (
            <></>
          )}
        </Routes>{" "}
      </BrowserRouter>
    </>
  );
}

export default App;
