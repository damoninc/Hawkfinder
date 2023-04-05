import { signOut } from "@firebase/auth";
import { Button } from "@mui/material";
import React from "react";
import { auth } from "../../firebase/config";

function SignedIn(props : any) {
  const logout = () => {
    signOut(auth);
  };
  return (
    <div>
      <h1>You are signed in as {props.uCreds.email}. Yay!</h1>
      <Button variant="contained" onClick={logout}>
        Sign out
      </Button>
    </div>
  );
}
export default SignedIn;
