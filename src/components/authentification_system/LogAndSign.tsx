import LoginScreen from "./LoginScreen";
import SignUpScreen from "./SignUpScreen";

function LogAndSign() {
  return (
    <div>
      <LoginScreen />
      Signing up is an instance and won't be saved
      <br />
      Your username from your signup will be your email without the @uncw.edu section
      <SignUpScreen />
    </div>
  );
}
export default LogAndSign;
