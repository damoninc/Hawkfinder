import React, { useState } from "react";
import User, { userConverter } from "../../data/User";
import "../../styles/friendpage.css";
import FriendBox from "./FriendBox";
import * as fp from "./FriendPage";
import { db } from "../../App";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { Button, TextField } from "@mui/material";

/**
 * Generates a HTML block that displays a user's friend list by creating
 *    a FriendBox for each friend in their friend list.
 * Shows all friends or a "no friends" message is applicable.
 *
 * @return {*} - FriendPage HTML
 */
function FriendSearch() {
  const [dbCall, setUsers] = useState(null);
  const [input, setInput] = useState("")
  return (
    <div className="search">
      <h1>User Search</h1>
      <TextField 
        label="Username" 
        variant="outlined" 
        focused 
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setInput(event.target.value)
        }
        }/>
      <Button 
      variant="contained" 
      onClick={
        () => {
          callDB(setUsers, input)
        }
      }>
        Search
      </Button>

      {checkNullList(dbCall)}
    </div>
  );
}

function checkNullList(friends: User[] | null) {
  // Returns a list of FriendBox if the user's friends list is not empty
  if (friends == null) {
    return (
      <div className="loadUsers">
        <h2>...</h2>
      </div>
    );
  }
  if (friends.length == 0) {
    return (
      <div>
        <h2>This user does not exist :(</h2>
      </div>
    );
  } else {
    return (
      <div className="userBlock">
        {friends.map((friend) => (
          <div className="user" key={friend.username}>
            {FriendBox(fp.user, friend)}
          </div>
        ))}
      </div>
    );
  }
}

async function callDB(setUsers : any, msg : string) {

  await getDocs(
    query(
      collection(db, "Users"),
      where("profile.username", ">=", msg),
      where('profile.username', '<=', msg+ '\uf8ff')
    )
  ).then(async (usersData) => {
    const users : User[] = [];

    usersData.forEach((user) => {
        const data : User | undefined = userConverter.fromFirestore(user)
        if (data !== undefined) {
          users.push(data)
        }
      }
    )
    
    setUsers(users);
    console.log("db call")
  }
  );
}

export default FriendSearch;
