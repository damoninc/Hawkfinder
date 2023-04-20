import React, { useEffect, useState } from "react";
import User, { userConverter } from "../../data/User";
import "../../styles/Profile.css";
import { getDoc, doc } from "firebase/firestore";
import { db, storage } from "../../firebase/config";
import { ref, getDownloadURL } from "firebase/storage";
import { Box, Paper, Typography } from "@mui/material";
import EditPage from "./EditPage";
import CurrentSong, { TopSongs } from "../SpotifyIntegration/SpotifyComponents";
import Forum from "../Forum/Forum";

/**
 * This is the main profile page that displays a users profile
 * @param passedUser the user that is authenticated.
 * @returns the webpage
 */
function ProfilePage(passedUser: any) {
  const hashParams = window.location.hash.split("#")[1];
  const urlParams = new URLSearchParams(hashParams);
  let uid = urlParams.get("userid");

  console.log(urlParams);
  console.log(uid);
  const passedUserObj: string = passedUser.uCreds; //Feel free to change this to the passed in object for testing. Make sure its of type string.
  const [userPage, setUserPage] = useState<any>();
  const [userProfPic, setUserProfPic] = useState("");
  const [userCoverPic, setUserCoverPic] = useState("");
  const [spotifyUser, setSpotifyUser] = useState<User | undefined>(undefined);

  if (uid == null) {
    uid = passedUserObj;
  }
  const docRef = doc(db, "Users", uid!);
  useEffect(() => {
    getDoc(docRef)
      .then((docSnap) => {
        const userToSpotify: User | undefined =
          userConverter.fromFirestore(docSnap);
        setSpotifyUser(userToSpotify);
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

  // Required to keep the DOM happy.
  if (!userPage || !userProfPic || !userCoverPic) {
    return (
      <div hidden>
        {EditPage(userPage, docRef, passedUserObj)}
        <Forum uCreds={uid} />
      </div>
    );
  }

  return (
    <div className="body">
      <Paper className="profile-info" sx={{ mt: "10px", borderRadius: 10 }}>
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
        {EditPage(userPage, docRef, passedUserObj)}
      </Paper>
      <Box className="second-row" sx={{ flexWrap: "wrap" }}>
        {spotifyUser != undefined ? (
          <Paper className="spotify-info" sx={{ borderRadius: 10 }}>
            <Box className="spotify-box" sx={{ padding: 3 }}>
              <CurrentSong user={spotifyUser} small={false} />
            </Box>
          </Paper>
        ) : (
          <p> we've gone silent</p>
        )}
        <Paper className="about-and-info" sx={{ borderRadius: 10 }}>
          <Box className="body-inner" sx={{ flexWrap: "wrap" }}>
            <Paper
              className="about"
              elevation={10}
              sx={{ borderRadius: "12px" }}
            >
              <Box className="about-title">
                <Typography sx={{ fontWeight: "bold" }}> About Me</Typography>
                <br></br>
              </Box>
              <Box sx={{ overflowY: "scroll" }}>
                <Typography sx={{ m: 2 }}>{userPage?.profile.bio}</Typography>
              </Box>
            </Paper>
            <Paper
              className="interests"
              elevation={10}
              sx={{ borderRadius: "12px" }}
            >
              <Box className="My-Interests">
                <Typography sx={{ fontWeight: "bold" }}>
                  My Interests
                </Typography>
                <br></br>
              </Box>
              <Box sx={{ overflowY: "scroll", width: "100%" }}>
                <ul className="list">
                  {userPage?.profile.interests.map((interest: any) => (
                    <li key={interest}>{interest}</li>
                  ))}
                </ul>
              </Box>
            </Paper>
          </Box>
        </Paper>
      </Box>
      <br />
      <Forum uCreds={uid} />
    </div>
  );
}
export default ProfilePage;
