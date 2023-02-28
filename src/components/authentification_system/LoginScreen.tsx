import User from "../User";
import "./LoginScreen.css";
import { testUsers } from "../User";
import { TextField } from "@mui/material";

function LoginScreen() {
  return (
    <div className="backboard">
      <fieldset className="loginSquare">
        <h1>Login</h1>
        <h2>
          Username{" "}
          <input id="name" type="text" placeholder="Write your name" required />
        </h2>
        <h2>
          Password{" "}
          <input id="name" type="text" placeholder="Write your name" required />
        </h2>
      </fieldset>
    </div>
  );
}
export default LoginScreen;
