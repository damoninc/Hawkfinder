import React, { useState } from "react";
import User, { userConverter } from "../../data/User";
import "../../styles/friendpage.css";
import FriendBox from "./FriendBox";
import * as fp from "./FriendPage";
import { db } from "../../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Button, TextField } from "@mui/material";
import UserBox from "./UserBox";

/**
 * Generates a HTML block that displays a list of Users based
 * on the inputted text.
 *
 * @return {*} - FriendSearch HTML
 */
export default function FriendSearch() {
  const [dbCall, setUsers] = useState(null);
  const [input, setInput] = useState("");
  return (
    <div className="search">
      <h1>User Search</h1>
      <TextField
        label="Username"
        variant="outlined"
        focused
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setInput(event.target.value);
        }}
      />
      <Button
        variant="contained"
        onClick={() => {
          callDB(setUsers, input);
        }}
      >
        Search
      </Button>

      {checkNullList(dbCall)}
    </div>
  );
}

function checkNullList(users: User[] | null) {
  // Returns a list of FriendBox if the user's friends list is not empty
  if (users == null) {
    return (
      <div className="loadUsers">
        <h2>...</h2>
      </div>
    );
  }
  if (users.length == 0) {
    return (
      <div>
        <h2>This user does not exist :(</h2>
      </div>
    );
  } else {
    return (
      <div className="userBlock">
        {users.map((user) => (
          <div className="user" key={user.username}>
            {UserBox(user, buttons)}
          </div>
        ))}
      </div>
    );
  }
}

function buttons(user: User) {
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

/**
 * Function used to query FireBase for the friends list.
 * Sets dbCall Hook in FriendSearch after database call finished
 *
 * @param {*} setFriends - Hook to set friends list
 */
async function callDB(setUsers: any, msg: string) {
  await getDocs(
    query(
      collection(db, "Users"),
      where("profile.username", ">=", msg),
      where("profile.username", "<=", msg + "\uf8ff")
    )
  ).then(async (usersData) => {
    const users: User[] = [];

    usersData.forEach((user) => {
      const data: User | undefined = userConverter.fromFirestore(user);
      if (data !== undefined) {
        users.push(data);
      }
    });

    setUsers(users);
    console.log("db call");
  });
}
