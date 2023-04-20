import { Button, Container, Grid, Link, Paper, TextField } from "@mui/material";
import React, { useState } from "react";

function ResetPasswordEmail() {
  const [emailThing, setEmailThing] = useState("");

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
                <Button variant="contained" color="primary">
                  Login
                </Button>
              </Grid>
            </Container>
          </Grid>
        </Container>
      </Paper>
    </div>
  );
}

export default ResetPasswordEmail;