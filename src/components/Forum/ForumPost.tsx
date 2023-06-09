import React, { useEffect } from "react";
import { useState } from "react";
import { db, storage } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import "../../styles/forumpost.css";
import { getDownloadURL, ref } from "firebase/storage";
import { doc, getDoc, updateDoc, deleteField } from "@firebase/firestore";

function timeSince(date: Date) {
  const seconds = Math.floor((new Date().valueOf() - date.valueOf()) / 1000);

  let interval = seconds / 31536000;
  let num: number;

  if (interval > 1) {
    num = Math.floor(interval);
    if (num == 1) {
      return Math.floor(interval) + " year";
    } else {
      return Math.floor(interval) + " years";
    }
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    num = Math.floor(interval);
    if (num == 1) {
      return Math.floor(interval) + " month";
    } else {
      return Math.floor(interval) + " months";
    }
  }
  interval = seconds / 86400;
  if (interval > 1) {
    num = Math.floor(interval);
    if (num == 1) {
      return Math.floor(interval) + " day";
    } else {
      return Math.floor(interval) + " days";
    }
  }
  interval = seconds / 3600;
  if (interval > 1) {
    num = Math.floor(interval);
    if (num == 1) {
      return Math.floor(interval) + " hour";
    } else {
      return Math.floor(interval) + " hours";
    }
  }
  interval = seconds / 60;
  if (interval > 1) {
    num = Math.floor(interval);
    if (num == 1) {
      return Math.floor(interval) + " minute";
    } else {
      return Math.floor(interval) + " minutes";
    }
  }
  num = Math.floor(interval);
  if (num == 1) {
    return Math.floor(interval) + " second";
  } else {
    return Math.floor(interval) + " seconds";
  }
}

interface Post {
  id: string;
  userID: string;
  loggedUser: string;
  postDate: Date;
  description: string;
  interest: string;
  imageURL: string;
  ratings: Map<string, string>;
  rating: number;
}

function ForumPost(props: Post) {
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
  // The fullname of the poster
  const [fullName, setFullName] = useState("");
  // The document of the post used for ratings
  const [documentRef, setDocumentRef] = useState<any>(
    doc(db, "Posts", props.id)
  );

  const navigate = useNavigate();

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
        if (Object.keys(data.ratings).length > 0) {
          const ratingsMap = new Map(Object.entries(data.ratings));
          for (const [k, v] of ratingsMap) {
            if (k == props.loggedUser) {
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
        const fullNameRef: string =
          doc.data().profile.firstName + " " + doc.data().profile.lastName;
        const profilePicPath: string = doc.data().profile.profilePicture;
        const profileImageRef = ref(storage, profilePicPath);
        if (profilePicPath != "") {
          getDownloadURL(profileImageRef)
            .then((url) => {
              setProfilePic(url);
              setFullName(fullNameRef);
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
    const uid = props.loggedUser;
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
    const uid = props.loggedUser;
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
    // props.postID
    // props.userID - ID of the user that created the post
    // props.loggedUser - ID of the logged in user
    // props.postDate.toString
    // props.description
    // props.interest
    // props.imageURL
    // props.ratings
    <Paper className="post-container">
      <Box sx={{ p: 2, margin: "auto" }}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            maxHeight: "200px",
            position: "relative",
            margin: "auto",
          }}
        >
          <div className="pic-crop">
            <img
              className="profile-pic"
              src={profilePic}
              onClick={() => {
                if (props.userID == props.loggedUser) {
                  navigate("/components/Profile");
                } else {
                  navigate(`/components/Profile#userid=${props.userID}`);
                }
              }}
            />
          </div>
          <Box
            className="profile-info"
            sx={{ position: "relative", width: "100%" }}
          >
            <Typography
              sx={{
                bottom: 0,
                position: "absolute",
                color: "turquoise",
                fontSize: "h6",
                fontWeight: "bold",
              }}
            >
              {fullName}
            </Typography>
          </Box>
        </Box>
        <Typography
          className="post-description"
          sx={{ borderTop: "solid", borderColor: "gray", width: "100%" }}
        >
          {props.description}
        </Typography>
        <Box className="post-img-container" sx={{}}>
          {props.imageURL !== "" ? (
            <img className="post-img" src={image} />
          ) : (
            <></>
          )}
        </Box>

        <Box className="ratings" sx={{}}>
          {/**
           * The upvote and downvote buttons that are rendered will depend
           * on the state of upvoted and downvoted, and eventually, what
           * the user had upvoted/downvoted previously
           */}
          <div className="rating-button-container">
            {!upvoted ? (
              <IconButton className="rating-button" onClick={(e) => upvote(e)}>
                <ArrowCircleUpIcon fontSize="large" />
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
              <IconButton
                className="rating-button"
                onClick={(e) => downvote(e)}
              >
                <ArrowCircleDownIcon fontSize="large" />
              </IconButton>
            ) : (
              <IconButton
                className="rating-button"
                onClick={(e) => downvote(e)}
              >
                <ArrowCircleDownIcon fontSize="large" color="primary" />
              </IconButton>
            )}
          </div>
        </Box>
        <Box sx={{ justifyContent: "space-between", display: "flex" }}>
          <span className="post-interest">{props.interest}</span>
          <span className="post-date">
            {timeSince(props.postDate) + " ago"}
          </span>
        </Box>
      </Box>
    </Paper>
  );
}

export default ForumPost;
