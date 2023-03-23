import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import Post from "../../data/Post";
import ForumPost from "./ForumPost";

function Forum() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    await getDocs(collection(db, "Posts")).then((querySnapshot) => {
      const tempPosts: any = querySnapshot.docs.map((doc) => {
        console.log("DB CALL");
        return new Post(
          doc.id,
          doc.data().postDate.toDate(),
          doc.data().description,
          doc.data().interest,
          doc.data().imageURL,
          new Map(Object.entries(doc.data().ratings))
        );
      });
      setPosts(tempPosts);
    });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="forum-container">
      {posts.map((post: Post) => {
        console.log("NEW POST COMPONENT RETURNED");
        return (
          <ForumPost
            key={post.postID}
            postDate={post.postDate}
            description={post.description}
            interest={post.interest}
            imageURL={post.imageURL}
            ratings={post.ratings}
            rating={post.calculateRating()}
          />
        );
      })}
    </div>
  );
}

export default Forum;
