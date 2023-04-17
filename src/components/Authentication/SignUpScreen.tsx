import { useState } from "react";
import "../../styles/loginscreen.css";
import User from "../../data/User";
import React from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../../firebase/config";
import { FirebaseError } from "firebase/app";
import { Button, CircularProgress, Grid, Paper, TextField } from "@mui/material";
import { useFormik } from "formik";
import { Container } from "@mui/system";
import { useNavigate, Link } from "react-router-dom";

/**
 * The Sign Up page, which allows users to sign up and creates a new account for them
 * Has various fields a user must fill out to proceed.
 * @returns SignUp Component
 */
function SignUpScreen() {
  const navigate = useNavigate();
  const [signupMessage, setSignupMessage] = useState("");
  interface signupFields {
    email?: string;
    password?: string;
    confirmPassword?: string;
    firstname?: string;
    lastname?: string;
  }
  /**
   * Similar to Login, does most of the heavy lifting. Instead of using a function for validate, it does it inline.
   */
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstname: "",
      lastname: "",
    },
    validate(values) {
      const errors: signupFields = {};
      if (values.email == "") {
        errors.email = "Must fill out email field.";
      } else if (!values.email.includes("@uncw.edu")) {
        errors.email = "Email must be from @uncw.edu";
      }

      if (values.password == "") {
        errors.password = "Must fill out password field.";
      } else if (values.password.length < 8) {
        errors.password = "Password must be 8 characters long";
      } else if (values.confirmPassword != values.password) {
        errors.password = "Password fields do not match!";
      }

      if (values.confirmPassword == "") {
        errors.confirmPassword = "Must confirm password.";
      } else if (values.confirmPassword != values.password) {
        errors.confirmPassword = "Password fields do not match!";
      }

      if (values.firstname == "") {
        errors.firstname = "Must fill out firstname field.";
      }

      if (values.lastname == "") {
        errors.lastname = "Must fill out lastname field.";
      }

      return errors;
    },
    onSubmit: (values) => {
      createUser(
        values.email,
        values.password,
        values.firstname,
        values.lastname
      );
    },
  });

  /**
   * Will give an error message if something goes wrong, otherwise, it'll load with a circular sign
   * @returns An error message, loading circle, or null
   */
  function loadingUserMessage() {
    if (signupMessage == "") {
      return null;
    } else if (signupMessage == "Signing you up...") {
      return <CircularProgress />;
    } else {
      return <h2 className="errorMessage">{signupMessage}</h2>;
    }
  }

  /**
   * Create a new user using the auth method, and then navigates to another screen
   * @returns null
   */
  function createUser(
    emailInput: string,
    passwordInput: string,
    firstnameInput: string,
    lastnameInput: string
  ) {
    setSignupMessage("Signing you up...");
    const madeUser = new User(
      emailInput,
      passwordInput,
      firstnameInput,
      lastnameInput
    );
    createUserWithEmailAndPassword(auth, emailInput, passwordInput)
      .then((cred) => {
        setDoc(doc(db, "Users", cred.user.uid), {
          email: emailInput,
          userid: cred.user.uid,
          friendsList: [],
          incomingRequests: [],
          outgoingRequests: [],
          spotifyTokens: madeUser.spotify,
          profile: {
            firstName: firstnameInput,
            lastName: lastnameInput,
            username: madeUser.username,
            bio: madeUser.profile.bio,
            interests: madeUser.profile.interests,
            profilePicture: madeUser.profile.profilePicture,
            coverPhoto: madeUser.profile.coverPhoto,
          },
        });
        alert(`New account created with email ${emailInput}!`);
        navigate("/components/Forum");
      })
      .catch((error: FirebaseError) => {
        switch (error.code) {
          case "auth/email-already-in-use":
            setSignupMessage(
              "Sorry bub! Looks like that email is already in use."
            );
            break;
          default:
            setSignupMessage(
              `Man, I don't even know what happened... ${error.code}`
            );
            break;
        }
      });
  }

  // TODO: Obscure text password boxes
  return (
    <Paper variant="outlined" className="loginSquare">
      <h1>Sign Up</h1>
      <form onSubmit={formik.handleSubmit}>
        <Container className="formGaps">
          <Grid>
            <Container>
              <Grid item>
                <TextField
                  label="Email"
                  id="email"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
            </Container>
            <Container>
              <Grid item>
                <TextField
                  label="Password"
                  id="password"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                />
              </Grid>
            </Container>
            <Container>
              <Grid item>
                <TextField
                  label="Confirm Password"
                  id="confirmPassword"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.confirmPassword}
                  error={
                    formik.touched.confirmPassword &&
                    Boolean(formik.errors.confirmPassword)
                  }
                  helperText={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                  }
                />
              </Grid>
            </Container>
            <Container>
              <Grid item>
                <TextField
                  label="Firstname"
                  id="firstname"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.firstname}
                  error={
                    formik.touched.firstname && Boolean(formik.errors.firstname)
                  }
                  helperText={
                    formik.touched.firstname && formik.errors.firstname
                  }
                />
              </Grid>
            </Container>
            <Container>
              <Grid item>
                <TextField
                  label="Lastname"
                  id="lastname"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.lastname}
                  error={
                    formik.touched.lastname && Boolean(formik.errors.lastname)
                  }
                  helperText={formik.touched.lastname && formik.errors.lastname}
                />
              </Grid>
            </Container>
            {loadingUserMessage()}
            <Container>
              <Grid item>
                <Button variant="contained" type="submit">
                  Sign Up
                </Button>
              </Grid>
            </Container>
            <Container>
              <Grid item>
                <h2 style={{ fontSize: "15px" }}>Already have an account?</h2>
                <Link
                  to="/"
                  style={{ color: "#1ed5db", fontSize: "20px", fontWeight: "bold"}}
                >
                  Login here!
                </Link>
              </Grid>
            </Container>
          </Grid>
        </Container>
      </form>
    </Paper>
  );
}
export default SignUpScreen;
