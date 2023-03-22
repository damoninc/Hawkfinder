import { useState } from "react";
import "../../styles/loginscreen.css";
import User, { testUsers } from "../../data/User";
import React from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../App";
import { auth } from "../../App";
import { FirebaseError } from "firebase/app";
import { Button, Grid, Input } from "@mui/material";

/**
 * Sign up has 4 fields which are used to create a User object
 * @returns The sign up screen component
 */
function SignUpScreen() {
  const [emailInput, setEmail] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [firstnameInput, setFirstName] = useState("");
  const [lastnameInput, setLastName] = useState("");

  /**
   * Creates a new User in the User array in User.ts. Doesn't permanently save the User.
   * @returns false is a placeholder, it doesn't do anything
   */
  function createUser() {
    if (
      emailInput == "" ||
      passwordInput == "" ||
      firstnameInput == "" ||
      lastnameInput == ""
    ) {
      alert("Fields cannot be blank");
      return false;
    } else if (!emailInput.includes("@")) {
      alert("Must have a valid email");
      return false;
    }

    const madeUser = new User(
      emailInput,
      passwordInput,
      firstnameInput,
      lastnameInput
    );
    console.log("created user", madeUser.toString());
    testUsers.push(madeUser);
    createUserWithEmailAndPassword(auth, emailInput, passwordInput)
      .then((cred) => {
        setDoc(doc(db, "Users", cred.user.uid), {
          email: emailInput,
          friendsList: [],
          profile: {
            userid: cred.user.uid,
            firstName: firstnameInput,
            lastName: lastnameInput,
            username: madeUser.username,
            bio: madeUser.profile.bio,
            interests: madeUser.profile.interests,
            profilePicture: madeUser.profile.profilePicture,
            coverPhoto: madeUser.profile.coverPhoto,
          },
        });
        alert("New account created! Your username is " + madeUser.username);
      }) // TODO: Again, I gotta change these error messages
      .catch((error: FirebaseError) => {
        switch (error.code) {
          case "auth/email-already-in-use":
            alert("UH OH RAGGY! Email is already in use!");
            break;
          case "auth/weak-password":
            alert("ZOINKS SCOOBS! Password is too weak, hit the gym!");
            break;
          default:
            alert("WHAT THE FUCK DID YOU DO!");
            alert(error.code);
            break;
        }
      });
  }

  return (
    <div className="backboard">
      <fieldset className="loginSquare">
        <h1>Sign Up</h1>
        <Grid>
          <Grid item>
            <Input
              name="nameTyped"
              id="name"
              type="text"
              placeholder="Enter your email"
              required
              onChange={(emailwrote) => setEmail(emailwrote.target.value)}
            />
          </Grid>
          <Grid item>
            <Input
              name="passTyped"
              id="password"
              type="text"
              placeholder="Write your password"
              required
              onChange={(passwrote) => setPasswordInput(passwrote.target.value)}
            />
          </Grid>
          <Grid item>
            <Input
              name="firstTyped"
              id="first"
              type="text"
              placeholder="Write your firstname"
              required
              onChange={(firstwrote) => setFirstName(firstwrote.target.value)}
            />
          </Grid>
          <Grid item>
            <Input
              name="lastTyped"
              id="last"
              type="text"
              placeholder="Write your lastname"
              required
              onChange={(lastwrote) => setLastName(lastwrote.target.value)}
            />
          </Grid>
            <Button variant="contained" onClick={createUser}>
              Sign Up
            </Button>
        </Grid>
      </fieldset>
    </div>
  );
}
export default SignUpScreen;
