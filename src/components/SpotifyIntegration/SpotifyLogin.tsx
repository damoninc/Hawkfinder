import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import User from "../../data/User";
import { db } from "../../firebase/config";
import axios from "axios";
import { Button } from "@mui/material";


export default function SpotifyLogin(user : User) {
  const [data, setData] = useState("")
  if (user === undefined) {
    return <div></div>
  }
  const urlParams = new URLSearchParams(window.location.hash.replace("#","?"))
  const access_token = urlParams.get("access_token")
  const refresh_token = urlParams.get("refresh_token")

  if (access_token != null && refresh_token != null) {
    const tokens = {
      accessToken: access_token,
      refreshToken: refresh_token
    }

    user.spotify = tokens
    updateDoc(doc(db, "Users", user.userid),"spotifyTokens.accessToken", user.spotify.accessToken)
    updateDoc(doc(db, "Users", user.userid),"spotifyTokens.refreshToken", user.spotify.refreshToken)
    
  }

  if (data != null) {
  return (
  <div>
    <a href="/api/spotify">Log in with Spotify</a>
    <p>data: {data}</p>
  </div>
  )}
  else {
    return <div></div>
  }
}