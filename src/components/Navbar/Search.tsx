import React, { useState } from "react";
import User, { userConverter } from "../../data/User";
import "../../styles/friendpage.css";
import { db } from "../../firebase/config";
import { collection, query, getDocs } from "firebase/firestore";
import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import FriendBox from "../FriendSystem/FriendBox";
import Navbar from "./Navbar";

/**
 * Generates a HTML block that displays a list of Users based
 * on the inputted text.
 *
 * @return {*} - FriendSearch HTML
 */
let resultsLoaded = false;
let lastSearch = "";

export default function SearchPage(currUser: { uCreds: string | undefined }) {
  const [dbCall, setUsers] = useState(null);

  const hashParams = window.location.hash.split("#")[1];
  const urlParams = new URLSearchParams(hashParams);
  const search = urlParams.get("search");

  console.log(search);

  if (!search) {
    return (
      <div>
        <Navbar />
        <h1>Enter a good search man</h1>
      </div>
    );
  } else if (lastSearch != search) {
    lastSearch = search;
    resultsLoaded = false;
  }

  if (!resultsLoaded) {
    callDB(setUsers, search);
    resultsLoaded = true;
  }
  return (
    <div>
      <Navbar />
      <div className="search">
        <h1>User Search</h1>
        {checkNullList(dbCall)}
      </div>
    </div>
  );
}

function checkNullList(users: User[] | null) {
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
            <FriendBox friend={user} />
          </div>
        ))}
      </div>
    );
  }
}

async function callDB(setUsers: any, msg: string) {
  msg = msg.replace(/\s/g, "");

  const users: User[] = [];

  if (msg.length == 0) {
    setUsers(users);
  }

  msg = msg.toLocaleLowerCase();
  await getDocs(query(collection(db, "Users"))).then(async (usersData) => {
    usersData.forEach((user) => {
      const data: User | undefined = userConverter.fromFirestore(user);
      if (data !== undefined) {
        if (
          data.profile.userName.toLocaleLowerCase().includes(msg) ||
          data.profile.firstName.toLocaleLowerCase().includes(msg) ||
          data.profile.lastName.toLocaleLowerCase().includes(msg) ||
          `${data.profile.firstName.toLocaleLowerCase()} ${data.profile.lastName.toLocaleLowerCase()}`.includes(
            msg
          )
        ) {
          users.push(data);
        }
      }
    });

    setUsers(users);
    console.log("db call");
  });
}
