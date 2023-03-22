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
import { Button, TextField } from "@mui/material";
import Input from "@mui/material/Input";
import { Box } from "@mui/system";
import Grid from "@mui/material/Grid";

/**
 * Login screen contains two use states which are used for the input fields
 * TODO: Add firebase implementation
 * @returns The login screen component
 */
function LoginScreen() {
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  let navigate = useNavigate();

  /**
   * checks if User is within the User array in the User.ts
   * @returns false is used as a placeholder, it isn't actually used
   */
  function checkExist() {
    if (usernameInput == "" || passwordInput == "") {
      alert("Must fill out email or password.");
      return false;
    }

    signInWithEmailAndPassword(auth, usernameInput, passwordInput)
      .then(
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

          /**
           *
           */
          const docRef = doc(db, "Users", cred.user.uid);
          const docSnap = await getDoc(docRef);
          const userAuth = docSnap.data();
          alert(
            "Signed in as " +
              userAuth?.profile.firstName +
              " " +
              userAuth?.profile.lastName
          );
          navigate("/components/Forum");
        }
        // TODO: I gotta change these error messages
      )
      .catch((error: FirebaseError) => {
        switch (error.code) {
          case "auth/user-not-found":
            alert("WHOOPSIES! It looks like that email doesn't exist!");
            break;
          case "auth/wrong-password":
            alert("FORSOOTH! Shit don't work fam, that password wack!");
            break;
          case "auth/invalid-email":
            alert("BY GOLLY! This is not a valid email!");
            break;
          default:
            alert(error.code);
            break;
        }
      });
  }

  return (
    <Grid>
      <div className="backboard">
        <fieldset className="loginSquare">
          <h1>Login</h1>
          <Grid item>
            <Input
              name="nameTyped"
              id="name"
              type="text"
              placeholder="Email"
              required
              onChange={(namewrote) => setUsernameInput(namewrote.target.value)}
            />
          </Grid>
          <Grid item>
            <Input
              name="passTyped"
              id="password"
              type="text"
              placeholder="Password"
              required
              onChange={(passwrote) => setPasswordInput(passwrote.target.value)}
            />
          </Grid>
          <Button
            variant="contained"
            type="submit"
            onClick={checkExist}
          >
            Login
          </Button>
        </fieldset>
      </div>
    </Grid>
  );
}
export default LoginScreen;
