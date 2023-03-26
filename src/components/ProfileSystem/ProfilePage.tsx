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
  DocumentData,
} from "firebase/firestore";
import { auth } from "../../App";
import { db } from "../../App";
import Navbar from "../Navbar/Navbar";
import { Autocomplete, Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";


/**
 * Firebase implementation is required for all
 *
 * This will be changed later to check for authentication and so on.
 */

const docRef = doc(db, "Users", "sq0kklKJQLYTuFQ6IQf6fzxi4Iu1");
const docSnap = await getDoc(docRef);
export const user = getUser();

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

  function InterestHook(){
    const interests = ['Video games', 'Music', 'Cars', 'Technology', 'Business', 'Fishing'];
    return (
      <Stack spacing={3} >
        <Autocomplete
          multiple
          id="tags-standard"
          options={interests}
          getOptionLabel={(option) => option}
          defaultValue={user?.profile.interests}
          renderInput={(params) => (
            <TextField
              sx={{ width: "94%" }}
              {...params}
              variant="outlined"
              label="Interests"
              placeholder="Choose any"
              margin='normal'
            />
          )}
        />
      </Stack>
    );
  }

  if (user?.userid == "sq0kklKJQLYTuFQ6IQf6fzxi4Iu1"){
    return (
      <Box>
        <Button sx = {{position: "absolute"}} onClick = {handleOpen} className = "edit-button" variant="outlined">Edit Profile</Button>
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
            <TextField label="First Name" variant="outlined" sx={{width: "45%", mr:1}} margin="normal" required={true}/>
            <TextField label="Last Name" variant="outlined" sx={{width: "45%", ml:1}} margin = "normal" required={true}/>
            <TextField label="About You" variant="outlined" sx = {{width: "94%"}} multiline={true} maxRows = "9"/>
            <InterestHook />
          </Box>
        </Modal>
      </Box>
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
      <Box className="profile-info">
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
      </Box>
      <Box className="about">
        <span className="about-title">
          <span>About Me</span>
          <br></br>
          <p>{user?.profile.bio}</p> {/* INSERT BIO */}
        </span>
      </Box>
      <Box className="interests">
        <span className="text4">
          <span>My Interests</span>
          <br></br>
        </span>
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