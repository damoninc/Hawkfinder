import { signOut } from "@firebase/auth";
import { Button } from "@mui/material";
import React from "react";
import { auth } from "../../firebase/config";

function SignedIn() {
  const logout = () => {
    signOut(auth);
  };
  return (
    <div>
      <h1>You are signed in. Yay!</h1>
      <Button variant="contained" onClick={logout}>
        Sign out
      </Button>
    </div>
  );
}
export default SignedIn;
