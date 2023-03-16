import React from "react";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  FaRegArrowAltCircleDown,
  FaRegArrowAltCircleUp,
  FaArrowAltCircleDown,
  FaArrowAltCircleUp,
} from "react-icons/fa";
import { AiOutlineExpandAlt } from "react-icons/ai";
import "../../styles/forumpost.css";
import PostView from "../Post/PostView";

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

  const postImgPath = `/src/assets/images/${props.imageURL}`;

  return (
    // Data passed in from props
    /* {props._postID}
        {props._postDate.toString}
        {props._description}
        {props._interest}
        {props._imageURL}
        {props._ratings} */
    <div className="post-container">
      <div className="pic-crop">
        <img className="profile-pic" src="\src\assets\images\profileimg.jpg" />
      </div>
      <div className="post-img-container">
        <img className="post-img" src={postImgPath} />
      </div>
      <p className="post-description">{props.description}</p>
      <div className="ratings">
        {/**
         * The upvote and downvote buttons that are rendered will depend
         * on the state of upvoted and downvoted
         */}

        <div className="rating-button">
          {!upvoted ? (
            <FaRegArrowAltCircleUp onClick={upvote} size={25} />
          ) : (
            <FaArrowAltCircleUp onClick={upvote} size={25} />
          )}
        </div>

        <span className="rating">{ratings}</span>

        <div className="rating-button">
          {!downvoted ? (
            <FaRegArrowAltCircleDown onClick={downvote} size={25} />
          ) : (
            <FaArrowAltCircleDown onClick={downvote} size={25} />
          )}
        </div>
      </div>
      <span className="post-interest">{props.interest}</span>
      <Link to="/components/Forum/post" state={props}>
        <div className="expand-post-icon">
          <AiOutlineExpandAlt size={20} />
        </div>
      </Link>
      {/* <Routes>
        <Route
          path="/components/Forum/post"
          element={<PostView {...props} />}
        />
      </Routes> */}
    </div>
  );
}

export default ForumPost;
