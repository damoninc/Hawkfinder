import { doc, updateDoc } from "firebase/firestore";
import React from "react";
import User from "../../data/User";
import { db } from "../../firebase/config";
import { Button } from "@mui/material";

const spotifyLogo =
  "https://firebasestorage.googleapis.com/v0/b/csc-450-project.appspot.com/o/HAWKFINDER%2Fspotify-logo-7839B39C1B-seeklogo.com.png?alt=media&token=d84fdd6d-08da-4dcd-a9f5-99beba187849";

/**
 * Returns a component that allows a user to authorize or de-authorize Hawkfinder's access to their spotify profile.
 *
 * @export
 * @param {User} user - user to link to spotify
 * @return {*}
 */
export default function SpotifyAuthDeauth(user: User) {
  if (user === undefined) {
    return <div></div>;
  }
  if (user.spotify.refreshToken == "null") {
    return SpotifyLogin(user);
  } else {
    return SpotifyLogout(user);
  }
}

function SpotifyLogin(user: User) {
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
}

function SpotifyLogout(user: User) {
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
  setTimeout(() => {
    window.location.reload();
  }, 1000);
}
