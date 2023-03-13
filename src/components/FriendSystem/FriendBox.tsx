import React from "react";
import "../../styles/friendbox.css";
import Profile from "../../data/Profile";

/**
 * Generates a HTML block that displays a user based on their Profile information
 *      Currently displays the name and interests as well as having buttons to go to
 *      their profile, messages, and removing them.
 * @param {Profile} friend - The user to display
 * @return {*} - FriendBox HTML
 */
function FriendBox(friend: Profile) {
  const imgPath: string = "/src/assets/images/" + friend.profilePicture; // database call to grab image

  // Generating string of interests, cutting off after ~25 characters
  let interests: string = friend.interests[0];
  for (let i = 1; i < friend.interests.length; i++) {
    if (interests.length > 25) {
      interests += "...";
      break;
    }
    interests += ", " + friend.interests[i];
  }
  return (
    <div className="container">
      <div className="propic">
        <img src={imgPath} width="100" height="100"></img>
      </div>
      <div className="content">
        <h3>
          {" "}
          {friend.firstName} {friend.lastName}{" "}
        </h3>
        <p>{interests}</p>
      </div>
      <div className="buttons">
        <button className="button" onClick={goToMessages}>
          Messages
        </button>
        <button className="button" onClick={goToProfile}>
          Profile
        </button>
        <button className="button" type="button" onClick={removeFriend}>
          Remove
        </button>
      </div>
    </div>
  );
}

function removeFriend() {
  // Dummy functionality for removing a friend. Currently only sends an alert
  alert("Friend Removed");
}

function goToMessages() {
  // Dummy function for navigating to messages
  alert("Cannot go to Messages");
}

function goToProfile() {
  // Dummy function for navigating to profile
  alert("Cannot go to Profile");
}

export default FriendBox;
