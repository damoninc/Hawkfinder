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
  onSnapshot,
} from "firebase/firestore";
import { auth } from "../../App";
import { db } from "../../App";
import Navbar from "../Navbar/Navbar";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useState } from "react";

/**
 * Firebase implementation is required for all
 *
 * This will be changed later to check for authentication and so on.
 */

const docRef = doc(db, "Users", "sq0kklKJQLYTuFQ6IQf6fzxi4Iu1");
const docSnap = await getDoc(docRef);
const user = getUser();

function getUser() {
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    return docSnap.data();
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


function EditPage(){
  // Modal Handlers
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Text Handlers

  if (user?.userid == "sq0kklKJQLYTuFQ6IQf6fzxi4Iu1"){
    return (
      <>
      <Button onClick = {handleOpen} className = "edit-button" variant="outlined">Edit Profile</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit your profile
          </Typography>
          <TextField label="First Name" variant="outlined" margin = "normal" required={true}/>
          <TextField label="Last Name" variant="outlined" margin = "normal" required={true}/>
          <TextField label="About You" variant="outlined" fullWidth = {true} multiline={true} maxRows = "9"/>
        </Box>
      </Modal>
      </>
    );
  }
  else{
    return null;
  } // as of right now it is hardcoded until we have a solution to check user credentials 
}
function ProfilePage() {
  return (
    <>
      <Navbar />
      <div className="profile-info">
          <img
            src={"src/assets/images/coverphoto.jpg"}
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
          src={"src/assets/images/profileimg.jpg"}
          alt="image"
          loading="lazy"
          className="profile-photo"
        />
        <EditPage />
      </div>
      <div className="about">
        <span className="about-title">
          <span>About Me</span>
          <br></br>
          <p>{user?.profile.bio}</p> {/* INSERT BIO */}
        </span>
      </div>
      <div className="interests">
        <span className="text4">
          <span>My Interests</span>
          <br></br>
        </span>
        <ul className="list">
          {user?.profile.interests.map((interest: any) => (
            <li key={interest}>{interest}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
export default ProfilePage;
