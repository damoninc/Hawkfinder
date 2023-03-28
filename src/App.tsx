import Forum from "./components/Forum/Forum";
import PostView from "./components/Post/PostView";
import FriendPage from "./components/FriendSystem/FriendPage";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import React from "react";
import LoginScreen from "./components/Authentication/LoginScreen";
import SignUpScreen from "./components/Authentication/SignUpScreen";
import ProfilePage from "./components/ProfileSystem/ProfilePage";

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
            <li>
              <Link to="/components/Signup">Signup</Link>
            </li>
          </ul>
          <ul>
            Damon
            <li>
              <Link to="/components/Profile">Profile</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/components/Forum" element={<Forum />} />
          <Route path="/components/Friends" element={<FriendPage />} />
          <Route path="/components/Login" element={<LoginScreen />} />
          <Route path="/components/Signup" element={<SignUpScreen />} />
          <Route path="/components/Profile" element={<ProfilePage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
