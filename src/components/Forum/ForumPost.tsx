import React from "react";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import { IconButton } from "@mui/material";
import "../../styles/forumpost.css";

function ForumPost(props: any) {
  // Hook for the ratings of each post
  const [ratings, setRatings] = useState(props.rating);
  // Determines whether the user has upvoted
  const [upvoted, setUpvoted] = useState(false);
  // Determines whether the user has downvoted
  const [downvoted, setDownvoted] = useState(false);

  const upvote = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    /**
     * stopPropgation prevents events from bubbling and only runs
     * this function (instead of this function AND the modal)
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

  const postImgPath = `/src/assets/images/${props.imageURL}`;
  return (
    // Data passed in from props
    /* {props.postID}
        {props.postDate.toString}
        {props.description}
        {props.interest}
        {props.imageURL}
        {props.ratings} */
    <div className="post-container">
      <div className="pic-crop">
        <img className="profile-pic" src="\src\assets\images\profileimg.jpg" />
      </div>
      <div className="post-img-container">
        {props.imageURL !== "" ? (
          <img className="post-img" src={postImgPath} />
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

        <div className="rating-button-container">
          {!upvoted ? (
            // <FaRegArrowAltCircleUp onClick={upvote} size={25} />
            <IconButton className="rating-button" onClick={(e) => upvote(e)}>
              <ArrowCircleUpIcon
                fontSize="large"
                color="primary"
                style={{ fill: "black" }}
              />
            </IconButton>
          ) : (
            <IconButton className="rating-button" onClick={(e) => upvote(e)}>
              <ArrowCircleUpIcon
                fontSize="large"
                color="primary"
                style={{ fill: "blue" }}
              />
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
      {/* <Link to="/components/Forum/post" state={props}>
        <div className="expand-post-icon">
          <OpenWithIcon />
        </div>
      </Link> */}
    </div>
  );
}

export default ForumPost;
