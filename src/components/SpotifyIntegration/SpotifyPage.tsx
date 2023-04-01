import React, { useState } from "react";
import User, { userConverter } from "../../data/User";
import "../../styles/friendpage.css";
import { db } from "../../firebase/config";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import SpotifyLogin from "../SpotifyIntegration/SpotifyLogin";
import CurrentSong from "./CurrentSong";

// use: concurrently "npm run dev" "npm run start"    
// to run server and vite at the same time

const currUser = "sq0kklKJQLYTuFQ6IQf6fzxi4Iu1";
export let user: User;

let dbPulled = false;

/**
 * Generates a HTML block that displays a user's friend list by creating
 *    a FriendBox for each friend in their friend list.
 * Shows all friends or a "no friends" message is applicable.
 *
 * @return {*} - FriendPage HTML
 */
function SpotifyPage() {
  const [dbCall, setUser] = useState(null);
  if (!dbPulled || dbCall == null) {
    callDB(setUser);
  }
  return (
    <div>
      {SpotifyLogin(user)}
      {/* {CurrentSong(user)} */}
    </div>
  );
}

/**
 * Function used to query FireBase for the friends list.
 * Sets friends Hook in FriendPage after database call finished
 *
 * @param {*} setFriends - Hook to set friends list
 */
async function callDB(setUser: any) {
  // Query Firestore for information from currently logged in user
  const querySnapshot = await getDoc(
    doc(db, "Users", currUser).withConverter(userConverter)
  );
  console.log("DB Call");
  const dbUser = querySnapshot.data();
  if (dbUser !== undefined) {
    user = dbUser;
    setUser(user);
  }
  dbPulled = true;
}

export default SpotifyPage;
