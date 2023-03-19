import React from "react";
//import Profile, { sampleProfiles } from "../../data/Profile";
import User, { userConverter } from "../../data/User";
import "../../styles/friendpage.css";
import FriendBox from "./FriendBox";
import { testUsers } from "../../data/User";
import SearchForm from "./SearchForm";
//import { getDocs, collection } from "@firebase/firestore";
import { db } from "../../App";
import { doc, collection, query, where, getDoc } from "firebase/firestore";

const currUser = "RPqug4XyfRSchtX4NJdvgMy8Kn12";
const dbCall: Array<string> = testUsers[0].friendsList;

//const dbCall: Array<User> = currUser.friendsList; // grab user friend's profiles using database call

/**
 * Generates a HTML block that displays a user's friend list by creating
 *    a FriendBox for each friend in their friend list.
 * Shows all friends or a "no friends" message is applicable.
 *
 * @return {*} - FriendPage HTML
 */
function FriendPage() {
  callDB();
  return (
    <div className="friendPage">
      <h1>Friends List</h1>
      <SearchForm
        outsideSubmit={addFriend}
        title={"Username: "}
        buttonName={"Add"}
      />
      {/* {checkNullList(dbCall)} */}
    </div>
  );
}

function checkNullList(friends: User[]) {
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
          <div className="friend" key={friend.username}>
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

export function removeFriend(friend: User) {
  alert(testUsers[0].username + " removed " + friend.username);
}

export function goToMessages(friend: User) {
  // Dummy function for navigating to messages
  alert("Cannot send " + " to " + friend.username + "'s Messages");
}

export function goToProfile(friend: User) {
  // Dummy function for navigating to profile
  alert("Cannot send " + friend.username + "'s Profile");
}

async function callDB() {
  const querySnapshot = await getDoc(
    doc(db, "Users", currUser).withConverter(userConverter)
  );

  const user = querySnapshot.data();

  console.log(user);
  console.log(user?.friendsList);

  // querySnapshot.docs.map((doc) => {
  //   console.log(doc.id, " => ", doc.data());
  //   console.log(doc.data());
  // });
}

export default FriendPage;
