import {
  Button,
  Container,
  Grid,
  Paper,
  Snackbar,
  TextField,
} from "@mui/material";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../firebase/config";
import { FirebaseError } from "firebase/app";
function ResetPasswordEmail() {
  const [emailThing, setEmailThing] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function sentResetLink() {
    if (checkValidEmail()) {
      sendPasswordResetEmail(auth, emailThing)
        .then(() => {
          alert("Email sent!");
        })
        .catch((error: FirebaseError) => {
          switch (error.code) {
            case "auth/user-not-found":
              alert("User not found!");
              break;
            case "auth/invalid-email":
              alert("That's not a real email!");
              break;
            default:
              alert(`UH OH! Unknown error: ${error.code}.`);
              break;
          }
        });
    }
  }

  function checkValidEmail() {
    if (!emailThing) {
      setErrorMessage("You must put your email");
      return false;
    } else if (!emailThing.includes("@")) {
      setErrorMessage("Emails must contain @");
      return false;
    } else {
      setErrorMessage("");
      return true;
    }
  }

  return (
    <div className="centered">
      <Paper variant="outlined" className="loginSquare">
        <h1>Reset Password</h1>
        <Container className="formGaps">
          <Grid>
            <Container>
              <Grid item>
                <TextField
                  label="Enter Email"
                  id="password"
                  type="text"
                  value={emailThing}
                  onChange={(changedText) =>
                    setEmailThing(changedText.target.value)
                  }
                  error={Boolean(errorMessage)}
                  helperText={errorMessage}
                />
              </Grid>
            </Container>
            <Container>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={sentResetLink}
                >
                  Send Reset Email
                </Button>
              </Grid>
            </Container>
            <Container>
              <Grid item>
                <Link
                  to="/"
                  style={{
                    color: "#1ed5db",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  Back to login
                </Link>
              </Grid>
            </Container>
          </Grid>
        </Container>
      </Paper>
    </div>
  );
}

export default ResetPasswordEmail;
