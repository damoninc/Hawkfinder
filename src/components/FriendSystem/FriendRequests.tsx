import React, { useState } from "react";
import User, { userConverter } from "../../data/User";
import "../../styles/friendrequest.css";
import { Box, CircularProgress, Grid, Stack, Typography, Button, Badge } from "@mui/material";
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
import { user } from "./FriendPage";
import { useNavigate } from "react-router-dom";
import LoadingPage from "../Navbar/Loading";

let dbPulled = false;
let currUser: User;

/**
 * Generates a HTML block that displays a user's friend list by creating
 *    a FriendBox for each friend in their friend list.
 * Shows all friends or a "no friends" message is applicable.
 *
 * @return {*} - FriendPage HTML
 */
export default function FriendRequests() {
  const [incoming, setIncoming] = useState(null);
  const [outgoing, setOutgoing] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate()
  if (user) {
    currUser = user
  } else {
    setTimeout(function() {
      setRefresh(!refresh)
    }, 1000)
  }
  if (currUser && (!dbPulled || (!incoming && !outgoing))) {
    dbPulled = true
    callDB(currUser, setIncoming, setOutgoing);
  }

  const requests = (    
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
          paddingBottom: "5%",
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
        {IncomingRequests(currUser, incoming)}
        {OutgoingRequests(currUser, outgoing)}
      </Box>
    </Grid>
  ) 

  return (
    <div>
      <div>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Button
            variant="contained"
            onClick={() => {
              navigate("/components/Friends");
            }}
            style={{ margin: "15px" }}
          >
            Friends
          </Button>
          <Badge
            badgeContent={
              currUser !== undefined ? currUser.incomingRequests.length : 0
            }
            color="success"
          >
            <Button
              variant="contained"
              onClick={() => {
                navigate("/components/Friends/requests");
              }}
            >
              Requests
            </Button>
          </Badge>
        </Grid>
      </div>
      {dbPulled ? requests :       
      <Box
        sx={{
          border: boxTheme.border,
          borderColor: boxTheme.borderColor,
          background: boxTheme.backgroundSecondary,
          borderRadius: "25px",
          
        }}
      >
        {LoadingPage("Loading Requests")}
      </Box>}
    </div>)
}

// Returns HTML of UserBoxes for incoming requests
function IncomingRequests(currUser: User, incoming: Array<User> | null) {
  if (incoming == null) {
    return (
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={3}
        width="100%"
      >       
        <Typography variant="h6" textAlign="center">
          Loading
        </Typography>
        <CircularProgress />
      </Stack>
    );
  }
  const users =
    incoming.length == 0 ? (
      <div>
        <Typography variant="h6" textAlign="center">
          No Incoming Requests
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
        {incoming.map((req) => (
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

// Returns HTML of UserBoxes for outgoing requests
function OutgoingRequests(currUser: User, outgoing: Array<User> | null) {
  if (outgoing == null) {
    return (
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={3}
        width="100%"
      >       
        <Typography variant="h6" textAlign="center">
          Loading
        </Typography>
        <CircularProgress />
      </Stack>
    );
  }
  const users =
    outgoing.length == 0 ? (
      <div>
        <Typography variant="h6" textAlign="center">
          No Outgoing Requests
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
        {outgoing.map((req) => (
          <div className="user" key={req.username}>
            <UserBox user={req} currentUser={currUser} />
          </div>
        ))}
      </div>
    );

  return users;
}

// Database Calling

/**
 * Declines a friend request when the decline button is pressed
 *
 * @param {User} request - User linked to declined friend request
 */
export async function decline(currUser: User, request: User) {
  if (
    confirm(
      "Are you sure you want to decline " +
        request.profile.userName +
        "'s request ?"
    )
  ) {
    if (request !== undefined) {
      const indexFriend = currUser.incomingRequests.indexOf(request.userid, 0);
      const indexUser = request.outgoingRequests.indexOf(currUser.userid, 0);

      indexFriend > -1
        ? currUser.incomingRequests.splice(indexFriend, 1)
        : null;
      indexUser > -1 ? request.outgoingRequests.splice(indexUser, 1) : null;

      await updateDoc(
        doc(db, "Users", currUser.userid),
        "incomingRequests",
        currUser.incomingRequests
      ).then(async () => {
        await updateDoc(
          doc(db, "Users", request.userid),
          "outgoingRequests",
          request.outgoingRequests
        ).then(() => {
          dbPulled = false;
          alert("Removed " + request.profile.userName);
          window.location.reload();
        });
      });
    }
  }
}

/**
 * Accepts the friend reqeust when the accept button is pressed
 *
 * @param {User} request - User linked to request
 */
export async function accept(currUser: User, request: User) {
  if (request !== undefined) {
    const indexRequest = currUser.incomingRequests.indexOf(request.userid, 0);
    indexRequest > -1
      ? currUser.incomingRequests.splice(indexRequest, 1)
      : null;

    const indexOutUser = request.outgoingRequests.indexOf(currUser.userid, 0);
    indexOutUser > -1 ? request.outgoingRequests.splice(indexOutUser, 1) : null;

    currUser.friendsList.push(request.userid);
    request.friendsList.push(currUser.userid);

    await updateDoc(
      doc(db, "Users", currUser.userid),
      "friendsList",
      currUser.friendsList
    );
    await updateDoc(
      doc(db, "Users", request.userid),
      "friendsList",
      request.friendsList
    );

    await updateDoc(
      doc(db, "Users", currUser.userid),
      "incomingRequests",
      currUser.incomingRequests
    ).then(async () => {
      await updateDoc(
        doc(db, "Users", request.userid),
        "outgoingRequests",
        request.outgoingRequests
      ).then(() => {
        dbPulled = false;
        alert("Added " + request.profile.userName);
        window.location.reload();
      });
    });
  }
}

/**
 * Cancels a friend request when the cancel button on a request is pressed
 *
 * @param {User} request - the user associated with the cancelled request
 */
export async function cancel(currUser: User, request: User) {
  if (request !== undefined) {
    const indexRequest = currUser.outgoingRequests.indexOf(request.userid, 0);
    const indexUser = request.incomingRequests.indexOf(currUser.userid, 0);

    indexRequest > -1
      ? currUser.outgoingRequests.splice(indexRequest, 1)
      : null;
    indexUser > -1 ? request.incomingRequests.splice(indexUser, 1) : null;

    await updateDoc(
      doc(db, "Users", currUser.userid),
      "outgoingRequests",
      currUser.outgoingRequests
    ).then(async () => {
      await updateDoc(
        doc(db, "Users", request.userid),
        "incomingRequests",
        request.incomingRequests
      ).then(() => {
        dbPulled = false;
        alert("Canceled request to " + request.profile.userName);
        window.location.reload();
      });
    });
  }
}

/**
 * Function used to query FireBase for the incoming and outgoing friend requests
 * Updates incoming and outgoing requests array in FriendRequests component
 * @param {*} setIncoming - Hook to set incoming requests
 * @param {*} setOutgoing - Hook to set outgoing requests
 */
async function callDB(user: User, setIncoming: any, setOutgoing: any) {
  let pulled = false;
  const incoming = new Array<User>();
  const outgoing = new Array<User>();
  if (user === undefined) {
    return;
  }
  if (user.incomingRequests.length > 0 || user.outgoingRequests.length > 0) {
    console.log("db call: pulling friend requests");
    await getDocs(query(collection(db, "Users"))).then(async (inrequest) => {
      inrequest.forEach((indata) => {
        const data: User | undefined = userConverter.fromFirestore(indata);
        if (data !== undefined) {
          if (
            user.incomingRequests.includes(data.userid) &&
            !user.friendsList.includes(data.userid)
          ) {
            incoming.push(data);
          } else if (
            user.outgoingRequests.includes(data.userid) &&
            !user.friendsList.includes(data.userid)
          ) {
            outgoing.push(data);
          }
        }
      });
      dbPulled = true;
      let newIncoming = user.incomingRequests;
      const badInIds: string[] = [];
      user.incomingRequests.forEach((reqId) => {
        const index = incoming.findIndex((item) => item.userid === reqId);
        if (index < 0 || user.friendsList.includes(reqId)) {
          badInIds.push(reqId);
        }
      });
      newIncoming = newIncoming.filter((item) => !badInIds.includes(item));

      let newOutgoing = user.outgoingRequests;
      const badOutIds: string[] = [];
      user.outgoingRequests.forEach((reqId) => {
        const index = outgoing.findIndex((item) => item.userid === reqId);
        if (index < 0 || user.friendsList.includes(reqId)) {
          badOutIds.push(reqId);
        }
      });
      newOutgoing = newOutgoing.filter((item) => !badOutIds.includes(item));

      if (
        !newOutgoing.every(
          (val, index) => val === user.outgoingRequests[index]
        ) ||
        !user.outgoingRequests.every((val, index) => val === newOutgoing[index])
      ) {
        console.log("removing bad friend ids from outgoing");
        await updateDoc(
          doc(db, "Users", user.userid),
          "outgoingRequests",
          newOutgoing
        );
      }
      if (
        !newIncoming.every(
          (val, index) => val === user.incomingRequests[index]
        ) ||
        !user.incomingRequests.every((val, index) => val === newIncoming[index])
      ) {
        console.log("removing bad friend ids from incoming");
        await updateDoc(
          doc(db, "Users", user.userid),
          "incomingRequests",
          newIncoming
        );
      }

      setIncoming(incoming);
      setOutgoing(outgoing);
      pulled = true;
    });
  }
  if (!pulled) {
    setIncoming(incoming);
    setOutgoing(outgoing);
  }
  dbPulled = true;
}
