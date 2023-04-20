import { Button, Container, Grid, Paper, TextField } from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
function ResetPasswordEmail() {
  const [emailThing, setEmailThing] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function sentResetLink() {
    if (checkValidEmail()) {
        console.log("LGTM")
        console.log(emailThing);
    }
    
  }

  function checkValidEmail() {
    if (!emailThing) {
        setErrorMessage("You must put your email")
        return false
    }
    else if (!emailThing.includes('@')) {
        setErrorMessage("Emails must contain @")
        return false
    }
    else {
        setErrorMessage("");
        return true
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
                  error={
                    Boolean(errorMessage)
                  }
                  helperText={
                    errorMessage
                  }
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
                <Link to="/"
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
      </Paper>
    </div>
  );
}

export default ResetPasswordEmail;
