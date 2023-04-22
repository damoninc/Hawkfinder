import React from "react";
import "../../styles/userbox.css";
import User from "../../data/User";
import CurrentSong from "../SpotifyIntegration/SpotifyComponents";
import { Stack, Box, Typography, Grid } from "@mui/material";
import { storage } from "../../firebase/config";
import { getDownloadURL, ref } from "firebase/storage";
import { boxTheme } from "../../App";

interface IProps {
  friend: User;
  smol?: boolean;
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
    if (this.props.smol) {
      return (
        <div
          style={{
            display: "flex",
            border: boxTheme.border,
            borderColor: boxTheme.borderColor,
            background: boxTheme.backgroundPrimary,
            width: "250px",
            maxWidth: `${Number(screen.width * 0.9)}px`,
            height: "60px",
            borderRadius: "50px",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <div>
            <img
              src={this.state.pfpUrl}
              style={{
                marginTop: "8px",
                marginRight: "10px",
                width: "52px",
                height: "52px",
                borderRadius: "50px",
              }}
            />
          </div>
          <Stack>
            <Typography variant="body1" sx={{ textAlign: "left" }}>
              <b>{`${this.props.friend.profile.firstName} ${this.props.friend.profile.lastName}`}</b>
            </Typography>
            <Typography
              variant="body2"
              sx={{ textAlign: "left", paddingLeft: "10px" }}
            >
              {`@${this.props.friend.profile.userName.toLocaleLowerCase()}`}
            </Typography>
          </Stack>
        </div>
      );
    } else {
      return (
        <Box
          sx={{
            display: "grid",
            width: 150,
            height: 200,
            border: "4px solid",
            borderColor: boxTheme.borderColor,
            borderRadius: "25px",
            gridTemplateRows: "80% 20%",
            background: boxTheme.backgroundPrimary,
            justifyContent:"center",
            alignItems:"center"
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
          </Stack>
          <CurrentSong user={this.props.friend} small={true} />

        </Box>
      );
    }
  }
}
