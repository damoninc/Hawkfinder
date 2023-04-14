import React from "react";
import { CircularProgress, Typography } from "@mui/material";

export default function LoadingPage(text: string) {
  return (
    <div className="loadFriend">
      <Typography>{text}</Typography>
      {/* <img
        src={"src/assets/images/My_project.png"}
        style={{
          height: "100px",
          width: "100px",
          borderRadius: "50px",
          marginTop: "10px",
        }}
      /> */}
      <CircularProgress />
    </div>
  );
}
