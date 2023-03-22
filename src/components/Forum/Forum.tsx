import React, { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import Post from "../../data/Post";
import ForumPost from "./ForumPost";

const posts: Post[] = [];

// const fetchPosts = async () => {
//   console.log("DB CALL");
//   await getDocs(collection(db, "Posts")).then((querySnapshot) => {
//     querySnapshot.docs.map((doc) =>
//       posts.push(
//         new Post(
//           doc.id,
//           doc.data().postDate.toDate(),
//           doc.data().description,
//           doc.data().interest,
//           doc.data().imageURL,
//           doc.data().ratings
//         )
//       )
//     );
//     // console.log(tempPosts);
//     // posts = tempPosts;
//   });
// };

function Forum() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    await getDocs(collection(db, "Posts")).then((querySnapshot) => {
      console.log("DB CALL");
      const tempPosts: any = querySnapshot.docs.map((doc) => {
        new Post(
          doc.id,
          doc.data().postDate.toDate(),
          doc.data().description,
          doc.data().interest,
          doc.data().imageURL,
          doc.data().ratings
        );
      });
      console.log("new posts created ", tempPosts);
      setPosts(tempPosts);
    });
  };

  fetchPosts();
  console.log(posts);

  // const postComponents = posts.map((post: Post) => {
  //   console.log("NEW POST RETURNED");
  //   return (
  //     <ForumPost
  //       key={post.postID}
  //       postDate={post.postDate}
  //       description={post.description}
  //       interest={post.interest}
  //       imageURL={post.imageURL}
  //       ratings={post.ratings}
  //       rating={post.calculateRating()}
  //     />
  //   );
  // });
  // return postComponents;

  return (
    <>
      {posts.map((post: Post) => {
        console.log("NEW POST RETURNED");
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
    </>
  );
}

export default Forum;
