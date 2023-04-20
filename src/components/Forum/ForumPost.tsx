import React, { useEffect } from "react";
import { useState } from "react";
import { db, storage } from "../../firebase/config";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import { IconButton } from "@mui/material";
import "../../styles/forumpost.css";
import { getDownloadURL, ref } from "firebase/storage";
import { doc, getDoc, updateDoc, deleteField } from "@firebase/firestore";

function ForumPost(props: any) {
  // HOOKS ----------------------------------------------------------------
  // Hook for the ratings of each post
  const [ratings, setRatings] = useState(props.rating);
  // Determines whether the user has upvoted
  const [upvoted, setUpvoted] = useState(false);
  // Determines whether the user has downvoted
  const [downvoted, setDownvoted] = useState(false);
  // The image of the post
  const [image, setImage] = useState("");
  // The profile pic of the poster
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
    const imageRef = ref(storage, "Posts/" + props.imageURL);
    if (props.imageURL != "") {
      getDownloadURL(imageRef)
        .then((url) => {
          setImage(url);
        })
        .catch(() => {
          console.log("Error fetching image...");
        });
    }

    /**
     * This block is responsible for getting
     * the profile picture for the post
     */
    docSnap.then((doc: any) => {
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
        console.log("Error gettin user doc...");
      }
    });
  }, []);

  /**
   * Handles the logic for upvoting
   * @param e: MouseEvent
   */
  const upvote = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    /**
     * stopPropgation prevents events from bubbling and only runs
     * this function (instead of this function AND showing the modal)
     */
    const uid = props.userID;
    const field = `ratings.${uid}`;
    e.stopPropagation();
    if (!upvoted && !downvoted) {
      // Case where downvote and upvote are not set
      await updateDoc(documentRef, {
        [field]: "upvote",
      });
      setRatings(ratings + 1);
      setUpvoted(true);
    } else if (!upvoted && downvoted) {
      // Case where post is downvoted
      await updateDoc(documentRef, {
        [field]: "upvote",
      });
      setRatings(ratings + 2);
      setDownvoted(false);
      setUpvoted(true);
    } else {
      // Case where post is upvoted
      await updateDoc(documentRef, {
        [field]: deleteField(),
      });
      setRatings(ratings - 1);
      setUpvoted(false);
    }
  };

  /**
   * Handles the logic for downvoting
   * @param e: MouseEvent
   */
  const downvote = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    const uid = props.userID;
    const field = `ratings.${uid}`;
    if (!downvoted && !upvoted) {
      // Case where downvote and upvote are not set
      await updateDoc(documentRef, {
        [field]: "downvote",
      });
      setRatings(ratings - 1);
      setDownvoted(true);
    } else if (!downvoted && upvoted) {
      // Case where post is upvoted
      await updateDoc(documentRef, {
        [field]: "downvote",
      });
      setRatings(ratings - 2);
      setUpvoted(false);
      setDownvoted(true);
    } else {
      // Case where post is downvoted
      await updateDoc(documentRef, {
        [field]: deleteField(),
      });
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
