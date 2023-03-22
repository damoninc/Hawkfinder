import ForumPost from "./components/Forum/ForumPost";
import PostView from "./components/Post/PostView";
import LogAndSign from "./components/Authentication/LogAndSign";
import FriendPage from "./components/FriendSystem/FriendPage";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import React from "react";

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
          </ul>
        </nav>
        <Routes>
          <Route path="/components/Forum" element={<ForumPost />} />
          <Route path="/components/Friends" element={<FriendPage />} />
          <Route path="/components/Login" element={<LogAndSign />} />
          <Route path="/components/Forum/post" element={<PostView />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
