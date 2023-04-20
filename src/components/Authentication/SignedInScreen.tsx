import { signOut } from "@firebase/auth";
import { Button } from "@mui/material";
import React from "react";
import { auth } from "../../firebase/config";

/**
 * This is the screen that will replace login/signup if the User is signed in.
 * This will prevent Users logging in or signing up if already logged in.
 * @param props The User object
 * @returns A screen that states who's signed in
 */
function SignedIn(props : any) {
  const logout = () => {
    signOut(auth);
  };
  return (
    <div className="centered">
      <h1>You are signed in as {props.uCreds.email}. Yay!</h1>
      <Button variant="contained" onClick={logout}>
        Sign out
      </Button>
    </div>
  );
}
export default SignedIn;
