import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { db, storage } from "../../firebase/config";
import {
  FormControl,
  Button,
  Popover,
  Typography,
  Autocomplete,
} from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "@firebase/firestore";
import { ref, uploadBytesResumable } from "firebase/storage";
import "../../styles/postinput.css";

const PostInput = (props: any) => {
  // HOOKS ----------------------------------------------------------------
  // Keep track of user input
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [interest, setInterest] = useState("");
  const [postText, setPostText] = useState("");
  // Will be used for the popover
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  // Stores the interests from Firestore
  const [interests, setInterests] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    getInterests();
  }, []);

  /**
   * Gets all the interests from Firestore
   */
  const getInterests = async () => {
    const interestRef = doc(db, "Interests", "Interests");
    const interestSnap = await getDoc(interestRef);
    if (interestSnap.exists()) {
      setInterests(interestSnap.data().Interests);
    } else {
      console.log("Doc does not exist...");
    }
  };

  /**
   * Renames the user's image input filename to the
   * id of the newly created Post
   * @param originalFile
   * @param newName
   * @returns updated File object
   */
  function renameFile(oldFile: File, newName: string) {
    const blob = oldFile.slice(0, oldFile.size, oldFile.type);
    return new File([blob], newName, { type: oldFile.type });
  }

  /**
   * Uploads the user's image input to Firebase storage
   * @param image: Raw Image File
   */
  function uploadImage(image: File) {
    const postsRef = ref(storage, "Posts/" + image.name);
    const metadata = {
      contentType: image.type,
    };

    const uploadTask = uploadBytesResumable(postsRef, image, metadata);

    // This makes sure that the upload completes before the Forum is reloaded
    uploadTask.on("state_changed", {
      error: (error) => {
        console.log("Error occurred while uploading: ", error);
      },
      complete: () => {
        // Once the upload is complete, reset the hooks
        // and reload the Forum
        setSelectedImage(null);
        setInterest("");
        setPostText("");
        console.log("Upload complete!");
        props.reloadForum();
      },
    });
  }

  /**
   * Determines if the user input is valid and writes it to Firebase
   * Also reloads the Forum component when the button is clicked
   */
  async function handlePost() {
    // Disables the POST button once a post is submitted
    setSubmitted(true);

    if (postText != "" && interest != "") {
      const docRef = await addDoc(collection(db, "Posts"), {
        description: postText,
        imageURL: "",
        interest: interest,
        postDate: serverTimestamp(),
        ratings: Object.fromEntries(new Map<string, string>()),
        userID: props.userID,
      });
      // Using the doc.id generated above to use as a unique reference
      // that the post will use to get the image from storage
      if (selectedImage) {
        const imgID: string = docRef.id;
        const imgExt = selectedImage.name.split(".").pop();
        const imgName = imgID + "." + imgExt;
        // UPLOADING IMG TO FIREBASE STORAGE
        const newFile: File = renameFile(selectedImage, imgName);
        // UPDATING POST DOCUMENT WITH POINTER TO FIREBASE STORAGE
        await updateDoc(docRef, {
          imageURL: imgName,
        });
        uploadImage(newFile);
      } else {
        // This line only runs if no image was uploaded
        props.reloadForum();
      }
    } else {
      console.log(
        "Post not sent, you must select an interest and enter text input!"
      );
    }
  }

  /**
   * The following three codeblocks will be used for the Popover MUI
   * component that is not yet implemented, will be during Sprint#4
   * @param event
   */
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div className="post-input">
      <TextField
        className="text-input"
        value={postText}
        label="Share your interests..."
        variant="outlined"
        multiline
        rows={4}
        sx={{ fieldset: { borderColor: "#00504e", borderWidth: "2px" } }}
        onChange={(e) => {
          if (e.target.value.length < 120) {
            setPostText(e.target.value);
          }
        }}
      />
      {selectedImage && (
        <div className="post-input-img">
          <img
            alt="post-input-img"
            height={"100px"}
            src={URL.createObjectURL(selectedImage)}
          />
          <br />
          <HighlightOffIcon
            className="remove-img"
            style={{ fill: "rgb(15, 15, 15)" }}
            onClick={() => setSelectedImage(null)}
          />
        </div>
      )}
      <FormControl
        className="interest-input"
        sx={{ fieldset: { borderColor: "#00504e", borderWidth: "2px" } }}
      >
        <Autocomplete
          onChange={(e, value) => {
            if (value) {
              setInterest(value);
            } else {
              setInterest("");
            }
          }}
          options={interests}
          getOptionLabel={(option) => option}
          renderInput={(params) => (
            <TextField
              sx={{ width: "100%" }}
              {...params}
              variant="outlined"
              label="Interests"
              placeholder="Choose any"
            />
          )}
        />
      </FormControl>
      <Button variant="outlined" component="label" className="upload-image">
        <FileUploadIcon style={{ fill: "teal" }} />
        <input
          type="file"
          accept="image/png, image/gif, image/jpeg, image/webp"
          onChange={(event: React.ChangeEvent<HTMLInputElement> | any) => {
            setSelectedImage(event.target.files[0]);
          }}
          hidden
        />
      </Button>
      {/* If there is text any post text inputted, 
      then the user can click the post button */}
      {postText != "" && interest != "" && !submitted ? (
        <Button
          className="post-button"
          id="post-button-enabled"
          type="submit"
          variant="outlined"
          onClick={handlePost}
        >
          Post
        </Button>
      ) : (
        <>
          <Button
            className="post-button-disabled"
            type="submit"
            variant="outlined"
            // disabled
            aria-haspopup="true"
            aria-owns={open ? "mouse-over-popover" : undefined}
            onClick={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          >
            Post
          </Button>
          <Popover
            id="mouse-over-popover"
            sx={{
              pointerEvents: "none",
            }}
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            onClose={handlePopoverClose}
            disableRestoreFocus
          >
            <Typography>
              You must type some text and select an interest!
            </Typography>
          </Popover>
        </>
      )}
    </div>
  );
};

export default PostInput;
