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

  // console.log(urlParams);
  // console.log(uid);
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
    console.log("passed user: ", passedUserObj);
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
        <Forum passedUser={uid} userID={uid} />
      </div>
    );
  }

  return (
    <>
      <div className="body" style={{ overflowX: "hidden" }}>
        <Paper className="first-row" sx={{ mt: "10px", borderRadius: 10 }}>
          <img src={`${userCoverPic}`} className="cover-photo" loading="lazy" />
          <Typography
            id="testing profile name"
            className="profile-name"
            sx={{ fontWeight: "bold" }}
          >
            {userPage?.profile.firstName + " " + userPage?.profile.lastName}
          </Typography>
          <Typography className="friend-count">
            {userPage?.friendsList.length + " Friends"}
          </Typography>
          <Box className="profile-photo-container">
            <img
              src={`${userProfPic}`}
              loading="lazy"
              className="profile-photo"
            />
          </Box>
          {EditPage(userPage, docRef, passedUserObj)}
        </Paper>
        <Box className="second-row" sx={{ flexWrap: "wrap" }}>
          {spotifyUser?.spotify.accessToken != "null" ? (
            <Paper className="spotify-info" sx={{ borderRadius: 10 }}>
              <Box
                className="spotify-box"
                sx={{ m: "3", padding: 2, flexWrap: "wrap" }}
              >
                <Box className="current-song">
                  <CurrentSong user={spotifyUser!} small={false} />
                </Box>
                <Box className="top-songs">
                  <TopSongs user={spotifyUser!} small={true} />
                </Box>
              </Box>
            </Paper>
          ) : null}
          <Paper className="about-and-info" sx={{ borderRadius: 10 }}>
            <Box
              className="about-and-info-box"
              sx={{ m: "3", padding: 2, flexWrap: "wrap" }}
            >
              <Paper
                className="about"
                elevation={10}
                sx={{ borderRadius: "12px" }}
              >
                <Box className="about-title">
                  <Typography sx={{ fontWeight: "bold" }}> About Me</Typography>
                  <br></br>
                </Box>
                <Box sx={{ overflowY: "auto" }}>
                  <Typography sx={{ m: 2 }}>{userPage?.profile.bio}</Typography>
                </Box>
              </Paper>
              <Paper
                className="interests"
                elevation={10}
                sx={{ borderRadius: "12px" }}
              >
                <Box className="interests-title">
                  <Typography sx={{ fontWeight: "bold" }}>
                    My Interests
                  </Typography>
                  <br></br>
                </Box>
                <Box sx={{ overflowY: "auto", width: "100%" }}>
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
      </div>
      <Forum passedUser={uid} userID={passedUserObj} />
    </>
  );
}
export default ProfilePage;
