import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { db, storage } from "../../firebase/config";
import {
  FormControl,
  Button,
  MenuItem,
  Select,
  InputLabel,
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

// const PostInput = ({ reloadPosts }: { reloadPosts: () => void }) => {
const PostInput = ({ reloadForum }: any) => {
  // HOOKS ----------------------------------------------------------------
  // These hooks keep track of user input
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [interest, setInterest] = useState("");
  const [postText, setPostText] = useState("");

  /**
   * Renames the user's image input filename to the
   * id of the newly created Post
   * @param originalFile
   * @param newName
   * @returns updated File object
   */
  function renameFile(oldFile: File, newName: string) {
    return new File([oldFile], newName, {
      type: "image/jpeg",
      lastModified: oldFile.lastModified,
    });
  }

  // Any image uploaded will be turned into a jpg file
  const metadata = {
    contentType: "image/jpeg",
  };

  /**
   * Uploads the user's image input to Firebase storage
   * @param image: Raw Image File
   */
  function uploadImage(image: File) {
    const postsRef = ref(storage, "Posts/" + image.name);
    uploadBytes(postsRef, image, metadata).then(() => {
      console.log("Uploaded image!");
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
        userID: "jgj4899fwre8j49",
      });
      // Using the doc.id generated above to use as a unique reference
      // that the post will use to get the image from storage
      if (selectedImage) {
        const imgID = docRef.id;
        const imgName = imgID + ".jpg";
        // UPLOADING IMG TO FIREBASE STORAGE
        const newFile: File = renameFile(selectedImage, imgName);
        uploadImage(newFile);
        // UPDATING POST DOCUMENT WITH POINTER TO FIREBASE STORAGE
        await updateDoc(docRef, {
          imageURL: imgName,
        });
      }
      setSelectedImage(null);
      setInterest("");
      setPostText("");
      reloadForum();
      // reloadPosts();
    } else {
      console.log(
        "Post not sent, you must select an interest and enter text input!"
      );
    }
  }

  return (
    <div className="post-input">
      <TextField
        className="text-input"
        value={postText}
        label="Share your interests..."
        variant="outlined"
        multiline
        rows={4}
        onChange={(e) => setPostText(e.target.value)}
      />
      {selectedImage && (
        <div className="post-input-img">
          <img
            alt="post-input-img"
            height={"100px"}
            src={URL.createObjectURL(selectedImage)}
          />
          <br />
          {/* <button className="remove-img" onClick={() => setSelectedImage(null)}>
            <HighlightOffIcon />
          </button> */}
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
          accept="image/*"
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
        <Button
          className="post-button"
          type="submit"
          variant="outlined"
          disabled
        >
          Post
        </Button>
      )}
    </div>
  );
};

export default PostInput;
