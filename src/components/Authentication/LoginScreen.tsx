import "../../styles/loginscreen.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../App";
import React from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { FirebaseError } from "firebase/app";

/**
 * Login screen contains two use states which are used for the input fields
 * TODO: Add firebase implementation
 * @returns The login screen component
 */
function LoginScreen() {
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  /**
   * checks if User is within the User array in the User.ts
   * @returns false is used as a placeholder, it isn't actually used
   */
  function checkExist() {
    if (usernameInput == "" || passwordInput == "") {
      alert("Must fill out email or password.");
      return false;
    }

    signInWithEmailAndPassword(auth, usernameInput, passwordInput).then(
      async (cred) => {
        
        // Will keep this as a reference for layer

        // const qCino = query(collection(db, "Users"), where("email", "==", usernameInput));
        // const querySnapshot = getDocs(qCino);
        // var userAuth;
        // (await querySnapshot).forEach(
        //   (doc) => {
        //     userAuth = doc.data();
        //     alert("Signed in as " + userAuth?.profile.firstName + " " + userAuth?.profile.lastName);
        //     console.log(userAuth);
        //   }
        // );
        const docRef = doc(db, "Users", cred.user.uid);
        const docSnap = await getDoc(docRef);
        const userAuth = docSnap.data();
        alert("Signed in as " + userAuth?.profile.firstName + " " + userAuth?.profile.lastName);

      }
    ).catch((error : FirebaseError) => {
          switch (error.code) {
            case "auth/user-not-found":
              alert("WHOOPSIES! It looks like that email doesn't exist!");
              break;
            case "auth/wrong-password":
              alert("FORSOOTH! Shit don't work fam, that password wack!");
              break;
            case "auth/invalid-email":
              alert("BY GOLLY! This is not a valid email!")
              break;
            default:
              alert(error.code)
              break;
          }
    })
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
