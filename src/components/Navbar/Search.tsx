import React from "react";
import User, { userConverter } from "../../data/User";
import "../../styles/friendpage.css";
import { db } from "../../firebase/config";
import { collection, query, getDocs, doc, getDoc } from "firebase/firestore";
import { Box, CircularProgress } from "@mui/material";
import UserBox from "../FriendSystem/UserBox";
import Navbar from "./Navbar";

/**
 * Generates a HTML block that displays a list of Users based
 * on the inputted text.
 *
 * @return {*} - FriendSearch HTML
 */
export let lastSearch = "";

interface IProps {
  uCreds: string | undefined;
}

interface IState {
  dbCall: User[] | null;
  search: string | null;
  loggedUser: User | null;
}

export default class SearchPage extends React.Component<IProps, IState> {
  rerender = false;
  intervalID: any;
  constructor(props: IProps) {
    super(props);
    this.state = { dbCall: null, search: "", loggedUser: null };
  }

  componentDidMount(): void {
    this.intervalID = setInterval(() => {
      const search = new URLSearchParams(
        window.location.hash.split("#")[1]
      ).get("q");
      if (search != this.state.search) {
        this.setState({ search: search });
        console.log("trying to find search");
        this.rerender = true;
      }
    }, 500);
  }
  componentWillUnmount(): void {
    clearInterval(this.intervalID);
  }

  render() {
    if (this.rerender) {
      console.log("calling db");
      this.callDB();
      this.rerender = false;
    }
    return (
      <div>
        <Navbar />
        <Box
          className="search"
          sx={{
            border: "4px solid teal",
            borderRadius: "25px",
            overflow: "hidden",
            gridTemplateRows: "75px 100%",
            justifyItems: "center",
          }}
        >
          <h1>User Search</h1>
          {this.checkNullList()}
        </Box>
      </div>
    );
  }

  async callDB() {
    const querySnapshot = await getDoc(
      doc(db, "Users", this.props.uCreds!).withConverter(userConverter)
    );
    const dbUser = querySnapshot.data();
    if (dbUser !== undefined) {
      this.setState({ loggedUser: dbUser });
    }

    let msg = this.state.search;
    const users: User[] = [];

    if (msg == null || msg.length == 0) {
      this.setState({ dbCall: null });
      return;
    }

    msg = msg.replace(/\s/g, "");
    msg = msg.toLocaleLowerCase();
    lastSearch = msg;
    await getDocs(query(collection(db, "Users"))).then(async (usersData) => {
      usersData.forEach((user) => {
        const data: User | undefined = userConverter.fromFirestore(user);
        if (data !== undefined) {
          if (
            data.profile.userName.toLocaleLowerCase().includes(msg!) ||
            data.profile.firstName.toLocaleLowerCase().includes(msg!) ||
            data.profile.lastName.toLocaleLowerCase().includes(msg!) ||
            `${data.profile.firstName.toLocaleLowerCase()}${data.profile.lastName.toLocaleLowerCase()}`.includes(
              msg!
            )
          ) {
            users.push(data);
          }
        }
      });
      this.setState({ dbCall: users });
      console.log("db call");
    });
  }

  checkNullList() {
    if (this.state.dbCall == null || this.state.loggedUser == null) {
      return (
        <div className="loadUsers">
          <CircularProgress />
        </div>
      );
    }
    if (this.state.dbCall.length == 0) {
      return (
        <div>
          <h2>This user does not exist :(</h2>
        </div>
      );
    } else {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {this.state.dbCall.map((user) => (
            <div className="user" key={user.username}>
              <UserBox user={user} currentUser={this.state.loggedUser} />
            </div>
          ))}
        </div>
      );
    }
  }
}
