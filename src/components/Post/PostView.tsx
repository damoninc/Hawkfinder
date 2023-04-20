import React from "react";
import { useState, useEffect } from "react";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import { IconButton } from "@mui/material";
import { db, storage } from "../../firebase/config";
import { getDownloadURL, ref } from "firebase/storage";
import "../../styles/forumpost.css";
import { doc, getDoc } from "firebase/firestore";

function PostView(props: any) {
  // HOOKS ----------------------------------------------------------------
  // Hook for the ratings of each post
  const [ratings, setRatings] = useState(props.rating);
  // Determines whether the user has upvoted
  const [upvoted, setUpvoted] = useState(false);
  // Determines whether the user has downvoted
  const [downvoted, setDownvoted] = useState(false);
  // The image of the post
  const [image, setImage] = useState("");
  // The profile pic of the user that created the post
  const [profilePic, setProfilePic] = useState("");
  // The document of the post used for ratings
  const [documentRef, setDocumentRef] = useState<any>(
    doc(db, "Posts", props.id)
  );

  /**
   * Grabs the appropriate image URL for the
   * specific post that is rendered
   */
  useEffect(() => {
    // Grab the document snapshot for the post
    const docR = doc(db, "Posts", props.id);
    setDocumentRef(docR);
    const docS = getDoc(documentRef);

    docS
      .then((documentSnap) => {
        const data: any = documentSnap.data();
        // if (typeof data === "object") {
        if (Object.keys(data.ratings).length > 0) {
          const ratingsMap = new Map(Object.entries(data.ratings));
          for (const [k, v] of ratingsMap) {
            if (k == props.userID) {
              if (v == "upvote") {
                setUpvoted(true);
                return;
              } else {
                setDownvoted(true);
                return;
              }
            }
          }
        }
        // }
      })
      .catch(() => {
        console.log("An error occurred...");
      });

    // Grab the document snapshot for the user
    const docRef = doc(db, "Users", props.userID);
    const docSnap = getDoc(docRef);

    // Creates a pointer reference to the image of the post
    // TODO: Pass the URL from ForumPost to PostView
    const imageRef = ref(storage, "Posts/" + props.imageURL);

    if (props.imageURL != "") {
      getDownloadURL(imageRef)
        .then((url) => {
          setImage(url);
        })
        .catch(() => {
          console.log("Error fetching image");
        });
    }

    /**
     * This block is responsible for getting
     * the profile picture for the post
     */
    docSnap.then((doc) => {
      if (doc.exists()) {
        const profilePicPath: string = doc.data().profile.profilePicture;
        const profileImageRef = ref(storage, profilePicPath);
        if (profilePicPath != "") {
          getDownloadURL(profileImageRef)
            .then((url) => {
              setProfilePic(url);
            })
            .catch(() => {
              console.log("Error fetching image...");
            });
        }
      } else {
        console.log("Error getting document...");
      }
    });
  }, []);

  /**
   * Handles the logic for upvoting
   * @param e: MouseEvent
   */
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

  /**
   * Handles the logic for downvoting
   * @param e: MouseEvent
   */
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
        <img className="profile-pic" src={profilePic} />
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

        <div className="rating-button-container">
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
              <ArrowCircleUpIcon fontSize="large" color="primary" />
            </IconButton>
          )}
        </div>

        <span className="rating">{ratings}</span>

        <div className="rating-button-container">
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
              <ArrowCircleDownIcon fontSize="large" color="primary" />
            </IconButton>
          )}
        </div>
      </div>
      <span className="post-interest">{props.interest}</span>
      <span className="post-date">{props.postDate.toDateString()}</span>
    </div>
  );
}

export default PostView;
