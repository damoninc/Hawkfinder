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
import InterceptorScreen from "./components/Authentication/InterceptorScreen";
import SignedIn from "./components/Authentication/SignedInScreen";
import SearchPage from "./components/Navbar/Search";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/config";
import isUserLoggin from "./components/Authentication/TestAuth";
import AccountSettingsPage from "./components/ProfileSystem/AccountSettingsPage";
import ReAuth from "./components/Authentication/Reauth";
import Navbar from "./components/Navbar/Navbar";
import NotFound from "./components/Authentication/NotFoundScreen";
import ResetPasswordEmail from "./components/Authentication/ForgotPassword";
import { Box, Grid, Stack, useTheme } from "@mui/material";
import FriendRequests from "./components/FriendSystem/FriendRequests";

export const boxTheme = {
  backgroundSecondary: "#FAFAFA",
  backgroundPrimary: "#E5E5E5",
  borderColor: "#EEEEEE",
  border: "4px solid",
};

/**
 * The top level of our App. Our routes are declared here, and use these routes
 * as a reference in the other files.
 * @returns The Router DOM
 */
function App() {
  const [user] = useAuthState(auth);
  const theme = useTheme();

  boxTheme.backgroundPrimary =
    theme.palette.mode == "dark" ? "#5A5A5A" : "#E5E5E5";
  boxTheme.backgroundSecondary =
    theme.palette.mode == "dark" ? "#454545" : "#F6F6F6";
  boxTheme.borderColor = theme.palette.primary.dark;

  const gridTheme = {marginLeft: "0px"}

  return (
    <div className="app">
      {/* <h3>All the pages we are working on</h3>
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
      Comment out temporarily */}
      <Router>
        {user ? <div style={{height: "60px"}}><Navbar /></div> : null}
        <Routes>
          <Route
            path="/components/Forum"
            element={
              isUserLoggin(user) ? (
                <Grid container>
                  <Grid item xs={12} md={8} lg={9} xl={10} sx={gridTheme}>
                    <Forum passedUser={""} userID={user?.uid} />
                  </Grid>
                  <Grid item xs={0} md={4} lg={3} xl={2}>
                    <FriendPage uCreds={user!.uid} page="sidebar" />
                  </Grid>
                </Grid>
              ) : (
                <Navigate to="/components/Interceptor" />
              )
            }
          />
          <Route
            path="/components/Friends"
            element={
              isUserLoggin(user) ? (
                <FriendPage uCreds={user!.uid} page="list" />
              ) : (
                <Navigate to="/components/Interceptor" />
              )
            }
          />
          <Route
            path="/components/Friends/requests"
            element={
              isUserLoggin(user) ? (
              <Grid
                container
              >
                  <Grid item xs={12} md={8} lg={9} xl={10} sx={gridTheme}>
                  <FriendRequests />
                </Grid>
                <Grid item xs={0} md={4} lg={3} xl={2}>
                  <FriendPage uCreds={user!.uid} page="sidebar" />
                </Grid>
              </Grid>
              ) : (
                <Navigate to="/components/Interceptor" />
              )
            }
          />
          <Route
            path="/"
            element={
              isUserLoggin(user) ? (
                <Navigate to="/components/Forum" />
              ) : (
                <LoginScreen />
              )
            }
          />
          <Route
            path="/components/Signup"
            element={
              isUserLoggin(user) ? (
                <Navigate to="/components/Forum" />
              ) : (
                <SignUpScreen />
              )
            }
          />
          <Route
            path="/components/ResetPassword"
            element={
              isUserLoggin(user) ? (
                <Navigate to="/components/Forum" />
              ) : (
                <ResetPasswordEmail />
              )
            }
          />
          <Route
            path="/components/Profile"
            element={
              isUserLoggin(user) ? (
                <Grid container>
                  <Grid item xs={12} md={8} lg={9} xl={10} sx={gridTheme}>
                    <ProfilePage uCreds={user?.uid} />
                  </Grid>
                  <Grid item xs={0} md={4} lg={3} xl={2}>
                    <FriendPage uCreds={user!.uid} page="sidebar" />
                  </Grid>
                </Grid>
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
          <Route
            path="/components/Search"
            element={
              isUserLoggin(user) ? (
                <Grid container>
                  <Grid item xs={12} md={8} lg={9} xl={10} sx={gridTheme}>
                    <SearchPage uCreds={user?.uid} />
                  </Grid>
                  <Grid item xs={0} md={4} lg={3} xl={2}>
                    <FriendPage uCreds={user!.uid} page="sidebar" />
                  </Grid>
                </Grid>
              ) : (
                <Navigate to="/components/Interceptor" />
              )
            }
          />
          <Route path="/components/Reauth" element={<ReAuth />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

function componentWithSidebar(component: any, props : any) {
  <Grid container>
    <Grid item xs={12} md={8} lg={9}>
      {component(props)}
    </Grid>
    <Grid item xs={0} md={4} lg={3}>
      <FriendPage uCreds={props.user!.uid} page="sidebar" />
    </Grid>
</Grid>
}


export default App;
