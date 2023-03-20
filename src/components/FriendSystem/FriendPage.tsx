import React, { useState } from "react";
import User, { userConverter } from "../../data/User";
import "../../styles/friendpage.css";
import FriendBox from "./FriendBox";
import SearchForm from "./SearchForm";
import { CircularProgress } from "@mui/material";
import { db } from "../../App";
import {
  doc,
  collection,
  query,
  where,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

const currUser = "sq0kklKJQLYTuFQ6IQf6fzxi4Iu1";
let user: User;

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
      <div className="loadFriend">
        <h2>Loading Friends...</h2>
        <CircularProgress />
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

export async function addFriend(friend?: string) {
  // dummy function for adding a friend, no friend information is transfered
  if (confirm("Add Friend " + friend + "?")) {
    if (friend !== undefined) {
      user.friendsList.push(friend);

      await updateDoc(
        doc(db, "Users", currUser),
        "friendsList",
        user.friendsList
      );
      dbPulled = false;
      alert("Added " + friend);
    }
    window.location.reload();
  }
}

export async function removeFriend(friend: User) {
  if (
    confirm("Are you sure you want to remove " + friend.profile.userName + "?")
  ) {
    if (friend !== undefined) {
      const index = user.friendsList.indexOf(friend.profile.userName, 0);
      if (index > -1) {
        user.friendsList.splice(index, 1);
      }

      await updateDoc(
        doc(db, "Users", currUser),
        "friendsList",
        user.friendsList
      );
      dbPulled = false;
      alert("Removed " + friend.profile.userName);
    }
    window.location.reload();
  }
}

export function goToMessages(friend: User) {
  // Dummy function for navigating to messages
  alert("Cannot go to " + friend.username + "'s Messages");
}

export function goToProfile(friend: User) {
  // Dummy function for navigating to profile
  alert("Cannot go to " + friend.username + "'s Profile");
}

async function callDB(setFriends: any) {
  const querySnapshot = await getDoc(
    doc(db, "Users", currUser).withConverter(userConverter)
  );

  const dbUser = querySnapshot.data();
  if (dbUser !== undefined) {
    user = dbUser;
  }

  const friends = new Array<User>();

  for (
    let i = 0;
    i <
    (dbUser?.friendsList.length !== undefined ? dbUser?.friendsList.length : 0);
    i++
  ) {
    // Using username to store friends
    const idQuery = await getDocs(
      query(
        collection(db, "Users"),
        where("profile.username", "==", dbUser?.friendsList[i])
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
