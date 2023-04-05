import React from "react";
import User from "../../data/User";
import "../../styles/Profile.css";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  onSnapshot,
  DocumentData,
} from "firebase/firestore";
import { auth, db, storage } from "../../firebase/config";
import { ref, getDownloadURL } from "firebase/storage";
import Navbar from "../Navbar/Navbar";
import { Box, Typography } from "@mui/material";
import EditPage from "./EditPage";

// !FIREBASE STUFF;
const docRef = doc(db, "Users", "sq0kklKJQLYTuFQ6IQf6fzxi4Iu1");
const docSnap = await getDoc(docRef);
const signedInUser = getUser();
const userProfPic = await getDownloadURL(
  ref(storage, signedInUser?.profile.profilePicture) //value here will be replaced with string in firestore
);
console.log(userProfPic);
const userCoverPic = await getDownloadURL(
  ref(storage, signedInUser?.profile.coverPhoto)
); //ditto

function getUser() {
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    return docSnap.data();
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
}
//! END OF FIREBASE STUFF
let owner: boolean;
if (signedInUser?.userid == window.localStorage.getItem("token")) {
  owner = true;
} else {
  owner = false;
}

/**
 * This is the main profile page that displays a users profile
 * @returns the webpage
 */
function ProfilePage() {
  return (
    <>
      <Navbar />
      <Box className="profile-info">
        <img src={`${userCoverPic}`} alt="image" className="cover-photo" />
        <span className="profile-name">
          <span>
            {signedInUser?.profile.firstName +
              " " +
              signedInUser?.profile.lastName}
          </span>
          <br></br>
        </span>
        <span className="friend-count">
          <span>{signedInUser?.friendsList.length + " Friends"}</span>
          <br />
        </span>
        <img
          src={`${userProfPic}`}
          alt="image"
          loading="lazy"
          className="profile-photo"
        />
        {owner && EditPage(signedInUser, docRef)}
      </Box>
      <Box className="about">
        <Box className="about-title">
          <Typography sx={{ fontWeight: "bold" }}> About Me</Typography>
          <br></br>
        </Box>
        <Typography sx={{ m: 2 }}>{signedInUser?.profile.bio}</Typography>
      </Box>
      <Box className="interests">
        <Box className="text4">
          <Typography sx={{ fontWeight: "bold" }}>My Interests</Typography>
          <br></br>
        </Box>
        <ul className="list">
          {signedInUser?.profile.interests.map((interest: any) => (
            <li key={interest}>{interest}</li>
          ))}
        </ul>
      </Box>
    </>
  );
}
export default ProfilePage;
