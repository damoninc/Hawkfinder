import React, { useEffect } from "react";
import { useState } from "react";
import { db, storage } from "../../firebase/config";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import { IconButton } from "@mui/material";
import "../../styles/forumpost.css";
import { getDownloadURL, ref } from "firebase/storage";
import { doc, getDoc } from "@firebase/firestore";

function ForumPost(props: any) {
  // Creates a pointer reference to the image of the post
  const imageRef = ref(storage, "Posts/" + props.id + ".jpg");

  /**
   * Grabs the appropriate image URL for the
   * specific post that is rendered
   */
  useEffect(() => {
    if (props.imageURL != "") {
      getDownloadURL(imageRef)
        .then((url) => {
          setImage(url);
        })
        .catch(() => {
          console.log("Error fetching image");
        });
    }
    const docRef = doc(db, "Posts", props.id);
    const docSnap = getDoc(docRef);
  }, []);

  /**
   * TODO: Pass user to the forum to use for this function
   *       Will make use of the docSnap variable from useEffect
   * Determines if the signed in user has upvoted the post
   */
  // const userRating = () => {

  // }

  // HOOKS ----------------------------------------------------------------
  // Hook for the ratings of each post
  const [ratings, setRatings] = useState(props.rating);
  // Determines whether the user has upvoted
  const [upvoted, setUpvoted] = useState(false);
  // Determines whether the user has downvoted
  const [downvoted, setDownvoted] = useState(false);
  // The image of the post
  const [image, setImage] = useState("");

  /**
   * Handles the logic for upvoting
   * @param e: MouseEvent
   */
  const upvote = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    /**
     * stopPropgation prevents events from bubbling and only runs
     * this function (instead of this function AND showing the modal)
     */
    e.stopPropagation();
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

  /**
   * Handles the logic for downvoting
   * @param e: MouseEvent
   */
  const downvote = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
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
    // Data passed in from props
    // {props.postID}
    // {props.postDate.toString}
    // {props.description}
    // {props.interest}
    // {props.imageURL}
    // {props.ratings}
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
         * on the state of upvoted and downvoted, and eventually, what
         * the user had upvoted/downvoted previously
         */}

        <div className="rating-button-container">
          {!upvoted ? (
            <IconButton className="rating-button" onClick={(e) => upvote(e)}>
              <ArrowCircleUpIcon
                fontSize="large"
                color="primary"
                style={{ fill: "black" }}
              />
            </IconButton>
          ) : (
            <IconButton className="rating-button" onClick={(e) => upvote(e)}>
              <ArrowCircleUpIcon fontSize="large" color="primary" />
            </IconButton>
          )}
        </div>

        <span className="rating">{ratings}</span>

        <div className="rating-button-container">
          {!downvoted ? (
            <IconButton className="rating-button" onClick={(e) => downvote(e)}>
              <ArrowCircleDownIcon
                fontSize="large"
                color="primary"
                style={{ fill: "black" }}
              />
            </IconButton>
          ) : (
            <IconButton className="rating-button" onClick={(e) => downvote(e)}>
              <ArrowCircleDownIcon fontSize="large" color="primary" />
            </IconButton>
          )}
        </div>
      </div>
      <span className="post-interest">{props.interest}</span>
      {/* TODO: Consider changing the format of post date to something else */}
      <span className="post-date">{props.postDate.toDateString()}</span>
    </div>
  );
}

export default ForumPost;
