import React from "react";
import Profile, { sampleProfiles } from "../../data/Profile";
import "../../styles/friendpage.css";
import FriendBox from "./FriendBox";
//import { testUsers } from '../../data/User';
import SearchForm from "./SearchForm";

/**
 * Generates a HTML block that displays a user's friend list by creating
 *    a FriendBox for each friend in their friend list.
 * Shows all friends or a "no friends" message is applicable.
 *
 * @return {*} - FriendPage HTML
 */
function FriendPage() {
  const dbCall: Array<Profile> = sampleProfiles; // grab user friend's profiles using database call

  return (
    <div className="friendPage">
      <h1>Friends List</h1>
      <SearchForm
        outsideSubmit={addFriend}
        title={"Username: "}
        buttonName={"Add"}
      />
      //{checkNullList(dbCall)}
    </div>
  );
}

function checkNullList(friends: Profile[]) {
  // Returns a list of FriendBox if the user's friends list is not empty
  if (friends.length == 0) {
    return (
      <div>
        <h2>No Friends Found :(</h2>
      </div>
    );
  } else {
    return (
      <div className="friendBlock">
        {friends.map((friend) => (
          <div className="friend" key={friend.userName}>
            {FriendBox(friend)}
          </div>
        ))}
      </div>
    );
  }
}

function addFriend(friend?: string) {
  // dummy function for adding a friend, no friend information is transfered
  alert("Adding Friend: " + friend);
}

export default FriendPage;
