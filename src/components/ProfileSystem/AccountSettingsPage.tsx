import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import User from "../../data/User";
import { updateEmail, updatePassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import {
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import Navbar from "../Navbar/Navbar";

/**
 * Allows a user ot change their important credentials such as their Email and their Password.
 * @param passedUser The authenticated user
 * @returns The Account Settings Page component
 */
function AccountSettingsPage(passedUser: any) {
  const [signupMessage, setSignupMessage] = useState("");
  const [userData, setUserData] = useState<any>();

  const docRef = doc(db, "Users", passedUser.uCreds.uid);
  useEffect(() => {
    getDoc(docRef)
      .then((docSnap) => {
        const userData = docSnap.data();
        setUserData(userData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  interface changeFieldsEmail {
    email?: string;
    confirmEmail?: string;
  }

  interface changeFieldsPassword {
    password?: string;
    confirmPassword?: string;
  }

  const formikEmail = useFormik({
    initialValues: {
      email: "",
      confirmEmail: "",
    },
    validate(values) {
      const errors: changeFieldsEmail = {};
      if (values.email == "") {
        errors.email = "Must fill out email field.";
      }
      if (values.confirmEmail == "") {
        errors.confirmEmail = "Must fill out email field.";
      }

      return errors;
    },
    onSubmit: (values) => {
      changeUserEmail(values.email);
    },
  });

  const formikPassword = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validate(values) {
      const errors: changeFieldsPassword = {};
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

      return errors;
    },
    onSubmit: (values) => {
      changeUserPassword(values.password);
    },
  });

  function changeUserEmail(emailInput: string) {
    //TODO make sure to change email in document reference as well. i.e Firestore
    updateEmail(passedUser, emailInput)
      .then(() => {
        alert("Email Successfully changed!");
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

  function changeUserPassword(passwordInput: string) {
    updatePassword(passedUser, passwordInput).then(() => {
      alert("Password Changed");
    });
  }
  return (
    <div>
      <Navbar />
      <Typography fontSize={30}>
        Hi, {userData?.profile.firstName + " " + userData?.profile.lastName}!
      </Typography>
      <Typography>Welcome to Account Settings!</Typography>
      <fieldset className="loginSquare">
        <h1>Change Account Information</h1>
        <form onSubmit={formikEmail.handleSubmit}>
          <Container className="formGaps">
            <Grid>
              <Container>
                <Grid item>
                  <TextField
                    label="Email"
                    id="email"
                    type="text"
                    onChange={formikEmail.handleChange}
                    value={formikEmail.values.email}
                    error={
                      formikEmail.touched.email &&
                      Boolean(formikEmail.errors.email)
                    }
                    helperText={
                      formikEmail.touched.email && formikEmail.errors.email
                    }
                  />
                </Grid>
              </Container>
              <Container>
                <Grid item>
                  <TextField
                    label="Confirm Email"
                    id="confirmEmail"
                    type="text"
                    onChange={formikEmail.handleChange}
                    value={formikEmail.values.email}
                    error={
                      formikEmail.touched.email &&
                      Boolean(formikEmail.errors.email)
                    }
                    helperText={
                      formikEmail.touched.email && formikEmail.errors.email
                    }
                  />
                </Grid>
              </Container>
              <Container>
                <Grid item>
                  <TextField
                    label="Password"
                    id="password"
                    type="text"
                    onChange={formikPassword.handleChange}
                    value={formikPassword.values.password}
                    error={
                      formikPassword.touched.password &&
                      Boolean(formikPassword.errors.password)
                    }
                    helperText={
                      formikPassword.touched.password &&
                      formikPassword.errors.password
                    }
                  />
                </Grid>
              </Container>
              <Container>
                <Grid item>
                  <TextField
                    label="Confirm Password"
                    id="confirmPassword"
                    type="text"
                    onChange={formikPassword.handleChange}
                    value={formikPassword.values.confirmPassword}
                    error={
                      formikPassword.touched.confirmPassword &&
                      Boolean(formikPassword.errors.confirmPassword)
                    }
                    helperText={
                      formikPassword.touched.confirmPassword &&
                      formikPassword.errors.confirmPassword
                    }
                  />
                </Grid>
              </Container>
              <Container>
                <Grid item>
                  <Button variant="outlined" type="submit">
                    Change Email
                  </Button>
                  <Button variant="outlined" type="submit">
                    Change Password
                  </Button>
                </Grid>
              </Container>
            </Grid>
          </Container>
        </form>
      </fieldset>
    </div>
  );
}

export default AccountSettingsPage;
