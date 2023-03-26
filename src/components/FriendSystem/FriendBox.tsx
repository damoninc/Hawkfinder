import React from "react";
import "../../styles/friendbox.css";
import User from "../../data/User";
import * as fp from "./FriendPage";
import { CircularProgress } from "@mui/material";
/**
 * Generates a HTML block that displays a user based on their Profile information
 *      Currently displays the name and interests as well as having buttons to go to
 *      their profile, messages, and removing them.
 * @param {User} friend - The user to display
 * @return {*} - FriendBox HTML
 */
function FriendBox(currUser : User, friend: User) {
  if (currUser === undefined || friend === undefined) {
    return (<div></div>)
  }
  const imgPath: string = "/src/assets/images/" + friend.profile.profilePicture; // database call to grab image

  // Generating string of interests, cutting off after ~25 characters
  let interests: string = friend.profile.interests[0];
  for (let i = 1; i < friend.profile.interests.length; i++) {
    if (interests.length > 25) {
      interests += "...";
      break;
    }
    interests += ", " + friend.profile.interests[i];
  }

  const buttons : JSX.Element = currUser.friendsList.includes(friend.userid) ? currentFriendButtons(friend) : nonFriendButtons(friend) 

  return (
    <div className="container">
      <div className="propic">
        <img src={imgPath} width="100" height="100"></img>
      </div>
      <div className="bigContent">
        <h3>
          {" "}
          {friend.profile.firstName} {friend.profile.lastName}{" "}
        </h3>
        <p>{interests}</p>
      </div>
      <div className="smallContent">
        <h3>
          {friend.profile.firstName} {friend.profile.lastName}{" "}
        </h3>
      </div>
      <div>
        {buttons}
      </div>
    </div>
  );
}

function currentFriendButtons(friend : User) {
  return (
    <div className="buttons">
      <button
        className="button"
        onClick={() => {
          fp.goToMessages(friend);
        }}
      >
        Messages
      </button>
      <button
        className="button"
        onClick={() => {
          fp.goToProfile(friend);
        }}
      >
        Profile
      </button>
      <button
        className="button"
        type="button"
        onClick={() => {
          fp.removeFriend(friend);
        }}
      >
        Remove
      </button>
    </div>
  )
}

function nonFriendButtons(user : User) {
  return (
    <div className="buttons">
      <button
        className="button"
        onClick={() => {
          fp.goToProfile(user);
        }}
      >
        Profile
      </button>
      <button
        className="button"
        type="button"
        onClick={() => {
          fp.addFriend(user.username);
        }}
      >
        Add
      </button>
    </div>
  )
}

export default FriendBox;
