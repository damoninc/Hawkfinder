import React from "react";
import { CircularProgress, Stack, Typography } from "@mui/material";

/**
 * Returns a page that can be used to show indefinite loading.
 *
 * @export
 * @param {string} text - The text to display above the loading icon
 * @return {*}
 */
export default function LoadingPage(text: string) {
  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={3}
      sx={{ padding: "30px" }}
      width="100%"
    >
      <Typography variant="h5">
        <b>{text}</b>
      </Typography>
      <img
        src={
          "https://firebasestorage.googleapis.com/v0/b/csc-450-project.appspot.com/o/HAWKFINDER%2FMy_project.png?alt=media&token=9c88ec23-9c4e-46b7-8eb9-a907be7b2cfc"
        }
        style={{
          height: "150px",
          width: "150px",
          marginTop: "10px",
        }}
      />
      <CircularProgress size={60} />
    </Stack>
  );
}
