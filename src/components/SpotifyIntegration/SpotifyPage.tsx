import React, { useState } from "react";
import User, { userConverter } from "../../data/User";
import "../../styles/friendpage.css";
import { db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import CurrentSong, { RecentSongs, TopSongs } from "./SpotifyComponents";
import SpotifyAuthDeauth from "../SpotifyIntegration/SpotifyLogin";

// use: concurrently "npm run dev" "npm run start"
// to run server and vite at the same time

export let user: User;

let dbPulled = false;

/**
 * Generates a HTML block that displays a user's friend list by creating
 *    a FriendBox for each friend in their friend list.
 * Shows all friends or a "no friends" message is applicable.
 *
 * @return {*} - FriendPage HTML
 */
export default function SpotifyPage(uid: { uCreds: string }) {
  const [dbCall, setUser] = useState(null);
  if (!dbPulled || dbCall == null) {
    callDB(uid.uCreds, setUser);
  }
  return (
    <div style={{ display: "flex", justifyContent: "space-evenly" }}>
      <div>
        <h1>Authorize Spotify</h1>
        {SpotifyAuthDeauth(user)}
      </div>
      <div>
        <h1>Current Song</h1>
        <CurrentSong user={user} small={false} />
      </div>
      <div>
        <h1>Top Songs</h1>
        <TopSongs user={user} small={false} limit={10} />
      </div>
      <div>
        <h1>Recent Songs</h1>
        <RecentSongs user={user} small={false} limit={10} />
      </div>
    </div>
  );
}

async function callDB(uid: string, setUser: any) {
  // Query Firestore for information from currently logged in user
  const querySnapshot = await getDoc(
    doc(db, "Users", uid).withConverter(userConverter)
  );
  console.log("DB Call");
  const dbUser = querySnapshot.data();
  if (dbUser !== undefined) {
    user = dbUser;
    setUser(user);
  }
  dbPulled = true;
}
