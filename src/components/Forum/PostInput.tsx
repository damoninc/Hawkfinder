import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { db, storage } from "../../firebase/config";
import {
  FormControl,
  Button,
  MenuItem,
  Select,
  Input,
  InputLabel,
} from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from "@firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import "../../styles/postinput.css";

const PostInput = () => {
  // These hooks keep track of user input
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [interest, setInterest] = useState("");
  const [postText, setPostText] = useState("");

  // General style for input fields
  const sx = {
    maxHeight: "56px",
    marginRight: "3%",
  };

  // Styling specific for the interest selection box
  const interestsx = {
    maxHeight: "56px",
    marginRight: "3%",
    width: "100px",
  };

  /**
   * Renames the user's image input filename to the
   * id of the newly created Post
   * @param originalFile
   * @param newName
   * @returns updated File object
   */
  function renameFile(oldFile: File, newName: string) {
    return new File([oldFile], newName, {
      type: oldFile.type,
      lastModified: oldFile.lastModified,
    });
  }

  const metadata = {
    contentType: "image/jpeg",
  };

  /**
   * Uploads the user's image input to Firebase storage
   * @param image: Raw Image File
   */
  async function uploadImage(image: File) {
    const postsRef = ref(storage, "Posts/" + image.name);
    uploadBytes(postsRef, image, metadata).then(() => {
      console.log("Uploaded image!");
    });
  }

  async function handlePost() {
    if (postText != "") {
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
        const imgExt = selectedImage.name.split(".").pop();
        const imgName = imgID + "." + imgExt;
        // UPLOADING IMG TO FIREBASE STORAGE
        const newFile: File = renameFile(selectedImage, imgName);
        uploadImage(newFile);
        // UPDATING POST DOCUMENT WITH POINTER TO FIREBASE STORAGE
        await updateDoc(docRef, {
          imageURL: imgName,
        });
      }
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

      {/* <Input
        sx={sx}
        type="file"
        name="myImage"
        onChange={(event: React.ChangeEvent<HTMLInputElement> | any) => {
          setSelectedImage(event.target.files[0]);
        }}
      /> */}
      <Button variant="outlined" component="label">
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
        <Button type="submit" variant="outlined" disabled>
          Post
        </Button>
      )}
    </div>
  );
};

export default PostInput;
