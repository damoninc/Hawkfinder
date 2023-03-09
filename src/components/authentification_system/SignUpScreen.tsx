import { useState } from "react";
import './LoginScreen.css'
import LoginScreen from "./LoginScreen";
import User, { testUsers } from "../User";

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
    function createUser(){
        if (emailInput == "" || passwordInput == "" || firstnameInput == "" || lastnameInput == "") {
            alert("Fields cannot be blank")
            return false
        }
        else if (!emailInput.includes("@")) {
            alert("Must have a valid email")
            return false
        }
        else if (passwordInput.length < 8) {
            alert("Password must be 8 characters long")
            return false
        }

        let duplicate : boolean = false
        testUsers.forEach(currentUser => {
            if (currentUser.email == emailInput) {
                duplicate = true
                
            }
        });

        if (duplicate) {
            alert("Email already exists!")
            return false
        }

        let madeUser : User = new User(emailInput, passwordInput, firstnameInput, lastnameInput);
        console.log("created user", madeUser.toString())
        testUsers.push(madeUser)
        alert("New account created!")
    }

  
    return (
      <div className="backboard">
        <fieldset className="loginSquare">
          <h1>Sign Up</h1>
          <h1>
            <label>
              Email{" "}
              <input
                name="nameTyped"
                id="name"
                type="text"
                placeholder="Enter your email"
                required
                onChange={(emailwrote) => setEmail(emailwrote.target.value)}
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
          <h1>
            <label>
              Firstname{" "}
              <input
                name="firstTyped"
                id="first"
                type="text"
                placeholder="Write your firstname"
                required
                onChange={(firstwrote) => setFirstName(firstwrote.target.value)}
              />
            </label>
          </h1>
          <h1>
            <label>
              Lastname{" "}
              <input
                name="lastTyped"
                id="last"
                type="text"
                placeholder="Write your lastname"
                required
                onChange={(lastwrote) => setLastName(lastwrote.target.value)}
              />
            </label>
          </h1>
          <button type="submit" onClick={createUser}>
            Sign Up
          </button>
        </fieldset>
      </div>
    );
  }
  export default SignUpScreen;