import React from "react";
import { useState, useEffect } from "react";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import { IconButton } from "@mui/material";
import { storage } from "../../firebase/config";
import { getDownloadURL, ref } from "firebase/storage";

function PostView(props: any) {
  // Creates a pointer reference to the image of the post
  const imageRef = ref(storage, "Posts/" + props.id + ".jpg");

  // HOOKS ----------------------------------------------------------------
  // Hook for the ratings of each post
  const [ratings, setRatings] = useState(props.rating);
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);
  const [image, setImage] = useState("");

  const fetchImage = () => {
    if (props.imageURL != "") {
      console.log("getting image...");
      getDownloadURL(imageRef)
        .then((url) => {
          // const newURL = url + ".jpg";
          setImage(url);
          console.log("IMAGE: ", url);
        })
        .catch((err) => {
          console.log("Error fetching image");
        });
    }
  };

  useEffect(() => {
    fetchImage();
  }, []);

  const upvote = () => {
    if (!upvoted && !downvoted) {
      setRatings(ratings + 1);
      setUpvoted(true);
    } else if (!upvoted && downvoted) {
      setRatings(ratings + 2);
      setDownvoted(false);
      setUpvoted(true);
    } else {
      setRatings(ratings - 1);
      setUpvoted(false);
    }
  };

  const downvote = () => {
    if (!downvoted && !upvoted) {
      // Case where downvote and upvote are not set
      setRatings(ratings - 1);
      setDownvoted(true);
    } else if (!downvoted && upvoted) {
      // Case where post is upvoted
      setRatings(ratings - 2);
      setUpvoted(false);
      setDownvoted(true);
    } else {
      // Case where post is downvoted
      setRatings(ratings + 1);
      setDownvoted(false);
    }
  };

  return (
    <div className="post-container">
      <div className="pic-crop">
        <img className="profile-pic" src="\src\assets\images\profileimg.jpg" />
      </div>
      <div className="post-img-container">
        {props.imageURL !== "" ? (
          <img className="post-img" src={image} />
        ) : (
          <></>
        )}
      </div>
      <p className="post-description">{props.description}</p>
      <div className="ratings">
        {/**
         * The upvote and downvote buttons that are rendered will depend
         * on the state of upvoted and downvoted
         */}

        <div className="rating-button">
          {!upvoted ? (
            <IconButton className="rating-button" onClick={upvote}>
              <ArrowCircleUpIcon
                fontSize="large"
                color="primary"
                style={{ fill: "black" }}
              />
            </IconButton>
          ) : (
            <IconButton className="rating-button" onClick={upvote}>
              <ArrowCircleUpIcon
                fontSize="large"
                color="primary"
                style={{ fill: "blue" }}
              />
            </IconButton>
          )}
        </div>

        <span className="rating">{ratings}</span>

        <div className="rating-button">
          {!downvoted ? (
            <IconButton className="rating-button" onClick={downvote}>
              <ArrowCircleDownIcon
                fontSize="large"
                color="primary"
                style={{ fill: "black" }}
              />
            </IconButton>
          ) : (
            <IconButton className="rating-button" onClick={downvote}>
              <ArrowCircleDownIcon
                fontSize="large"
                color="primary"
                style={{ fill: "blue" }}
              />
            </IconButton>
          )}
        </div>
      </div>
      <span className="post-interest">{props.interest}</span>
    </div>
  );
}

export default PostView;
