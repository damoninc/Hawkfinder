import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import User from "../../data/User";
import { db } from "../../firebase/config";
import axios from "axios";
import { Button } from "@mui/material";
import { ref } from "firebase/storage";

const spotifyLogo =
  "https://firebasestorage.googleapis.com/v0/b/csc-450-project.appspot.com/o/HAWKFINDER%2Fspotify-logo-7839B39C1B-seeklogo.com.png?alt=media&token=d84fdd6d-08da-4dcd-a9f5-99beba187849";

export default function SpotifyLogin(user: User) {
  const [data, setData] = useState("");
  if (user === undefined) {
    return <div></div>;
  }
  const urlParams = new URLSearchParams(window.location.hash.replace("#", "?"));
  const access_token = urlParams.get("access_token");
  const refresh_token = urlParams.get("refresh_token");

  if (access_token != null && refresh_token != null) {
    if (user.spotify.accessToken != access_token) {
      console.log("db access update");
      user.spotify.accessToken = access_token;
      updateDoc(
        doc(db, "Users", user.userid),
        "spotifyTokens.accessToken",
        user.spotify.accessToken
      );
    }
    if (user.spotify.refreshToken != refresh_token) {
      console.log("db refresh update");
      user.spotify.refreshToken = refresh_token;
      updateDoc(
        doc(db, "Users", user.userid),
        "spotifyTokens.refreshToken",
        user.spotify.refreshToken
      );
    }
  }

  if (data != null) {
    return (
      <div>
        <a
          href="/api/spotify"
          style={{ display: "flex", justifyContent: "space-evenly" }}
        >
          <Button variant="contained" color="primary">
            <img
              src={spotifyLogo}
              style={{ height: "60px", width: "60px", paddingRight: "10px" }}
            ></img>
            <h3>Authorize</h3>
          </Button>
        </a>
      </div>
    );
  } else {
    return <div></div>;
  }
}

export function SpotifyLogout(user: User) {
  if (user === undefined) {
    return <div></div>;
  }

  if (user.spotify.refreshToken != " ") {
    return (
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => logOut(user)}
        >
          <img
            src={spotifyLogo}
            style={{ height: "60px", width: "60px", paddingRight: "10px" }}
          ></img>
          <h3>De-Authorize</h3>
        </Button>
      </div>
    );
  } else {
    return <div></div>;
  }
}

function logOut(user: User) {
  if (user.spotify.accessToken != "null") {
    console.log("db access update");
    user.spotify.accessToken = "null";
    updateDoc(
      doc(db, "Users", user.userid),
      "spotifyTokens.accessToken",
      user.spotify.accessToken
    );
  }
  if (user.spotify.refreshToken != "null") {
    console.log("db refresh update");
    user.spotify.refreshToken = "null";
    updateDoc(
      doc(db, "Users", user.userid),
      "spotifyTokens.refreshToken",
      user.spotify.refreshToken
    );
  }
}
