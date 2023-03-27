import React from "react";
import "../../styles/userbox.css";
import User from "../../data/User";
import UserBox from "./UserBox";
import * as fp from "./FriendPage";
/**
 * Generates a HTML block that displays a user based on their Profile information
 *      Currently displays the name and interests as well as having buttons to go to
 *      their profile, messages, and removing them.
 * @param {User} currUser - The currently logged in user
 * @param {User} friend - The user to display
 * @return {*} - FriendBox HTML
 */
function FriendBox(currUser: User, friend: User) {
  if (currUser === undefined || friend === undefined) {
    return <div></div>;
  }
  const buttons = currUser.friendsList.includes(friend.userid)
    ? currentFriendButtons
    : nonFriendButtons;

  return <div>{UserBox(friend, buttons)}</div>;
}

/**
 * Creates a set of HTML buttons to display in friend boxes when
 * the user to display is currently a friend of the logged in user
 *
 * @param {User} friend
 * @return {*} list of HTML buttons
 */
function currentFriendButtons(friend: User) {
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
  );
}

/**
 * Creates a set of HTML buttons to display in friend boxes when
 * the user to display is not a friend of the logged in user
 *
 * @param {User} friend
 * @return {*} list of HTML buttons
 */
function nonFriendButtons(user: User) {
  console.log(user);
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
          fp.addFriend(user.profile.userName);
        }}
      >
        Add
      </button>
    </div>
  );
}

export default FriendBox;
