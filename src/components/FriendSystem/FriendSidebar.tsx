import React, { useState } from "react";
import User, { userConverter } from "../../data/User";
import "../../styles/friendrequest.css";
import * as fp from "./FriendPage";
import { Box, CircularProgress, Grid, Stack, Typography } from "@mui/material";
import { db } from "../../firebase/config";
import {
  doc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import UserBox from "./UserBox";
import { boxTheme } from "../../App";

let dbPulled = false;

/**
 * Generates a HTML block that displays a user's friend list by creating
 *    a FriendBox for each friend in their friend list.
 * Shows all friends or a "no friends" message is applicable.
 *
 * @return {*} - FriendPage HTML
 */
function FriendSidebar(user: User) {
  const [friends, setFriends] = useState(null);
  if (!dbPulled || !friends) {
    callDB(user.userid, setFriends);
    return (
      <div className="page">
        <h1>Friends</h1>
        <div className="requests">
          <CircularProgress />
        </div>
      </div>
    );
  }
  return (
    <Grid
      sx={{
        border: "4px solid teal",
        borderRadius: "25px",
        overflow: "hidden",
        padding: "0%",
        paddingTop: "0",
        gridTemplateRows: "75px 100%",
        justifyItems: "center",
        background: boxTheme.backgroundSecondary,
        maxWidth: "100vw",
      }}
    >
      <Typography variant="h4" align="center" padding={"10px"}>
        <b>Friend Requests</b>
      </Typography>
      <Box
        sx={{
          display: "grid",
          height: "auto",
          overflow: "hidden",
          gridTemplateColumns: "50% 50%",
          justifyItems: "center",
          borderTop: "4px solid gray",
          paddingTop: "1%",
          paddingLeft: "5%",
          paddingRight: "5%",
          paddingBottom: "1%",
          alignItems: "top",
        }}
      >
        <Typography
          variant="h5"
          sx={{ paddingBottom: "10px" }}
          textAlign="center"
        >
          <b>Incoming Requests</b>
        </Typography>
        <Typography
          variant="h5"
          sx={{ paddingBottom: "10px" }}
          textAlign="center"
        >
          <b>Outgoing Requests</b>
        </Typography>
        {IncomingRequests(user, incoming)}
      </Box>
    </Grid>
  );
}

function sideBar(currUser: User, friends: Array<User> | null) {
  if (friends == null) {
    return (
      <div className="loadUser">
        <Typography variant="h6" textAlign="center">
          Loading Friends
        </Typography>
        <CircularProgress />
      </div>
    );
  }
  const users =
    friends.length == 0 ? (
      <div>
        <Typography variant="h6" textAlign="center">
          No Friends :(
        </Typography>
      </div>
    ) : (
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          flexWrap: "wrap",
        }}
      >
        {friends.map((req) => (
          <div className="user" key={req.username}>
            <UserBox user={req} currentUser={currUser} />
          </div>
        ))}
      </div>
    );

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="center"
      spacing={2}
    >
      {users}
    </Stack>
  );
}

/**
 * Function used to query FireBase for the incoming and outgoing friend requests
 * Updates incoming and outgoing requests array in FriendRequests component
 * @param {*} setFriends - Hook to set friends
 */
export async function callDB(signedUser: string, setFriends: any) {
  // Query Firestore for information from currently logged in user

  // Friends list query from FireStore\
  const friends = new Array<User>();
  await getDocs(query(collection(db, "Users"))).then((friendList) => {
    console.log("Pulling users for friends list");
    const users = new Array<User>();
    friendList.forEach((user) => {
      const data: User | undefined = userConverter.fromFirestore(user);
      if (data !== undefined) {
        users.push(data);
      }
    });

    const tmpUser = users.find((usr) => usr.userid === signedUser);

    if (tmpUser !== undefined) {
      user = tmpUser;
      users.forEach((friend) => {
        if (friend !== undefined && user.friendsList.includes(friend.userid)) {
          friends.push(friend);
        }
      });
      setFriends(friends);
      dbPulled = true;

      user.friendsList.forEach((friendId) => {
        if (!friends.find((friend) => friend.userid === friendId)) {
          const index = user.friendsList.indexOf(friendId, 0);
          if (index > -1) {
            user.friendsList.splice(index, 1);
            updateDoc(
              doc(db, "Users", user.userid),
              "friendsList",
              user.friendsList
            );
          }
        }
      });
    }
  });
}

export default FriendSidebar;
