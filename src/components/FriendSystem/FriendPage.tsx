import React, { useState } from "react";
import User, { userConverter } from "../../data/User";
import "../../styles/friendpage.css";
import FriendBox from "./FriendBox";
import FriendSearch from "./FriendSearch";
import {
  Badge,
  Button,
  CircularProgress,
  Drawer,
  Grid,
  Stack,
} from "@mui/material";
import { db } from "../../firebase/config";
import {
  doc,
  collection,
  query,
  where,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import FriendRequests from "./FriendRequests";
import CurrentSong, {
  RecentSongs,
  TopSongs,
} from "../SpotifyIntegration/SpotifyComponents";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SpotifyAuthDeauth from "../SpotifyIntegration/SpotifyLogin";
import { Navigate, useNavigate } from "react-router-dom";

export let user: User;

let dbPulled = false;

/**
 * Generates a HTML block that displays a user's friend list by creating
 *    a FriendBox for each friend in their friend list.
 * Shows all friends or a "no friends" message is applicable.
 * @param signedUser : string
 * @return {*} - FriendPage HTML
 */
export default function FriendPage(currUser: { uCreds: string }) {
  const [dbCall, setFriends] = useState(null);
  const [pageSwitch, setSwitch] = useState(0);
  const navigate = useNavigate();

  if (!dbPulled || dbCall == null) {
    callDB(currUser.uCreds, setFriends);
  }

  const friendList = (
    <div className="friends-list">
      <h1>Friends List</h1>
      {checkNullList(dbCall)}
    </div>
  );

  const friendRequests = FriendRequests(user);

  const search = <FriendSearch />;

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
            onClick={() => setSwitch(0)}
            style={{ margin: "15px" }}
          >
            Friends
          </Button>
          <Badge
            badgeContent={user !== undefined ? user.incomingRequests.length : 0}
            color="success"
          >
            <Button variant="contained" onClick={() => setSwitch(1)}>
              Requests
            </Button>
          </Badge>
          <Button
            variant="contained"
            onClick={() => setSwitch(2)}
            style={{ margin: "15px" }}
          >
            Search
          </Button>
        </Grid>
      </div>
      {pageSwitch == 0 ? friendList : pageSwitch == 1 ? friendRequests : search}
    </div>
  );
}

function checkNullList(friends: User[] | null) {
  const [open, setOpen] = React.useState("");

  function handleOpen(userid: string) {
    setOpen(userid);
  }

  function handleClose() {
    setOpen("");
  }

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
        {friends.map((friend) => {
          return (
            <div className="friend" key={friend.username}>
              <div style={{ display: "flex" }}>
                <Button
                  onClick={() => {
                    handleOpen(friend.userid);
                  }}
                >
                  <FriendBox friend={friend} />
                </Button>
              </div>
              <Drawer
                anchor={"right"}
                open={open == friend.userid}
                onClose={handleClose}
              >
                <Button
                  onClick={handleClose}
                  variant="contained"
                  style={{
                    marginTop: "30px",
                    marginLeft: "20px",
                    marginRight: "20px",
                  }}
                >
                  <ArrowBackIcon />
                </Button>
                <div
                  style={{
                    minWidth: "25vw",
                    maxWidth: "50vw",
                    paddingLeft: "20px",
                    paddingRight: "20px",
                    justifyContent: "space-evenly",
                  }}
                >
                  <Stack
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    spacing={2}
                  >
                    <h1>
                      {friend.profile.firstName} {friend.profile.lastName}
                    </h1>
                    <RemoveButton user={friend} />
                    <h3>Bio</h3>
                    <p>{friend.profile.bio}</p>
                    <CurrentSong user={friend} small={false} />
                    <h3>Interests</h3>
                    <ul>
                      {friend.profile.interests.map((interest) => (
                        <li key={interest}>{interest}</li>
                      ))}
                    </ul>
                    <Stack
                      direction="row"
                      justifyContent="center"
                      alignItems="left"
                      spacing={2}
                      style={{ paddingLeft: "15px" }}
                    >
                      <TopSongs user={friend} small={true} limit={10} />
                      <RecentSongs user={friend} small={true} limit={10} />
                    </Stack>
                  </Stack>
                </div>
              </Drawer>
            </div>
          );
        })}
      </div>
    );
  }
}

interface IProps {
  user: User;
}
interface IState {
  removeClicked: boolean;
  profileClicked: boolean;
}
class RemoveButton extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { removeClicked: false, profileClicked: false };
  }

  render() {
    if (this.state.profileClicked) {
      return (
        <Navigate
          to={`/components/Profile?username=${this.props.user.userid}`}
        />
      );
    }
    return (
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="left"
        spacing={2}
        style={{ paddingLeft: "15px", width: "100%" }}
      >
        <Button
          variant="contained"
          style={{
            marginRight: "10px",
            width: "100%",
            textTransform: "none",
          }}
          onClick={() => {
            this.setState({ profileClicked: true });
          }}
        >
          Profile
        </Button>
        {!this.state.removeClicked ? (
          <Button
            variant="contained"
            style={{
              marginLeft: "10px",
              marginRight: "5px",
              width: "100%",
              textTransform: "none",
            }}
            onClick={() => {
              this.setState({ removeClicked: true });
            }}
          >
            Remove
          </Button>
        ) : (
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            spacing={0}
            style={{
              marginLeft: "5px",
              marginRight: "5px",
              width: "100%",
              textTransform: "none",
            }}
          >
            <Button
              style={{
                width: "50%",
                marginRight: "2px",
                marginLeft: "2px",
                textTransform: "none",
              }}
              variant="contained"
              color="success"
              onClick={() => {
                removeFriend(this.props.user);
              }}
            >
              Confirm
            </Button>
            <Button
              color="error"
              variant="contained"
              style={{
                width: "50%",
                marginRight: "2px",
                textTransform: "none",
                marginLeft: "2px",
              }}
              onClick={() => {
                this.setState({ clicked: false });
              }}
            >
              Cancel
            </Button>
          </Stack>
        )}
      </Stack>
    );
  }
}

/**
 * When called, sends a friend request to the given user
 *
 * @export
 * @param {string} [friendUsername] - username of the friend to send a request to
 */
export async function addFriend(friendUsername?: string) {
  if (confirm("Add Friend " + friendUsername + "?")) {
    if (friendUsername !== undefined) {
      await getDocs(
        query(
          collection(db, "Users"),
          where("profile.username", "==", friendUsername)
        )
      ).then(async (id) => {
        if (id.docs[0] !== undefined) {
          const friend: User | undefined = userConverter.fromFirestore(
            id.docs[0]
          );

          if (friend !== undefined) {
            if (!user.friendsList.includes(friend.userid)) {
              user.outgoingRequests.push(friend.userid);
              friend.incomingRequests.push(user.userid);

              // update outgoing requests in FireStore
              await updateDoc(
                doc(db, "Users", user.userid),
                "outgoingRequests",
                user.outgoingRequests
              );

              // update incoming requests in FireStore
              await updateDoc(
                doc(db, "Users", friend.userid),
                "incomingRequests",
                friend.incomingRequests
              );

              dbPulled = false;
              alert("Added " + friend.profile.userName);
              window.location.reload();
            } else {
              alert("This user is already your friend");
            }
          }
        } else {
          alert("This user does not exist");
        }
      });
    }
  }
}

/**
 * Removes the passed in User from the currently logged in user's friends list
 *
 * @export
 * @param {User} friend - friend to be removed
 */
export async function removeFriend(friend: User) {
  if (
    confirm("Are you sure you want to remove " + friend.profile.userName + "?")
  ) {
    if (friend !== undefined) {
      // get indicies and remove friend from user's friends list
      // and and user from friend's friend list
      const indexFriend = user.friendsList.indexOf(friend.userid, 0);
      const indexUser = friend.friendsList.indexOf(user.userid, 0);

      if (indexFriend < 0 || indexUser < 0) {
        alert("You are not friends");
        return;
      }

      indexUser > -1 ? user.friendsList.splice(indexFriend, 1) : null;
      indexFriend > -1 ? friend.friendsList.splice(indexUser, 1) : null;

      // Update User's and friend's friends list to reflect the removal
      await updateDoc(
        doc(db, "Users", user.userid),
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
        });
      });
    }
  }
}

/**
 * When called and sent a user object, the page will redirect to that user's profile
 *
 * @export
 * @param {User} friend - friend whose profile you want to navigate
 */
export function goToProfile(friend: User) {
  // Dummy function for navigating to user's profile
  alert("Cannot go to " + friend.username + "'s Profile");
}

async function callDB(signedUser: string, setFriends: any) {
  // Query Firestore for information from currently logged in user
  const querySnapshot = await getDoc(
    doc(db, "Users", signedUser).withConverter(userConverter)
  );
  console.log("Grabbing User Object");

  const dbUser = querySnapshot.data();
  if (dbUser !== undefined) {
    user = dbUser;
    console.log(user);
  }

  const friends = new Array<User>();
  // Friends list query from FireStore
  if (user.friendsList.length > 0) {
    await getDocs(
      query(collection(db, "Users"), where("userid", "in", user.friendsList))
    ).then((friendList) => {
      friendList.forEach((user) => {
        console.log("Getting Friends");
        const data: User | undefined = userConverter.fromFirestore(user);
        if (data !== undefined) {
          friends.push(data);
        }
      });
      dbPulled = true;
      setFriends(friends);
    });
  } else {
    // set friends to be an empty list if friends list is empty
    setFriends(friends);
    dbPulled = true;
  }
}
