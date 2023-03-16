import React from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  FaRegArrowAltCircleDown,
  FaRegArrowAltCircleUp,
  FaArrowAltCircleDown,
  FaArrowAltCircleUp,
} from "react-icons/fa";
import Post from "../../data/Post";

function PostView() {
  /**
   * useLocation is used to pass properties from
   * other components through the Link component.
   * The 'state' object will contain all of the
   * information that is associated with the post
   * that the user clicked on
   */
  const location = useLocation();
  const { state } = location;

  const [ratings, setRatings] = useState(state.rating);
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

  const postImgPath = `/src/assets/images/${state.imageURL}`;

  return (
    <div className="post-view">
      <div className="pic-crop">
        <img className="profile-pic" src="\src\assets\images\profileimg.jpg" />
      </div>
      <div className="post-img-container">
        <img className="post-img" src={postImgPath} />
      </div>
      <p className="post-description">{state.description}</p>
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
      <span className="post-interest">{state.interest}</span>
    </div>
  );
}

export default PostView;
