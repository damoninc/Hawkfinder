import React from "react";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  FaRegArrowAltCircleDown,
  FaRegArrowAltCircleUp,
  FaArrowAltCircleDown,
  FaArrowAltCircleUp,
} from "react-icons/fa";
import { ArrowCircleUp, ArrowCircleDown, OpenWith } from "@mui/icons-material";
import { AiOutlineExpandAlt } from "react-icons/ai";
import "../../styles/forumpost.css";
import { IconButton } from "@mui/material";

function ForumPost(props: any) {
  const [ratings, setRatings] = useState(props.rating);
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);

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

  console.log("PROPS RECEIVED:", props);

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
            <IconButton className="rating-button" onClick={upvote}>
              <ArrowCircleUp
                fontSize="large"
                color="primary"
                style={{ fill: "black" }}
              />
            </IconButton>
          ) : (
            <IconButton className="rating-button" onClick={upvote}>
              <ArrowCircleUp
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
            <IconButton className="rating-button" onClick={downvote}>
              <ArrowCircleDown
                fontSize="large"
                color="primary"
                style={{ fill: "black" }}
              />
            </IconButton>
          ) : (
            <IconButton className="rating-button" onClick={downvote}>
              <ArrowCircleDown
                fontSize="large"
                color="primary"
                style={{ fill: "blue" }}
              />
            </IconButton>
          )}
        </div>
      </div>
      <span className="post-interest">{props.interest}</span>
      <Link to="/components/Forum/post" state={props}>
        <div className="expand-post-icon">
          <OpenWith />
        </div>
      </Link>
    </div>
  );
}

export default ForumPost;
