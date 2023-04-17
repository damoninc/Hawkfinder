import React, { useState } from "react";
import User, { userConverter } from "../../data/User";
import "../../styles/friendpage.css";
import FriendBox from "./FriendBox";
import {
  Badge,
  Box,
  Button,
  Drawer,
  Grid,
  Stack,
  Typography,
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
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import LoadingPage from "../Navbar/Loading";

export let user: User;

let dbPulled = false;

/**
 * Generates a HTML block that displays a user's friend list by creating
 *    a FriendBox for each friend in their friend list.
 * Shows all friends or a "no friends" message is applicable.
 * @param signedUser : string
 * @return {*} - FriendPage HTML
 */
export default function FriendPage(props: { uCreds: string, page: string }) {
  const [dbCall, setFriends] = useState(null);
  const navigate = useNavigate();

  if (!dbPulled || !dbCall) {
    callDB(props.uCreds, setFriends);
  }

  const friendList = (
    <Grid 
    sx={{
      border: "4px solid teal",
      borderRadius: "25px",
      overflow:"hidden",
      gridTemplateRows: "75px 100%",
      justifyItems: "center",
    }}
    >     
      <Typography variant="h4" align="center" padding={"10px"}><b>Friends List</b></Typography>
      <Box 
        sx={{
          display:"flex",
          width: "100%",
          height: "100%",
          overflow:"hidden",
          justifyContent: "center",
          borderTop: "4px solid gray",
          paddingTop: "1%",
        }}
      >
        {checkNullList(dbCall)}
      </Box>
    </Grid>
  );

  const friendRequests = FriendRequests(user);

  return (
    <div>
      <Navbar />
      <div>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Button
            variant="contained"
            onClick={() => {navigate("/components/Friends")}}
            style={{ margin: "15px" }}
          >
            Friends
          </Button>
          <Badge
            badgeContent={user !== undefined ? user.incomingRequests.length : 0}
            color="success"
          >
            <Button variant="contained" onClick={() => {navigate("/components/Friends/requests")}}>
              Requests
            </Button>
          </Badge>
        </Grid>
      </div>
      {props.page == "list" ? friendList : props.page == "requests" ? friendRequests : <div></div> }
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
      <Stack   
        direction="column"
        justifyItems="center"
        alignItems="center"
        spacing={2}
      >
        {LoadingPage("Loading Friends")}
      </Stack>);
  }
  if (friends.length == 0) {
    return (
      <div>
        <h2>No Friends Found :(</h2>
      </div>
    );
  } else {
    return (
      <div style={{ display: "flex", justifyContent:"center", flexWrap: "wrap", width:"100%" }}>
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
        <Navigate to={`/components/Profile#userid=${this.props.user.userid}`} />
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
                this.setState({ removeClicked: false });
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

// TODO Document this
export async function addFriend(currUser: User, friend: User) {
  if (friend && currUser) {
    if (!currUser.friendsList.includes(friend.userid)) {
      currUser.outgoingRequests.push(friend.userid);
      friend.incomingRequests.push(currUser.userid);

      // update outgoing requests in FireStore
      await updateDoc(
        doc(db, "Users", currUser.userid),
        "outgoingRequests",
        currUser.outgoingRequests
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
  }


/**
 * Removes the passed in User from the currently logged in user's friends list
 *
 * @export
 * @param {User} friend - friend to be removed
 */
export async function removeFriend(friend: User) {
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

async function callDB(signedUser: string, setFriends: any) {
  // // Query Firestore for information from currently logged in user
  // const querySnapshot = await getDoc(
  //   doc(db, "Users", signedUser).withConverter(userConverter)
  // );
  // console.log("Pulling user for friends list");

  // const dbUser = querySnapshot.data();
  // if (dbUser !== undefined) {
  //   user = dbUser;

    // Friends list query from FireStore\
    const friends = new Array<User>();
      await getDocs(
        query(collection(db, "Users"))
      ).then((friendList) => {
        console.log("Pulling users for friends list")
        const users = new Array<User>();
        friendList.forEach((user) => {
          const data: User | undefined = userConverter.fromFirestore(user);
          if (data !== undefined) {
            users.push(data);
          }
        });

        const tmpUser = users.find(usr => usr.userid === signedUser);

        if (tmpUser !== undefined) {
          user = tmpUser;
          users.forEach((friend) => {
            if (friend !== undefined && user.friendsList.includes(friend.userid)){
              friends.push(friend)
            }
          })
          setFriends(friends)
          dbPulled = true

        }
      });
  }

