import React from "react";
import "../../styles/userbox.css";
import User from "../../data/User";
import CurrentSong from "../SpotifyIntegration/SpotifyComponents";
import { Stack, Box } from "@mui/material";
import { storage } from "../../firebase/config";
import { getDownloadURL, ref } from "firebase/storage";

interface IProps {
  friend: User;
}

interface IState {
  pfpUrl: string;
}

/**
 * Generates a HTML block that displays a user based on their Profile information
 *      Currently displays the name and interests as well as having buttons to go to
 *      their profile, messages, and removing them.
 * @param {User} friend - The user to display
 * @return {*} - FriendBox HTML
 */
export default class FriendBox extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { pfpUrl: "" };
  }

  componentDidMount() {
    this.getUrl();
  }
  async getUrl() {
    await getDownloadURL(
      ref(storage, this.props.friend.profile.profilePicture)
    ).then((storageUrl) => {
      this.setState({ pfpUrl: storageUrl });
    });
  }
  render() {
    if (this.props.friend === undefined) {
      return <div></div>;
    }
    return (
      <Box
        sx={{
          width: 150,
          height: 200,
          border: "2px solid black",
          borderRadius: "25px",
        }}
      >
        <Stack justifyContent="center" alignItems="center" spacing={0.5}>
          <img
            src={`${this.state.pfpUrl}`}
            style={{
              height: "100px",
              width: "100px",
              borderRadius: "50px",
              marginTop: "10px",
            }}
          />
          <h3 style={{ lineHeight: "16px" }}>
            {this.props.friend.profile.firstName}{" "}
            {this.props.friend.profile.lastName}
          </h3>
          <CurrentSong user={this.props.friend} small={true} />
        </Stack>
      </Box>
    );
  }
}
