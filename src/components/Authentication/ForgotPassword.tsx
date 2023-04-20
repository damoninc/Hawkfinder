import { Button, Container, Grid, Paper, TextField } from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
function ResetPasswordEmail() {
  const [emailThing, setEmailThing] = useState("");

  function sentResetLink() {
    console.log(emailThing);
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
