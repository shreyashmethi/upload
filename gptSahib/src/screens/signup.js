import React, { useEffect, useState } from "react";
import style from "./login.module.css";
import { Link } from "react-router-dom";
import { signUpWithEmailPassword } from "../services/firebase";
import { toast } from "react-toastify";

function Signup() {
  const [email, setEmail] = useState("");
  const [pass, setpass] = useState("");
  const [name, setName] = useState("");
  const [conf, setconf] = useState("");
  const [error, setError] = useState("");
  const [sucess, setSucess] = useState(false);

  const submit = () => {
    if (name == "") toast.error("Name Required");
    else if (email == "") toast.error("Email Required");
    else if (pass != conf || pass.length == 0) toast.error("Passwords Invalid");
    else {
      //firebase Signup
      setError("");
      emailSignup();
    }
  };

  const emailSignup = async () => {
    await signUpWithEmailPassword({
      email: email,
      name: name,
      password: pass,
      setSucess: setSucess,
      setError: setError,
    });
  };
  useEffect(() => {
    if (sucess) {
      window.location = "/login";
    }
  }, [sucess, error]);

  return (
    <div className={style.main}>
      <div className={style.sec2}>
        <div className={style.signup}>Signup</div>
        <div className={style.entry}>
          <input
            placeholder="Full Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          ></input>
        </div>
        <div className={style.entry}>
          <input
            placeholder="Email Address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></input>
        </div>
        <div className={style.entry}>
          <input
            placeholder="Password"
            value={pass}
            onChange={(e) => {
              setpass(e.target.value);
            }}
          ></input>
        </div>
        <div className={style.entry}>
          <input
            placeholder="Confirm Password"
            value={conf}
            onChange={(e) => {
              setconf(e.target.value);
            }}
          ></input>
        </div>

        <button
          className={style.logbtn}
          onClick={submit}
          style={{ marginTop: "60px" }}
        >
          Signup
        </button>
        {error != "" ? (
          <div
            className={style.noacc}
            style={{ color: "red", textDecoration: "none", marginTop: "10px" }}
          >
            {error}
          </div>
        ) : (
          <></>
        )}

        <div className={style.noacc}>
          {" "}
          <Link to={"/login"} style={{ color: "#7E440F" }}>
            Already have an account
          </Link>
        </div>
      </div>
      <div className={style.sec1}>
        <img src="images/log.png"></img>
      </div>
    </div>
  );
}

export default Signup;
