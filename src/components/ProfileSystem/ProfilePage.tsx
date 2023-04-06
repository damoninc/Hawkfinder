import React, { useEffect, useState } from "react";
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
  DocumentSnapshot,
} from "firebase/firestore";
import { auth, db, storage } from "../../firebase/config";
import { ref, getDownloadURL } from "firebase/storage";
import Navbar from "../Navbar/Navbar";
import { Box, Typography } from "@mui/material";
import EditPage from "./EditPage";

/**
 * This is the main profile page that displays a users profile
 * @returns the webpage
 */
//! END OF PAGE OWNER INFO

function ProfilePage() {
  const passedUserObj = "sq0kklKJQLYTuFQ6IQf6fzxi4Iu1";

  const [userPage, setUserPage] = useState<any>();
  const [userProfPic, setUserProfPic] = useState("");
  const [userCoverPic, setUserCoverPic] = useState("");

  const docRef = doc(db, "Users", passedUserObj);
  useEffect(() => {
    getDoc(docRef)
      .then((docSnap) => {
        const userPageData = docSnap.data();
        setUserPage(userPageData);
        const userProfPicRef = ref(
          storage,
          userPageData?.profile.profilePicture
        );
        const userCoverPicRef = ref(storage, userPageData?.profile.coverPhoto);
        Promise.all([
          getDownloadURL(userProfPicRef),
          getDownloadURL(userCoverPicRef),
        ])
          .then(([userProfPicUrl, userCoverPicUrl]) => {
            setUserProfPic(userProfPicUrl);
            setUserCoverPic(userCoverPicUrl);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  if (!userPage || !userProfPic || !userCoverPic) {
    return <div hidden>{EditPage(userPage, docRef)}</div>;
  }

  const owner = userPage?.userid === window.localStorage.getItem("token");
  console.log(userPage.profile.firstName);
  console.log(userProfPic);
  return (
    <>
      <Navbar />
      <Box className="profile-info">
        <img src={`${userCoverPic}`} alt="image" className="cover-photo" />
        <span className="profile-name">
          <span>
            {userPage?.profile.firstName + " " + userPage?.profile.lastName}
          </span>
          <br></br>
        </span>
        <span className="friend-count">
          <span>{userPage?.friendsList.length + " Friends"}</span>
          <br />
        </span>
        <img
          src={`${userProfPic}`}
          alt="image"
          loading="lazy"
          className="profile-photo"
        />
        {EditPage(userPage, docRef)}
      </Box>
      <Box className="about">
        <Box className="about-title">
          <Typography sx={{ fontWeight: "bold" }}> About Me</Typography>
          <br></br>
        </Box>
        <Typography sx={{ m: 2 }}>{userPage?.profile.bio}</Typography>
      </Box>
      <Box className="interests">
        <Box className="text4">
          <Typography sx={{ fontWeight: "bold" }}>My Interests</Typography>
          <br></br>
        </Box>
        <ul className="list">
          {userPage?.profile.interests.map((interest: any) => (
            <li key={interest}>{interest}</li>
          ))}
        </ul>
      </Box>
    </>
  );
}
export default ProfilePage;
