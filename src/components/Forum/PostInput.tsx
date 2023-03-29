import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { auth, db, storage } from "../../firebase/config";
import {
  FormControl,
  Button,
  MenuItem,
  Select,
  Input,
  InputLabel,
} from "@mui/material";
import "../../styles/postinput.css";
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
} from "@firebase/firestore";

const PostInput = () => {
  // These hooks keep track of the input by the user for their post
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [interest, setInterest] = useState("");
  const [postText, setPostText] = useState("");

  // General style for input fields
  const sx = {
    maxHeight: "56px",
    marginRight: "3%",
  };

  const interestsx = {
    maxHeight: "56px",
    marginRight: "3%",
    width: "100px",
  };

  /**
   * Temporary functionality for posting to the forum,
   * only console.logs the input
   */
  async function handlePost() {
    if (postText != "") {
      console.log("DB WRITE");
      const docRef = await addDoc(collection(db, "Posts"), {
        description: postText,
        imageURL: selectedImage.name,
        interest: interest,
        postDate: serverTimestamp(),
        ratings: Object.fromEntries(new Map<string, string>()),
        userID: "jgj4899fwre8j49",
      });
      console.log("Document written with ID: ", docRef.id);
    } else {
      console.log("Post not sent, there must be text input!");
    }
  }

  return (
    <div className="post-input">
      {selectedImage && (
        <div>
          <img
            alt="post-input-img"
            height={"100px"}
            src={URL.createObjectURL(selectedImage)}
          />
          <br />
          <button onClick={() => setSelectedImage(null)}>Remove</button>
        </div>
      )}

      <Input
        sx={sx}
        type="file"
        name="myImage"
        onChange={(event: React.ChangeEvent<HTMLInputElement> | any) => {
          setSelectedImage(event.target.files[0]);
        }}
      />
      <FormControl>
        <InputLabel>Interest</InputLabel>
        <Select
          sx={interestsx}
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
      <TextField
        sx={sx}
        value={postText}
        label="Share your interests..."
        variant="outlined"
        onChange={(e) => setPostText(e.target.value)}
      />
      {/* If there is text any post text inputted, 
      then the user can click the post button */}
      {postText != "" ? (
        <Button type="submit" variant="outlined" onClick={handlePost}>
          Post
        </Button>
      ) : (
        <Button type="submit" variant="outlined" onClick={handlePost} disabled>
          Post
        </Button>
      )}
    </div>
  );
};

export default PostInput;
