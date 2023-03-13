import LoginScreen from "./LoginScreen";
import SignUpScreen from "./SignUpScreen";
import React from "react";

function LogAndSign() {
  return (
    <div>
      <LoginScreen />
      Signing up is an instance and will not be saved
      <br />
      Your username from your signup will be your email without the @uncw.edu section
      <SignUpScreen />
    </div>
  );
}
export default LogAndSign;