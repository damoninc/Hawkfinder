import Forum from "./components/Forum/Forum";
import FriendPage from "./components/FriendSystem/FriendPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import "./App.css";
import React from "react";
import LoginScreen from "./components/Authentication/LoginScreen";
import SignUpScreen from "./components/Authentication/SignUpScreen";
import ProfilePage from "./components/ProfileSystem/ProfilePage";
import SpotifyPage from "./components/SpotifyIntegration/SpotifyPage";
import InterceptorScreen from "./components/Authentication/InterceptorScreen";
import SignedIn from "./components/Authentication/SignedInScreen";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/config";
import isUserLoggin from "./components/Authentication/TestAuth";
import AccountSettingsPage from "./components/ProfileSystem/AccountSettingsPage";
import ReAuth from "./components/Authentication/Reauth";

/**
 * The top level of our App. Our routes are declared here, and use these routes
 * as a reference in the other files.
 * @returns The Router DOM
 */
function App() {
  const [user] = useAuthState(auth);
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
              <Link to="/">Login</Link>
            </li>
            <li>
              <Link to="/components/Signup">Signup</Link>
            </li>
            <li>
              <Link to="/components/SignedIn">SignedInPage</Link>
            </li>
          </ul>
          <ul>
            Damon
            <li>
              <Link to="/components/Profile">Profile</Link>
            </li>
            <li>
              <Link to="/components/AccountSettings">Account Settings</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route
            path="/components/Forum"
            element={
              isUserLoggin(user) ? (
                <Forum passedUser={""} userID={user?.uid} />
              ) : (
                <Navigate to="/components/Interceptor" />
              )
            }
          />
          <Route
            path="/components/Friends"
            element={
              isUserLoggin(user) ? (
                <FriendPage uCreds={user!.uid} />
              ) : (
                <Navigate to="/components/Interceptor" />
              )
            }
          />
          <Route
            path="/components/Spotify"
            element={
              isUserLoggin(user) ? (
                <SpotifyPage uCreds={user!.uid} />
              ) : (
                <Navigate to="/components/Interceptor" />
              )
            }
          />
          <Route
            path="/"
            element={
              isUserLoggin(user) ? (
                <Navigate to="/components/SignedIn" />
              ) : (
                <LoginScreen />
              )
            }
          />
          <Route
            path="/components/Signup"
            element={
              isUserLoggin(user) ? (
                <Navigate to="/components/SignedIn" />
              ) : (
                <SignUpScreen />
              )
            }
          />
          <Route
            path="/components/Profile"
            element={
              isUserLoggin(user) ? (
                <ProfilePage uCreds={user?.uid} />
              ) : (
                <Navigate to="/components/Interceptor" />
              )
            }
          />
          <Route
            path="/components/Interceptor"
            element={<InterceptorScreen />}
          />
          <Route
            path="/components/SignedIn"
            element={
              isUserLoggin(user) ? (
                <SignedIn uCreds={user} />
              ) : (
                <Navigate to="/components/Interceptor" />
              )
            }
          />
          <Route
            path="/components/AccountSettings"
            element={
              isUserLoggin(user) ? (
                <AccountSettingsPage uCreds={user} />
              ) : (
                <Navigate to="/components/Interceptor" />
              )
            }
          />
          <Route path="/components/Reauth" element={<ReAuth />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
