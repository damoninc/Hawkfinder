import React, { useState } from "react";
//import Profile, { sampleProfiles } from "../../data/Profile";
import User, { userConverter } from "../../data/User";
import "../../styles/friendpage.css";
import FriendBox from "./FriendBox";
import { testUsers } from "../../data/User";
import SearchForm from "./SearchForm";
//import { getDocs, collection } from "@firebase/firestore";
import { db } from "../../App";
import {
  doc,
  collection,
  query,
  where,
  getDoc,
  getDocs,
} from "firebase/firestore";

const currUser = "sq0kklKJQLYTuFQ6IQf6fzxi4Iu1";

let dbPulled = false;

/**
 * Generates a HTML block that displays a user's friend list by creating
 *    a FriendBox for each friend in their friend list.
 * Shows all friends or a "no friends" message is applicable.
 *
 * @return {*} - FriendPage HTML
 */
function FriendPage() {
  const [dbCall, setFriends] = useState(null);
  if (!dbPulled || dbCall == null) {
    callDB(setFriends);
  }
  return (
    <div className="friendPage">
      <h1>Friends List</h1>
      <SearchForm
        outsideSubmit={addFriend}
        title={"Username: "}
        buttonName={"Add"}
      />
      {checkNullList(dbCall)}
    </div>
  );
}

function checkNullList(friends: User[] | null) {
  // Returns a list of FriendBox if the user's friends list is not empty
  if (friends == null) {
    return (
      <div>
        <h2>Loading Friends</h2>
      </div>
    );
  }
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

async function callDB(setFriends: any) {
  console.log("querying db");
  const querySnapshot = await getDoc(
    doc(db, "Users", currUser).withConverter(userConverter)
  );

  const user = querySnapshot.data();

  const friends = new Array<User>();

  for (
    let i = 0;
    i < (user?.friendsList.length !== undefined ? user?.friendsList.length : 0);
    i++
  ) {
    // Using username to store friends
    const idQuery = await getDocs(
      query(
        collection(db, "Users"),
        where("profile.username", "==", user?.friendsList[i])
      )
    );
    const querySnapshot = await getDoc(
      doc(db, "Users", idQuery.docs[0].id).withConverter(userConverter)
    );

    // Using document id to store friends
    // const querySnapshot = await getDoc(
    //   doc(db, "Users", friend).withConverter(userConverter)
    // );

    const data = querySnapshot.data();
    if (data !== undefined) {
      friends.push(data);
    }
  }
  setFriends(friends);
  dbPulled = true;
}

export default FriendPage;
