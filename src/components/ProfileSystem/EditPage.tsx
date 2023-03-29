import {
  Stack,
  Autocomplete,
  TextField,
  Box,
  Button,
  Modal,
  Typography,
  IconButton,
} from "@mui/material";
import PortraitIcon from "@mui/icons-material/Portrait";
import PanoramaIcon from "@mui/icons-material/Panorama";
import { doc, DocumentData, getDoc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../../firebase/config";
const interestRef = doc(db, "Interests", "Interests");
const interestSnap = await getDoc(interestRef);
const baseInterests = interestSnap.data();

/**
 * This is the edit page button. It is only visible if the logged in user matches the user's profile.
 * A user can only see this on their own page.
 * @returns The edit page button/modal combo
 */
function EditPage(user: any, docRef: any) {
  if (user?.userid == "sq0kklKJQLYTuFQ6IQf6fzxi4Iu1") {
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
    const InterestHook = () => {
      return (
        <Stack spacing={3}>
          <Autocomplete
            onChange={handleInterests}
            multiple
            id="tags-standard"
            options={baseInterests?.Interests}
            getOptionLabel={(option) => option}
            defaultValue={user?.profile.interests}
            value={interests}
            renderInput={(params) => (
              <TextField
                sx={{ width: "100%" }}
                {...params}
                variant="outlined"
                label="Interests"
                placeholder="Choose any"
                margin="normal"
              />
            )}
          />
        </Stack>
      );
    };

    const [firstName, setfirstname] = React.useState(user?.profile.firstname);
    const [lastName, setlastName] = React.useState(user?.profile.lastname);
    const [bio, setbio] = useState(user?.profile.bio);
    const [interests, setinterests] = React.useState(user?.profile.interests);

    const handlefirstName = (e: { target: { value: any } }) => {
      setfirstname(e.target.value);
    };

    const handlelastName = (e: { target: { value: any } }) => {
      setlastName(e.target.value);
    };

    const handleBio = (e: { target: { value: any } }) => {
      setbio(e.target.value);
    };

    const handleInterests = (event: any, newValue: string[]) => {
      setinterests(newValue);
    };

    const handleSave = () => {
      const dataToUpdate: any = {};
      if (firstName) {
        dataToUpdate["profile.firstName"] = firstName;
      }
      if (lastName) {
        dataToUpdate["profile.lastName"] = lastName;
      }
      if (bio) {
        dataToUpdate["profile.bio"] = bio;
      }
      if (interests) {
        dataToUpdate["profile.interests"] = interests;
      }
      updateDoc(docRef, dataToUpdate);
      handleClose();
    };
    return (
      <Box>
        <Button
          sx={{ position: "absolute" }}
          onClick={handleOpen}
          className="edit-button"
          variant="outlined"
        >
          Edit Profile
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Edit your profile
            </Typography>

            <Box
              id="picture icons box"
              sx={{
                display: "flex", // add display property to enable flexbox layout
                justifyContent: "center",
              }}
            >
              <IconButton
                sx={{
                  borderRadius: "0px",
                  height: "150px",
                  width: "150px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <PortraitIcon
                    sx={{
                      fontSize: "80px",
                      color: "teal",
                    }}
                  />
                  <Typography sx={{ fontWeight: "bold" }}>
                    Change profile picture
                  </Typography>
                </Box>
              </IconButton>
              <IconButton
                sx={{
                  borderRadius: "0px",
                  height: "150px",
                  width: "150px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <PanoramaIcon
                    sx={{
                      fontSize: "80px",
                      color: "teal",
                    }}
                  />
                  <Typography sx={{ fontWeight: "bold" }}>
                    Change cover photo
                  </Typography>
                </Box>
              </IconButton>
            </Box>
            <TextField
              onChange={handlefirstName}
              defaultValue={user?.profile.firstName}
              label="First Name"
              variant="outlined"
              sx={{ width: "48%", pr: 1 }}
              margin="normal"
              required={true}
            />
            <TextField
              onChange={handlelastName}
              defaultValue={user?.profile.lastName}
              label="Last Name"
              variant="outlined"
              sx={{ width: "48%", pl: 1 }}
              margin="normal"
              required={true}
            />
            <TextField
              onChange={handleBio}
              defaultValue={user?.profile.bio}
              label="About You"
              variant="outlined"
              sx={{ width: "100%" }}
              multiline={true}
              maxRows="9"
            />

            <InterestHook />
            <Button color="warning" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              sx={{ position: "absolute", right: "50px" }}
              color="primary"
              onClick={handleSave}
            >
              Save
            </Button>
          </Box>
        </Modal>
      </Box>
    );
  } else {
    return null;
  } // as of right now it is hardcoded until we have a solution to check user credentials between pages
}
export default EditPage;
