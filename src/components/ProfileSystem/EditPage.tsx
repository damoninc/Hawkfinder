import {
  Stack,
  Autocomplete,
  TextField,
  Box,
  Button,
  Modal,
  Typography,
  IconButton,
  ImageList,
  ImageListItem,
  Chip,
  InputAdornment,
  Paper,
} from "@mui/material";
import PortraitIcon from "@mui/icons-material/Portrait";
import PanoramaIcon from "@mui/icons-material/Panorama";
import {
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { db, storage } from "../../firebase/config";
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import * as filter from "leo-profanity";
import { MuiChipsInput } from "mui-chips-input";
import { BorderStyle } from "@mui/icons-material";
const interestRef = doc(db, "Interests", "Interests");
const interestSnap = await getDoc(interestRef);
const baseInterests = interestSnap.data();

/**
 * This is the edit page button. It is only visible if the logged in user matches the user's profile.
 * A user can only see this on their own page.
 * @param user Data for the user's profile
 * @param docRef Firebase document reference to the user's document
 * @param passedUserObj The authenticated user
 * @returns The edit page button/modal combo
 */
function EditPage(
  user: DocumentData | undefined,
  docRef: DocumentReference,
  passedUserObj: string,
) {
  const owner = user?.userid === passedUserObj;
  // MAIN EDIT PAGE MODAL HANDLERS
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // PHOTO MODAL HOOKS
  const [profilePhotoModal, setProfilePhotoModal] = useState(false);
  const [coverPhotoModal, setCoverPhotoModal] = useState(false);
  const [photosLoaded, setPhotosLoaded] = useState("");
  const [imageURLs, setImageURLs] = useState<string[]>([]);
  const [rawImages, setRawImages] = useState<string[]>([]);
  const [profilePicture, setProfilePicture] = useState("");
  const [coverPhoto, setCoverPhoto] = useState("");
  const [innerOpen, setInnerOpen] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectUploadPhoto, setSelectUploadPhoto] = useState<File>();

  // COVER PHOTO BUTTON
  const handleInnerOpenCover = () => {
    setCoverPhotoModal(true);
    setInnerOpen(true);
    setPhotosLoaded(user?.userid + "/Cover Photos");
  };
  // PROF PIC BUTTON
  const handleInnerOpenProfile = () => {
    setProfilePhotoModal(true);
    setInnerOpen(true);
    setPhotosLoaded(user?.userid + "/Profile Pictures");
  };

  // CLOSES INNER MODAL (PROF OR COVER)
  const handleInnerClose = () => {
    setProfilePhotoModal(false);
    setCoverPhotoModal(false);
    setInnerOpen(false);
    setPhotosLoaded("");
    setImageURLs([]);
    setRawImages([]);
  };

  // SETS BASED ON WHICH MODAL IS OPEN
  function handleInnerSelectPhoto(index: any) {
    if (profilePhotoModal) {
      setProfilePicture(rawImages[index]);
    }
    if (coverPhotoModal) {
      setCoverPhoto(rawImages[index]);
    }
  }

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (profilePhotoModal && fileInputRef.current) {
      console.log(file?.name);
      setSelectUploadPhoto(file);
    }
    if (coverPhotoModal && fileInputRef.current) {
      console.log(file?.name);
      setSelectUploadPhoto(file);
    }
  };

  const handleUploadPhoto = () => {
    if (fileInputRef.current) {
      console.log("Open!");
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    if (selectUploadPhoto && profilePhotoModal) {
      console.log("Huh!?!?!?!");
      uploadBytes(
        ref(
          storage,
          user?.userid + "/Profile Pictures/" + selectUploadPhoto.name
        ),
        selectUploadPhoto
      ).then(() => {
        console.log("Uploaded!");
        handleInnerClose();
        setTimeout(() => {
          handleInnerOpenProfile();
        }, 0.1);
      });
    }
    if (selectUploadPhoto && coverPhotoModal) {
      uploadBytes(
        ref(storage, user?.userid + "/Cover Photos/" + selectUploadPhoto.name),
        selectUploadPhoto
      )
        .then(() => {
          console.log("Uploaded!");
          handleInnerClose();
          setTimeout(() => {
            handleInnerOpenCover();
          }, 0.1);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [selectUploadPhoto]);

  // THIS LOADS PHOTOS INTO THE PHOTO MODAL
  useEffect(() => {
    if (photosLoaded) {
      // Retrieve a list of image references from Firebase Storage
      const listRef = ref(storage, photosLoaded);
      listAll(listRef)
        .then((res) => {
          const urls = res.items.map((itemRef) =>
            getDownloadURL(itemRef).then((url) => url)
          );
          Promise.all(urls).then((urls) => {
            setImageURLs(urls);
          });

          const images = res.items.map((itemRef) => itemRef.fullPath);
          Promise.all(images).then((images) => {
            setRawImages(images);
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [photosLoaded]);

  // First Modal Info
  const [firstName, setfirstname] = React.useState(user?.profile.firstname);
  const [lastName, setlastName] = React.useState(user?.profile.lastname);
  const [bio, setbio] = useState(user?.profile.bio);
  const [interests, setinterests] = React.useState(user?.profile.interests);
  const [customInterests, setCustomInterests] = React.useState<string[]>([]);

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
    console.log(newValue);
    setinterests(newValue);
  };

  const handleCustomInterests = (newValue: string[]) => {
    if (newValue[newValue.length - 1] === filter.clean(newValue[newValue.length -1]) && !baseInterests?.Interests.includes(newValue[newValue.length - 1]) ){
      setCustomInterests(newValue);
    }
    if (newValue.length < customInterests.length){
      setCustomInterests(newValue);
    }
  };


  const handleSave = () => {
    const dataToUpdate: any = {};
    const baseInterestDataToUpdate: any = {};
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
    if (profilePicture) {
      dataToUpdate["profile.profilePicture"] = profilePicture;
    }
    if (coverPhoto) {
      dataToUpdate["profile.coverPhoto"] = coverPhoto;
    }
    if (customInterests.length > 0){
      const updateInterests = user?.profile.interests;
      updateInterests?.push.apply(updateInterests, customInterests);
      console.log("Interests: ", updateInterests)
      dataToUpdate["profile.interests"] = updateInterests;

      const newBaseInterests: string[] = baseInterests?.Interests;
      newBaseInterests?.push.apply(newBaseInterests, customInterests);
      newBaseInterests.sort();
      console.log("Base Interests: ", newBaseInterests)
      baseInterestDataToUpdate["Interests"] = newBaseInterests;
    }
    updateDoc(docRef, dataToUpdate);
    updateDoc(interestRef, baseInterestDataToUpdate);
    handleClose();
  };

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
        <MuiChipsInput
          value={customInterests}
          onChange={handleCustomInterests}
          label="Don't see any interests?"
          placeholder="Add your own interests."
        />
      </Stack>
    );
  };

  const breakpoints = {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920
}

const getColumns = (width:any) => {
  if (width < breakpoints.sm){
    return {colCount: 3,
      rowPixels: 82}
  }
    else if (width < breakpoints.sm) {
        return {colCount: 3,
        rowPixels: 120}
    } else if (width < breakpoints.md) {
        return {colCount: 3, rowPixels: 164}
    } else if (width < breakpoints.lg) {
        return {colCount: 4, rowPixels: 164}
    } else if (width < breakpoints.xl) {
        return {colCount: 5, rowPixels: 164}
    } 
}

const [columns, setColumns] = useState(getColumns(window.innerWidth))
const updateDimensions = () => {
    setColumns(getColumns(window.innerWidth))
}

useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
}, []);


  function ImageLoader() {
    
    return (
      <>
        <ImageList sx={{ width: '100%', height: 400, rowGap:'0'}} cols={columns?.colCount} rowHeight={columns?.rowPixels}>
          {imageURLs.map((item, index) => (
            <ImageListItem
              sx={{
                width: columns?.rowPixels,
                height: columns?.rowPixels
              }}
              key={item}
            >
              <Button
                component="a"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: "100%",
                  height: "100%",
                }}
                onClick={() => handleInnerSelectPhoto(index)}
              >
                <img
                  src={`${item}?w=164&h=164&fit=cover&auto=format`}
                  srcSet={`${item}?w=164&h=164&fit=cover&auto=format&dpr=2 2x`}
                  loading="lazy"
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.filter = "brightness(0.8)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.filter = "none";
                  }}
                />
              </Button>
            </ImageListItem>
          ))}
        </ImageList>
      </>
    );
  }

  if (owner) {
    return (
      <Box>
        <Button
          sx={{ position: "absolute" }}
          onClick={handleOpen}
          className="edit-button"
          variant="contained"
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
              maxHeight: 700,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Edit your profile
            </Typography>
            <Box sx={{overflow: 'scroll', maxHeight: 500}}>
              <Paper sx={{p:3}}>

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
                onClick={handleInnerOpenProfile}
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
                onClick={handleInnerOpenCover}
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
              <Modal open={innerOpen} onClose={handleInnerClose}>
                <Box className = 'profile-cover-modal'
                  sx={{
                    position: "relative",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    maxWidth: '1000px',
                    bgcolor: "background.paper",
                    border: "2px solid #000",
                    boxShadow: 24,
                    p: 6,
                  }}
                >
                  <ImageLoader />
                  <Button color="warning" onClick={handleInnerClose}>
                    Back
                  </Button>
                  <Button
                    color="primary"
                    variant="contained"
                    sx={{ ml: 44, mr: 44 }}
                    onClick={handleUploadPhoto}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleFileInputChange}
                      accept="image/jpeg, image/png"
                    />
                    Upload Photo
                  </Button>
                  <Button
                    color="primary"
                    variant="outlined"
                    onClick={handleInnerClose}
                  >
                    Select
                  </Button>
                </Box>
              </Modal>
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
              </Paper>
            </Box>
            {EscapeButtons(handleClose, handleSave)}
          </Box>
        </Modal>
      </Box>
    );
  }
  function EscapeButtons(handlerClosing: any, handlerSaving: any) {
    return (
      <>
        <Button color="warning" onClick={handlerClosing}>
          Cancel
        </Button>
        <Button
          sx={{ position: "absolute", right: "50px" }}
          color="primary"
          onClick={handlerSaving}
        >
          Save
        </Button>
      </>
    );
  }
}
export default EditPage;
