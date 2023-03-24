import { useState } from "react";
import "../../styles/loginscreen.css";
import User, { testUsers } from "../../data/User";
import React from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../App";
import { auth } from "../../App";
import { FirebaseError } from "firebase/app";
import { Button, CircularProgress, Grid, TextField } from "@mui/material";
import { useFormik } from "formik";
import { Container } from "@mui/system";

/**
 * Sign up has 4 fields which are used to create a User object
 * @returns The sign up screen component
 */
function SignUpScreen() {
  const [signupMessage, setSignupMessage] = useState("");
  interface signupFields {
    email?: string;
    password?: string;
    firstname?: string;
    lastname?: string;
  }

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
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
   * Creates a new User in the User array in User.ts. Doesn't permanently save the User.
   * @returns false is a placeholder, it doesn't do anything
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
        alert("New account created! Your username is " + madeUser.username);
      }) // TODO: Again, I gotta change these error messages
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

  return (
    <fieldset className="loginSquare">
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
                <Button variant="outlined" type="submit">
                  Sign Up
                </Button>
              </Grid>
            </Container>
          </Grid>
        </Container>
      </form>
    </fieldset>
  );
}
export default SignUpScreen;
