import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Post from "../../data/Post";
import PostView from "../Post/PostView";
import ForumPost from "./ForumPost";
import PostInput from "./PostInput";
import { Modal, Box, CircularProgress } from "@mui/material";
import "../../styles/forum.css";

function Forum(props: any) {
  // HOOKS ----------------------------------------------------------------
  // State for posts must be set with any so the modal knows
  // which component to render without having to use .map()
  const [posts, setPosts] = useState<Post[]>([]);
  // For the modal to determine which post was clicked
  const [postIndex, setPostIndex] = useState(0);
  // Boolean to show the modal or not
  const [open, setOpen] = useState(false);
  // Shows loading while fetchPosts() is running
  const [loading, setLoading] = useState(false);

  const userID = props.uCreds.uid;

  /**
   * Makes a call to the db, grabbing every document
   * in the Posts collection
   * onSnapshot will add a listener to the Posts collection
   * so that the forum will reload when a new post is made
   */
  useEffect(() => {
    setLoading(true);
    console.log(props.uCreds);
    const q = query(collection(db, "Posts"), orderBy("postDate", "desc"));
    getDocs(q).then((querySnapshot) => {
      const tempPosts: Post[] = querySnapshot.docs.map((doc) => {
        console.log("DB CALL");
        return new Post(
          doc.id,
          doc.data().postDate.toDate(),
          doc.data().userID,
          doc.data().description,
          doc.data().interest,
          doc.data().imageURL,
          new Map(Object.entries(doc.data().ratings))
        );
      });
      setPosts(tempPosts);
    });

    setLoading(false);
  }, []);

  /**
   * Forcefully reloads the forum by reloading the page
   */
  const reloadForum = () => {
    console.log("Reloading forum...");
    // This is not the most efficient way to reload the forum, but I've
    // been banging my head against the wall for 5 hours trying to find
    // a better way so this will have to suffice for now
    // If we still have time to figure this out,
    // I will try to do this more efficiently
    window.location.reload();
  };

  /**
   * Determines the post that was clicked on
   * to show on the modal
   * @param p index number
   */
  const handleOpen = (p: any) => {
    console.log("Post Clicked...", p);
    setPostIndex(p);
    setOpen(true);
  };

  return (
    <div className="forum-container">
      {/* <PostInput reloadPosts={reloadPosts} /> */}
      <PostInput userID={userID} reloadForum={reloadForum} />
      {!loading ? (
        <>
          {posts.map((post: Post, index) => {
            return (
              <div
                key={index}
                onClick={() => handleOpen(index)}
                className="post-handler"
              >
                <ForumPost
                  id={post.postID}
                  userID={post.userID}
                  postDate={post.postDate}
                  description={post.description}
                  interest={post.interest}
                  imageURL={post.imageURL}
                  ratings={post.ratings}
                  rating={post.calculateRating()}
                />
              </div>
            );
          })}
          <Modal open={open} onClose={() => setOpen(false)}>
            <Box
              sx={{
                display: "flex",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 0.6,
                bgcolor: "background.paper",
                border: "2px solid #000",
                boxShadow: 24,
                p: 4,
              }}
            >
              {/* This expression is required or else this code will somehow
                run before the db call is made and return an typeerror */}
              {posts.length > 0 ? (
                <PostView
                  key={postIndex}
                  id={posts[postIndex].postID}
                  userID={posts[postIndex].userID}
                  postDate={posts[postIndex].postDate}
                  description={posts[postIndex].description}
                  interest={posts[postIndex].interest}
                  imageURL={posts[postIndex].imageURL}
                  ratings={posts[postIndex].ratings}
                  rating={posts[postIndex].calculateRating()}
                />
              ) : (
                <></>
              )}
            </Box>
          </Modal>
        </>
      ) : (
        <>
          <h2>Loading Forum...</h2>
          <CircularProgress />
        </>
      )}
    </div>
  );
}

export default Forum;
