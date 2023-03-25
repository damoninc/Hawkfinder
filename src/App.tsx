import Forum from "./components/Forum/Forum";
import PostView from "./components/Post/PostView";
import FriendPage from "./components/FriendSystem/FriendPage";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import { SAMPLE_POSTS } from "./data/Post";
import React from "react";

const posts = SAMPLE_POSTS.map((post) => {
  const json: string = JSON.stringify(post);
  const postJSON = JSON.parse(json);
  console.log(postJSON);
  return (
    <Forum
      key={postJSON._postID}
      postID={post.postID}
      postDate={post.postDate}
      description={post.description}
      interest={post.interest}
      imageURL={post.imageURL}
      ratings={post.ratings}
      rating={post.calculateRating()}
    />
  );
});

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import SignUpScreen from "./components/Authentication/SignUpScreen";
import LoginScreen from "./components/Authentication/LoginScreen";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNM-tQPGKeAblOqQPqZnBKwRnpGxOvc0Q",
  authDomain: "csc-450-project.firebaseapp.com",
  projectId: "csc-450-project",
  storageBucket: "csc-450-project.appspot.com",
  messagingSenderId: "877784266308",
  appId: "1:877784266308:web:31ab02901a000bc93fae11",
  measurementId: "G-RVEP3DC122",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

function App() {
  return (
    <div className="app">
      <h3>All the pages we are working on</h3>
      {/* <h3>John</h3> */}
      <Router>
        <nav className="navbar">
          <ul>
            John
            <li>
              <Link to="/components/Forum">Forum</Link>
            </li>
            <li>
              <Link to="/components/Post">Post</Link>
            </li>
          </ul>
          <ul>
            Nicholaus
            <li>
              <Link to="/components/Friends">Friends List</Link>
            </li>
          </ul>
          <ul>
            Octavio
            <li>
              <Link to="/components/Login">Login</Link>
            </li>
            <li>
              <Link to="/components/Signup">Signup</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/components/Forum" element={posts} />
          <Route path="/components/Post" element={<PostView />} />
          <Route path="/components/Friends" element={<FriendPage />} />
          <Route path="/components/Login" element={<LoginScreen />} />
          <Route path="/components/Signup" element={<SignUpScreen />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
