import "../../styles/loginscreen.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../App";
import React from "react";
import { signInWithEmailAndPassword } from "firebase/auth";

/**
 * Login screen contains two use states which are used for the input fields
 * TODO: Add firebase implementation
 * @returns The login screen component
 */
function LoginScreen() {
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const navigate = useNavigate();

  /**
   * checks if User is within the User array in the User.ts
   * @returns false is used as a placeholder, it isn't actually used
   */
  function checkExist() {
    if (usernameInput == "" || passwordInput == "") {
      alert("Must fill out email or password.");
      return false;
    }

    signInWithEmailAndPassword(auth, usernameInput, passwordInput).then(cred =>
      alert("Signed in as " + cred.user.email)
    );

  }

  return (
    <div className="backboard">
      <fieldset className="loginSquare">
        <h1>Login</h1>
        <h1>
          <label>
            Username
            <input
              name="nameTyped"
              id="name"
              type="text"
              placeholder="Write your name"
              required
              onChange={(namewrote) => setUsernameInput(namewrote.target.value)}
            />
          </label>
        </h1>
        <h1>
          <label>
            Password{" "}
            <input
              name="passTyped"
              id="password"
              type="text"
              placeholder="Write your password"
              required
              onChange={(passwrote) => setPasswordInput(passwrote.target.value)}
            />
          </label>
        </h1>
        <button type="submit" onClick={checkExist}>
          Login
        </button>
      </fieldset>
    </div>
  );
}
export default LoginScreen;
