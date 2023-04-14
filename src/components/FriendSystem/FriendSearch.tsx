import React, { useState } from "react";
import User, { userConverter } from "../../data/User";
import "../../styles/friendpage.css";
import * as fp from "./FriendPage";
import { db } from "../../firebase/config";
import { collection, query, getDocs } from "firebase/firestore";
import { Button, TextField } from "@mui/material";
import UserBox from "./UserBox";
import { useFormik } from "formik";

/**
 * Generates a HTML block that displays a list of Users based
 * on the inputted text.
 *
 * @return {*} - FriendSearch HTML
 */
export default function FriendSearch() {
  const [dbCall, setUsers] = useState(null);

  /**
   * Input Validation using Formik
   */
  const validate = () => {
    const errors: ErrorSearchInfo = {};
    if (!formik.values.search) {
      errors.search = "Search must not be empty";
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      search: "",
    },
    validate,
    onSubmit: (values) => {
      callDB(setUsers, values.search);
    },
  });

  return (
    <div className="search">
      <h1>User Search</h1>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          label="Search"
          variant="outlined"
          focused
          id="search"
          name="search"
          value={formik.values.search}
          onChange={formik.handleChange}
          error={formik.touched.search && Boolean(formik.errors.search)}
          helperText={formik.touched.search && formik.errors.search}
        />
        <Button variant="contained" type="submit" style={{ height: "100%" }}>
          Search
        </Button>
      </form>
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
