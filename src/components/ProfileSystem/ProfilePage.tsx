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

// !FIREBASE STUFF
const docRef = doc(db, "Users", "sq0kklKJQLYTuFQ6IQf6fzxi4Iu1");
const docSnap = await getDoc(docRef);
const user = getUser();
const userProfPic = getDownloadURL(
  ref(storage, user?.userid + "/Profile Pictures/profileimg.jpg")
);
const userCoverPic = ref(storage, user?.userid + "Cover Photos/coverphoto.jpg");

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

/**
 * This is the main profile page that displays a users profile
 * @returns the webpage
 */
function ProfilePage() {
  return (
    <>
      <Navbar />
      <Box className="profile-info">
        <img
          src={"/src/assets/images/coverphoto.jpg"}
          alt="image"
          className="cover-photo"
        />
        <span className="profile-name">
          <span>{user?.profile.firstName + " " + user?.profile.lastName}</span>
          <br></br>
        </span>
        <span className="friend-count">
          <span>{user?.friendsList.length + " Friends"}</span>
          <br />
        </span>
        <img
          src={"/src/assets/images/profileimg.jpg"}
          alt="image"
          loading="lazy"
          className="profile-photo"
        />
        {EditPage(user, docRef)}
      </Box>
      <Box className="about">
        <Box className="about-title">
          <Typography sx={{ fontWeight: "bold" }}> About Me</Typography>
          <br></br>
        </Box>
        <Typography sx={{ m: 2 }}>{user?.profile.bio}</Typography>
      </Box>
      <Box className="interests">
        <Box className="text4">
          <Typography sx={{ fontWeight: "bold" }}>My Interests</Typography>
          <br></br>
        </Box>
        <ul className="list">
          {user?.profile.interests.map((interest: any) => (
            <li key={interest}>{interest}</li>
          ))}
        </ul>
      </Box>
    </>
  );
}
export default ProfilePage;
