import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import "../../styles/postinput.css";
import { getValue } from "@mui/system";
import { Button, MenuItem, Select, Input } from "@mui/material";

const PostInput = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [interest, setInterest] = useState("");
  const [postText, setPostText] = useState("");

  const sx = {
    maxHeight: "56px",
    marginRight: "3%",
  };

  //   function handleTextFieldChange(e) {
  //     setPostText
  //   }

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
          console.log(event.target.files[0]);
          setSelectedImage(event.target.files[0]);
        }}
      />
      <Select
        sx={Object.assign(sx, {})}
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
      <TextField
        sx={sx}
        value={postText}
        label="Share your interests..."
        variant="outlined"
        onChange={(e) => setPostText(e.target.value)}
      />
      <Button type="submit" variant="outlined">
        Post
      </Button>
    </div>
  );
};

export default PostInput;
