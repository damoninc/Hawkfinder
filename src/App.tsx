import Forum from "./components/Forum/Forum";
import PostView from "./components/Post/PostView";
import FriendPage from "./components/FriendSystem/FriendPage";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import "./App.css";
import React from "react";
import LoginScreen from "./components/Authentication/LoginScreen";
import SignUpScreen from "./components/Authentication/SignUpScreen";
import ProfilePage from "./components/ProfileSystem/ProfilePage";
import SpotifyPage from "./components/SpotifyIntegration/SpotifyPage";
import InterceptorScreen from "./components/Authentication/InterceptorScreen";
import ValidToken from "./components/Authentication/CheckSignedIn";

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
            <li>
              <Link to="/components/Spotify">Spotify Int</Link>
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
          <Route path="/components/Forum" element={ ValidToken() ? <Navigate to="/components/Interceptor" /> : <Forum />} />
          <Route path="/components/Friends" element={ ValidToken() ? <Navigate to="/components/Interceptor" /> : <FriendPage />} />
          <Route path="/components/Login" element={<LoginScreen />} />
          <Route path="/components/Signup" element={<SignUpScreen />} />
          <Route path="/components/Spotify" element={ ValidToken() ? <Navigate to="/components/Interceptor" /> : <SpotifyPage />} />
          <Route path="/components/Profile" element={ ValidToken() ? <Navigate to="/components/Interceptor" /> : <ProfilePage />} />
          <Route path="/components/Interceptor" element={<InterceptorScreen />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
