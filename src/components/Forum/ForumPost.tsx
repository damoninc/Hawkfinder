import React from "react";
import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  FaRegArrowAltCircleDown,
  FaRegArrowAltCircleUp,
  FaArrowAltCircleDown,
  FaArrowAltCircleUp,
} from "react-icons/fa";
import { AiOutlineExpandAlt } from "react-icons/ai";
import "../../styles/forumpost.css";
import Post from "../../data/Post";
/**
 * TODO: Many things are currently broken as I just implemented
 * the database and the changes are not done smoothly
 */
function ForumPost(props: any) {
  // TODO: State is broken, only one state exists
  // and it applies to every component
  const [ratings, setRatings] = useState(props.rating);
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);
  // const [posts, setPosts] = useState([]);

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

  // const fetchPosts = async () => {
  //   await getDocs(collection(db, "Posts")).then((querySnapshot) => {
  //     const tempPosts: any = querySnapshot.docs.map(
  //       (doc) =>
  //         new Post(
  //           doc.id,
  //           doc.data().postDate.toDate(),
  //           doc.data().description,
  //           doc.data().interest,
  //           doc.data().imageURL,
  //           doc.data().ratings
  //         )
  //     );
  //     console.log("DB CALL");
  //     console.log(tempPosts);
  //     setPosts(tempPosts);
  //   });
  // };
  // useEffect(() => {
  //   fetchPosts();
  // }, []);
  // return (
  //   <div className="forum-container">
  //     {posts?.map((post: Post) => {
  //       // TODO: Hardcoded images not being shown
  //       const postImgPath = `/src/assets/images/${props.imageURL}`;
  //       return (
  //         <div key={post.postID} className="post-container">
  //           <div className="pic-crop">
  //             <img
  //               className="profile-pic"
  //               src="\src\assets\images\profileimg.jpg"
  //             />
  //           </div>
  //           <div className="post-img-container">
  //             {props.imageURL !== "" ? (
  //               <img className="post-img" src={postImgPath} />
  //             ) : (
  //               <></>
  //             )}
  //           </div>
  //           <p className="post-description">{post.description}</p>
  //           <div className="ratings">
  //             {/**
  //              * The upvote and downvote buttons that are rendered will depend
  //              * on the state of upvoted and downvoted
  //              */}

  //             <div className="rating-button">
  //               {!upvoted ? (
  //                 <FaRegArrowAltCircleUp onClick={upvote} size={25} />
  //               ) : (
  //                 <FaArrowAltCircleUp onClick={upvote} size={25} />
  //               )}
  //             </div>
  //             {/**
  //              * TODO: post.calculateRating() returns an uncaught type
  //              * error. Needs to be fixed in order to show the rating.
  //              */}
  //             <span className="rating">{0}</span>

  //             <div className="rating-button">
  //               {!downvoted ? (
  //                 <FaRegArrowAltCircleDown onClick={downvote} size={25} />
  //               ) : (
  //                 <FaArrowAltCircleDown onClick={downvote} size={25} />
  //               )}
  //             </div>
  //           </div>
  //           <span className="post-interest">{post.interest}</span>
  //           {/**
  //            * TODO: Moving data from ForumPost to PostView is broken
  //            */}
  //           <Link to="/components/Forum/post" state={post}>
  //             <div className="expand-post-icon">
  //               <AiOutlineExpandAlt size={20} />
  //             </div>
  //           </Link>
  //         </div>
  //       );
  //     })}
  //   </div>
  // );
}

export default ForumPost;
