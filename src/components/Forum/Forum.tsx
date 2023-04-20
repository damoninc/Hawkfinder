import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import {
  collection,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  DocumentData,
  Query,
  where,
} from "firebase/firestore";
import Post from "../../data/Post";
import ForumPost from "./ForumPost";
import PostInput from "./PostInput";
import { CircularProgress, Button } from "@mui/material";
import "../../styles/forum.css";

function Forum(props: any) {
  // HOOKS ----------------------------------------------------------------
  // State for posts must be set with any so the modal knows
  // which component to render without having to use .map()
  const [posts, setPosts] = useState<Post[]>([]);
  // Shows loading while fetchPosts() is running
  const [loading, setLoading] = useState(false);
  // Number of posts per page
  const [pageSize, setPageSize] = useState(10);
  const [totalDocs, setTotalDocs] = useState(0);

  const getTotalDocs = async () => {
    const snap = await getCountFromServer(collection(db, "Posts"));
    setTotalDocs(snap.data().count);
  };

  let q: Query<DocumentData>;

  /**
   * Makes a call to the db, grabbing every document
   * in the Posts collection
   * onSnapshot will add a listener to the Posts collection
   * so that the forum will reload when a new post is made
   */
  useEffect(() => {
    setLoading(true);
    getTotalDocs()
    if (!props.passedUser) {
      q = query(collection(db, "Posts"), orderBy("postDate", "desc"), limit(pageSize));
    } else if (props.passedUser) {
      q = query(
        collection(db, "Posts"),
        where("userID", "==", props.passedUser),
        orderBy("postDate", "desc")
      );
    }

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
  }, [pageSize]);

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

  const handleLoadMore = () => {
    setPageSize(pageSize + 10);
  };

  return (
    <div className="forum-container">
      {/* <PostInput reloadPosts={reloadPosts} /> */}
      {!props.passedUser ? (
        <PostInput reloadForum={reloadForum} userID={props.userID} />
      ) : (
        <></>
      )}
      {!loading ? (
        <>
          {posts.map((post: Post, index) => {
            return (
              <div key={index}>
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
          <div className="pagination">
            {/* Determines whether the forum can load any more posts */}
            {pageSize <= totalDocs ? (
              <Button className="load-more" variant="outlined" onClick={handleLoadMore}>
                Load more...
              </Button>
            ) : (
              <Button className="load-more" variant="outlined" onClick={handleLoadMore} disabled>
                Load more...
              </Button>
            )}
          </div>
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
