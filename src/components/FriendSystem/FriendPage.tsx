import React, { useState } from "react";
import User, { userConverter } from "../../data/User";
import "../../styles/friendpage.css";
import FriendBox from "./FriendBox";
import FriendSearch from "./FriendSearch"
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
export let user: User;

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
    <div>
    <div className="list">
      <h1>Friends List</h1>
      <SearchForm
        outsideSubmit={addFriend}
        title={"Username: "}
        buttonName={"Add"}
      />
      {checkNullList(dbCall)}
    </div>
    <div>
          <FriendSearch />
    </div>
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
            {FriendBox(user, friend)}
          </div>
        ))}
      </div>
    );
  }
}

export async function addFriend(friendUsername?: string) {
  // dummy function for adding a friend, no friend information is transfered
  if (confirm("Add Friend " + friendUsername + "?")) {
    if (friendUsername !== undefined) {
      await getDocs(
        query(
          collection(db, "Users"),
          where("profile.username", "==", friendUsername)
        )
      ).then(async (id) => {
        if (id.docs[0] !== undefined) {
          const friend : User | undefined = userConverter.fromFirestore(id.docs[0])

          if (friend !== undefined) {
            if (!user.friendsList.includes(friend.userid)){
              user.friendsList.push(friend.userid);
              friend.friendsList.push(currUser);
              
              await updateDoc(
                doc(db, "Users", currUser),
                "friendsList",
                user.friendsList
              );

              await updateDoc(
                doc(db, "Users", friend.userid),
                "friendsList",
                friend.friendsList
              );

              dbPulled = false;
              alert("Added " + friend.username);
              window.location.reload(); 
            }
            else {
              alert("This user is already your friend")
            }
          }
        } else {
          alert("This username does not exist")
        }
      });
    }
  }
}

export async function removeFriend(friend: User) {
  if (
    confirm("Are you sure you want to remove " + friend.profile.userName + "?")
  ) {
    if (friend !== undefined) {
      const indexFriend = user.friendsList.indexOf(friend.userid, 0);
      const indexUser = friend.friendsList.indexOf(user.userid, 0);
      
      indexUser > -1 ? user.friendsList.splice(indexFriend, 1) : null;
      indexFriend > -1 ? friend.friendsList.splice(indexUser, 1) :  null;

      

      await updateDoc(
        doc(db, "Users", currUser),
        "friendsList",
        user.friendsList
      ).then(async () => {
          await updateDoc(
            doc(db, "Users", friend.userid),
            "friendsList",
            friend.friendsList
          ).then(() => {
            dbPulled = false;
            alert("Removed " + friend.profile.userName);
            window.location.reload();
          })
        }
      );
      
    }
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
      // Using document id to store friends
      const querySnapshot = await getDoc(
        doc(db, "Users", dbUser !== undefined ? dbUser.friendsList[i] : '').withConverter(userConverter)
      );

      const data = querySnapshot.data();
      if (data !== undefined) {
        friends.push(data);
      }
      console.log("DB Call");
    
  }
  setFriends(friends);
  dbPulled = true;
}

export default FriendPage;
