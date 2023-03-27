import React, { useState } from "react";
import User, { userConverter } from "../../data/User";
import "../../styles/friendrequest.css";
import * as fp from "./FriendPage";
import { CircularProgress } from "@mui/material";
import { db } from "../../App";
import {
  doc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import UserBox from "./UserBox";

let dbPulled = false;

/**
 * Generates a HTML block that displays a user's friend list by creating
 *    a FriendBox for each friend in their friend list.
 * Shows all friends or a "no friends" message is applicable.
 *
 * @return {*} - FriendPage HTML
 */
function FriendRequests(user: User) {
  const [incoming, setIncoming] = useState(null);
  const [outgoing, setOutgoing] = useState(null);
  if (!dbPulled || (incoming == null && outgoing == null)) {
    callDB(user, setIncoming, setOutgoing);
    return (
      <div className="page">
        <h1>Friend Requests</h1>
        <div className="requests">
          <CircularProgress />
        </div>
      </div>
    );
  }
  return (
    <div className="page">
      <h1>Friend Requests</h1>
      <div className="requests">
        {IncomingRequests(user, incoming)}
        {OutgoingRequests(user, outgoing)}
      </div>
    </div>
  );
}

// Returns HTML of UserBoxes for incoming requests
function IncomingRequests(currUser: User, incoming: Array<User> | null) {
  if (incoming == null) {
    return (
      <div className="loadUser">
        <h2>Loading Requests</h2>
        <CircularProgress />
      </div>
    );
  }
  const users =
    incoming.length == 0 ? (
      <div>
        <h2>No Incoming Requests</h2>
      </div>
    ) : (
      <div className="userBlock">
        {incoming.map((user) => (
          <div className="user" key={user.username}>
            {UserBox(user, inRequestButtons)}
          </div>
        ))}
      </div>
    );

  return (
    <div>
      <h2>Incoming Requests</h2>
      {users}
    </div>
  );
}

// Returns HTML of UserBoxes for outgoing requests
function OutgoingRequests(user: User, outgoing: Array<User> | null) {
  if (outgoing == null) {
    return (
      <div className="loadUser">
        <h2>Loading Friends...</h2>
        <CircularProgress />
      </div>
    );
  }
  const users =
    outgoing.length == 0 ? (
      <div>
        <h2>No Outgoing Requests</h2>
      </div>
    ) : (
      <div className="userBlock">
        {outgoing.map((request) => (
          <div className="user" key={request.username}>
            {UserBox(request, outRequestButtons)}
          </div>
        ))}
      </div>
    );

  return (
    <div>
      <h2>Sent Requests</h2>
      {users}
    </div>
  );
}

// HTML buttons for when the UserBox is for an incoming request
function inRequestButtons(user: User) {
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
          accept(user);
        }}
      >
        Accept
      </button>
      <button
        className="button"
        type="button"
        onClick={() => {
          decline(user);
        }}
      >
        Decline
      </button>
    </div>
  );
}

// HTML buttons for when the UserBox is for an outgoing request
function outRequestButtons(user: User) {
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
          cancel(user);
        }}
      >
        Cancel
      </button>
    </div>
  );
}

// Database Calling

/**
 * Declines a friend request when the decline button is pressed
 *
 * @param {User} request - User linked to declined friend request
 */
async function decline(request: User) {
  if (
    confirm(
      "Are you sure you want to decline " +
        request.profile.userName +
        "'s request ?"
    )
  ) {
    if (request !== undefined) {
      const indexFriend = fp.user.incomingRequests.indexOf(request.userid, 0);
      const indexUser = request.outgoingRequests.indexOf(fp.user.userid, 0);

      indexFriend > -1 ? fp.user.incomingRequests.splice(indexFriend, 1) : null;
      indexUser > -1 ? request.outgoingRequests.splice(indexUser, 1) : null;

      await updateDoc(
        doc(db, "Users", fp.user.userid),
        "incomingRequests",
        fp.user.incomingRequests
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
async function accept(request: User) {
  if (
    confirm(
      "Are you sure you want to accept " +
        request.profile.userName +
        "'s request ?"
    )
  ) {
    if (request !== undefined) {
      const indexRequest = fp.user.incomingRequests.indexOf(request.userid, 0);
      indexRequest > -1
        ? fp.user.incomingRequests.splice(indexRequest, 1)
        : null;

      const indexOutUser = request.outgoingRequests.indexOf(fp.user.userid, 0);
      indexOutUser > -1
        ? request.outgoingRequests.splice(indexOutUser, 1)
        : null;

      fp.user.friendsList.push(request.userid);
      request.friendsList.push(fp.user.userid);

      await updateDoc(
        doc(db, "Users", fp.user.userid),
        "friendsList",
        fp.user.friendsList
      );
      await updateDoc(
        doc(db, "Users", request.userid),
        "friendsList",
        request.friendsList
      );

      await updateDoc(
        doc(db, "Users", fp.user.userid),
        "incomingRequests",
        fp.user.incomingRequests
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
}

/**
 * Cancels a friend request when the cancel button on a request is pressed
 *
 * @param {User} request - the user associated with the cancelled request
 */
async function cancel(request: User) {
  if (
    confirm(
      "Are you sure you want to cancel your friend request to " +
        request.profile.userName +
        "?"
    )
  ) {
    if (request !== undefined) {
      const indexRequest = fp.user.outgoingRequests.indexOf(request.userid, 0);
      const indexUser = request.incomingRequests.indexOf(fp.user.userid, 0);

      indexRequest > -1
        ? fp.user.outgoingRequests.splice(indexRequest, 1)
        : null;
      indexUser > -1 ? request.incomingRequests.splice(indexUser, 1) : null;

      await updateDoc(
        doc(db, "Users", fp.user.userid),
        "outgoingRequests",
        fp.user.outgoingRequests
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
}

/**
 * Function used to query FireBase for the incoming and outgoing friend requests
 * Updates incoming and outgoing requests array in FriendRequests component
 * @param {*} setIncoming - Hook to set incoming requests
 * @param {*} setOutgoing - Hook to set outgoing requests
 */
async function callDB(user: User, setIncoming: any, setOutgoing: any) {
  let incomingPulled = false;
  let outgoingPulled = false;
  const incoming = new Array<User>();
  const outgoing = new Array<User>();
  if (user === undefined) {
    return;
  }
  if (user.incomingRequests.length > 0) {
    console.log("DB Call");
    await getDocs(
      query(
        collection(db, "Users"),
        where("userid", "in", user.incomingRequests)
      )
    ).then((inrequest) => {
      inrequest.forEach((user) => {
        const data: User | undefined = userConverter.fromFirestore(user);
        if (data !== undefined) {
          incoming.push(data);
        }
      });
      incomingPulled = true;
      setIncoming(incoming);
    });
  }
  if (user.outgoingRequests.length > 0) {
    console.log("DB Call");
    await getDocs(
      query(
        collection(db, "Users"),
        where("userid", "in", user.outgoingRequests)
      )
    ).then((outrequest) => {
      outrequest.forEach((user) => {
        const data: User | undefined = userConverter.fromFirestore(user);
        if (data !== undefined) {
          outgoing.push(data);
        }
      });
      outgoingPulled = true;
      setOutgoing(outgoing);
    });
  }
  !incomingPulled ? setIncoming(incoming) : null;
  !outgoingPulled ? setOutgoing(outgoing) : null;
  dbPulled = true;
}

export default FriendRequests;
