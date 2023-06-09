import "../../styles/loginscreen.css";
import "../../styles/centeritems.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase/config";
import React from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { Button, CircularProgress, Paper, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useFormik } from "formik";
import { Container } from "@mui/system";

/**
 * Login Screen checks for a user within Firebase using email and password authentication.
 * @returns Login Screen Component
 */
function LoginScreen() {
  const navigate = useNavigate();
  const [accountMessage, setAccountMessage] = useState("");

  /**
   * This is the interface that is used within Validation. Checks for email and password.
   */
  interface ErrorLoginInfo {
    email?: string;
    password?: string;
  }

  /* 
  validate is used to determine if any of the textareas are wrong, as it will return a specfic error message.
  The issue is that for it to pass, it has to return a "{}", but writing "const errors = {}" gives you an error, stating
  that "Property email/password does not exist on type '{}'", however the code will run without errors. In order to remove
  these error message, I created an interface called ErrorLoginInfo, that has these values as optional inputs. This allows the 
  values to not be created, meaning it can pass the tests and will create them if there are errors. Whoopee.

  */

  /**
   * Checks if the text fields contain any errors and returns that error.
   * @returns ErrorLoginInfo object
   */
  function validate() {
    const errors: ErrorLoginInfo = {};
    if (!formik.values.email) {
      errors.email = "Must fill out email";
    } else if (!formik.values.email.includes("@")) {
      errors.email = "Email must include @";
    }
    if (!formik.values.password) {
      errors.password = "Must fill out password";
    }
    return errors;
  }

  /**
   * This is the core backbone of the forums. Most of the heavy lifting is done by this hook.
   * It expects an initialValue, a validation, and a submission method.
   */
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate,
    onSubmit: (values) => {
      checkExist(values.email, values.password);
    },
  });

  /**
   * This will attempt to sign in a user based on their credentials.
   * An error message will be produced if the User cannot login, with
   * an appropriate error message
   * @param usernameInput string : username input
   * @param passwordInput string : username input
   */
  function checkExist(usernameInput: string, passwordInput: string) {
    setAccountMessage("Looking for user...");
    signInWithEmailAndPassword(auth, usernameInput, passwordInput)
      .then(async (cred) => {
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
      })
      .catch((error: FirebaseError) => {
        switch (error.code) {
          case "auth/user-not-found":
            setAccountMessage("User not found!");
            break;
          case "auth/wrong-password":
            setAccountMessage("User not found");
            break;
          default:
            setAccountMessage(`UH OH! Unknown error: ${error.code}.`);
            break;
        }
      });
  }

  /**
   * This will display a loading circle when the User clicks the button, and display
   * an error message if applicable.
   * @returns A loading circle, a message, or null
   */
  function loadingUserMessage() {
    if (accountMessage == "") {
      return null;
    } else if (accountMessage == "Looking for user...") {
      return <CircularProgress />;
    } else {
      return <h2 className="errorMessage">{accountMessage}</h2>;
    }
  }

  // TODO: Obscure text password boxes
  return (
    <div className="centered">
      <Paper variant="outlined" className="loginSquare">
        <h1>Login</h1>
        <form onSubmit={formik.handleSubmit}>
          <Container className="formGaps">
            <Grid>
              <Container>
                <Grid item>
                  <TextField
                    label="Email" // What the text box displays
                    id="email" // Make sure this is the same as your formik value, or it won't allow you to type in the box
                    type="text" // Setting type to text
                    onChange={formik.handleChange} // This will use the formik hook to handle most of the backend changes
                    value={formik.values.email} // This is the value that will change, and is used for validation and submission
                    error={formik.touched.email && Boolean(formik.errors.email)} // touched means that the user hasn't 'touched' the specific input. Errors will cause the box to turn red if it gets an error.
                    helperText={formik.touched.email && formik.errors.email} // Same idea as above, but this will display a message specific error.
                    // onBlur={formik.handleBlur}  Blur means it will check for errors as you're typing. Not ideal for UX.
                  />
                </Grid>
              </Container>
              <Container>
                <Grid item>
                  <TextField
                    label="Password"
                    id="password"
                    type="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                    // onBlur={formik.handleBlur}
                  />
                </Grid>
              </Container>
              <Container style={{
                position: "relative",
                left: "60px",
                bottom: "25px",
                margin: "0px"
              }}>
                <Grid item>
                  <Link
                    to="/components/ResetPassword"
                    style={{
                      color: "#1ed5db",
                      fontSize: "12px",
                      fontWeight: "bold"
                    }}
                  >
                    Forgot Password?
                  </Link>
                </Grid>
              </Container>
              {loadingUserMessage()}
              <Container style={{
                margin: "0px"
              }}>
                <Grid item>
                  <Button variant="contained" color="primary" type="submit">
                    Login
                  </Button>
                </Grid>
              </Container>
              <Container>
                <Grid item>
                  <h2 style={{ fontSize: "15px" }}>New user?</h2>
                  <Link
                    to="/components/Signup"
                    style={{
                      color: "#1ed5db",
                      fontSize: "20px",
                      fontWeight: "bold",
                    }}
                  >
                    Sign up now!
                  </Link>
                </Grid>
              </Container>
            </Grid>
          </Container>
        </form>
      </Paper>
    </div>
  );
}
export default LoginScreen;
