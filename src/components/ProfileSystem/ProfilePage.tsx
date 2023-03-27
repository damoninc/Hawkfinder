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
import { auth } from "../../App";
import { db } from "../../App";
import { storage } from "../../App";
import Navbar from "../Navbar/Navbar";
import { Autocomplete, Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";



// !FIREBASE STUFF 
const docRef = doc(db, "Users", "sq0kklKJQLYTuFQ6IQf6fzxi4Iu1");
const interestRef = doc(db, "Interests", "Interests");
const docSnap = await getDoc(docRef);
const interestSnap = await getDoc(interestRef);
const user = getUser();
const baseInterests = interestSnap.data();

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
 * This is the edit page button. It is only visible if the logged in user matches the user's profile. 
 * A user can only see this on their own page.
 * @returns The edit page button/modal combo
 */
function EditPage(){
  if (user?.userid == "sq0kklKJQLYTuFQ6IQf6fzxi4Iu1"){
  // Modal Handlers
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Text Handlers

  // Interests

  /**
   * This function sends back the interest field that is used in the edit page modal.
   * @returns interest field
   */
  function InterestHook(){
    return (
      <Stack spacing={3} >
        <Autocomplete
          onChange={handleInterests}
          multiple
          id="tags-standard"
          options={baseInterests?.Interests}
          getOptionLabel={(option) => option}
          defaultValue={user?.profile.interests}
          value = {interests}
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

    const [firstName, setfirstname] = React.useState(user?.profile.firstname);
    const [lastName, setlastName] = React.useState(user?.profile.lastname);
    const [bio, setbio] = useState(user?.profile.bio);
    const [interests, setinterests] = React.useState(user?.profile.interests);

    const handlefirstName = (e: { target: { value: any; }; }) => {
      setfirstname(e.target.value);
    }

    const handlelastName = (e: { target: { value: any; }; }) => {
      setlastName(e.target.value);
    }

    const handleBio = (e: { target: { value: any; }; }) => {
      setbio(e.target.value);
    }

    const handleInterests = (event: any, newValue: string[]) => {
      setinterests(newValue);
    }

    const handleSave = () => {
      const dataToUpdate: any = {};
      if (firstName) {
        dataToUpdate['profile.firstName'] = firstName;
      }
      if (lastName) {
        dataToUpdate['profile.lastName'] = lastName;
      }
      if (bio) {
        dataToUpdate['profile.bio'] = bio;
      }
      if (interests) {
        dataToUpdate['profile.interests'] = interests;
      }
      updateDoc(docRef, dataToUpdate);
    }
    return (
      <Box>
        <Button sx = {{position: "absolute"}} onClick = {handleOpen} className = "edit-button" variant="outlined">Edit Profile</Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{position: 'absolute' as 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 400,
                  bgcolor: 'background.paper',
                  border: '2px solid #000',
                  boxShadow: 24,
                  p: 4,}}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Edit your profile
            </Typography>
            <TextField onChange = {handlefirstName} defaultValue = {user?.profile.firstName} label="First Name" variant="outlined" sx={{width: "45%", mr:1}} margin="normal" required={true}/>
            <TextField onChange = {handlelastName} defaultValue = {user?.profile.lastName} label="Last Name" variant="outlined" sx={{width: "45%", ml:1}} margin = "normal" required={true}/>
            <TextField onChange = {handleBio} defaultValue = {user?.profile.bio} label="About You" variant="outlined" sx = {{width: "94%"}} multiline={true} maxRows = "9"/>
            <InterestHook />
            <Button color="warning" onClick = {handleClose}>
            Cancel
            </Button>
            <Button sx={{position: "absolute", right:'50px'}} color="primary" onClick = {handleSave}>
              Save
            </Button>
          </Box>
        </Modal>
      </Box>
    );
  }
  else{
    return null;
  } // as of right now it is hardcoded until we have a solution to check user credentials between pages
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
        <Box className="about-title">
          <Typography sx={{fontWeight: "bold"}}> About Me</Typography>
          <br></br>
        </Box>
          <Typography sx={{m:2}}>{user?.profile.bio}</Typography>
      </Box>
      <Box className="interests">
        <Box className="text4">
          <Typography sx={{fontWeight: "bold"}}>My Interests</Typography>
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