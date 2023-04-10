import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { db, storage } from "../../firebase/config";
import {
  FormControl,
  Button,
  MenuItem,
  Select,
  InputLabel,
  Popover,
  Typography,
} from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from "@firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import "../../styles/postinput.css";

const PostInput = ({ reloadForum }: any) => {
  // HOOKS ----------------------------------------------------------------
  // These hooks keep track of user input
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [interest, setInterest] = useState("");
  const [postText, setPostText] = useState("");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

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
    uploadBytes(postsRef, image, metadata)
      .then(() => {
        console.log("Uploaded image! File: " + image);
      })
      .catch(() => {
        console.log("error uploading to firebase");
      });
  }

  /**
   * Determines if the user input is valid and writes it to Firebase
   * Also reloads the Forum component when the button is clicked
   */
  async function handlePost() {
    if (postText != "" && interest != "") {
      console.log("DB WRITE");
      const docRef = await addDoc(collection(db, "Posts"), {
        description: postText,
        imageURL: "",
        interest: interest,
        postDate: serverTimestamp(),
        ratings: Object.fromEntries(new Map<string, string>()),
        userID: "sq0kklKJQLYTuFQ6IQf6fzxi4Iu1",
      });
      // Using the doc.id generated above to use as a unique reference
      // that the post will use to get the image from storage
      if (selectedImage) {
        const imgID: string = docRef.id;
        const imgExt = selectedImage.name.split(".").pop();
        const imgName = imgID + "." + imgExt;
        // UPLOADING IMG TO FIREBASE STORAGE
        const newFile: File = renameFile(selectedImage, imgName);
        setTimeout(() => {
          // Lets the app upload the file before reloading the page
          // so that the upload does not get interrupted
          uploadImage(newFile);
        }, 1500);
        // UPDATING POST DOCUMENT WITH POINTER TO FIREBASE STORAGE
        await updateDoc(docRef, {
          imageURL: imgName,
        });
      }
      setSelectedImage(null);
      setInterest("");
      setPostText("");
      reloadForum();
    } else {
      console.log(
        "Post not sent, you must select an interest and enter text input!"
      );
    }
  }

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
      <FormControl className="interest-input">
        <InputLabel>Interest</InputLabel>
        <Select
          label="Interest"
          value={interest}
          onChange={(event: React.ChangeEvent<HTMLInputElement> | any) => {
            setInterest(event.target.value);
          }}
        >
          <MenuItem value={"Music"}>Music</MenuItem>
          <MenuItem value={"Food"}>Food</MenuItem>
          <MenuItem value={"Film"}>Film</MenuItem>
        </Select>
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
      {postText != "" && interest != "" ? (
        <Button
          className="post-button"
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
            disabled
            aria-haspopup="true"
            aria-owns={open ? "mouse-over-popover" : undefined}
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          >
            Post
          </Button>
          <Popover
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
