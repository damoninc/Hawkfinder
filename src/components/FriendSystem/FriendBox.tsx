import React from "react";
import "../../styles/userbox.css";
import User from "../../data/User";
import CurrentSong from "../SpotifyIntegration/SpotifyComponents";
import { Stack, Box, Typography, Grid, Modal, Button } from "@mui/material";
import { storage } from "../../firebase/config";
import { getDownloadURL, ref } from "firebase/storage";
import { boxTheme } from "../../App";
import { SmallUserBox } from "./UserBox";

interface IProps {
  friend: User;
  smol?: boolean;
}

interface IState {
  pfpUrl: string;
  modalClick: boolean;
}

/**
 * Generates a HTML block that displays a user based on their Profile information
 *      Currently displays the name and interests as well as having buttons to go to
 *      their profile, messages, and removing them.
 * @param {User} friend - The user to display
 * @parma {Boolean} smol - determines whether to display a small FriendBox
 * @return {*} - FriendBox HTML
 */
export default class FriendBox extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { pfpUrl: "", modalClick: false };
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
        <>
          <Button
            onClick={() => {
              this.setState({ modalClick: true });
            }}
            sx={{ textTransform: "none" }}
          >
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
                <CurrentSong user={this.props.friend} small={true} />
              </Stack>
            </div>
          </Button>
          <Modal
            open={this.state.modalClick}
            onClose={() => {
              this.setState({ modalClick: false });
            }}
          >
            <Grid
              container
              alignItems="center"
              justifyItems="center"
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                minWidth: "300px",
                maxWidth: "400px",
                border: "6px solid",
                borderColor: boxTheme.borderColor,
                borderRadius: "25px",
                overflow: "hidden",
                gridTemplateRows: "80% 20%",
                backgroundColor: boxTheme.backgroundSecondary,
                transform: "translate(-50%, -50%)",
              }}
            >
              <Grid item sx={{ width: "100%", padding: "10px" }}>
                <SmallUserBox
                  user={this.props.friend}
                  pfp={this.state.pfpUrl}
                />
              </Grid>
              <Grid item sx={{ padding: "10px" }}>
                <Box sx={{ maxHeight: "20vh", overflowY: "auto" }}>
                  <Typography sx={{ m: 2 }}>
                    {this.props.friend.profile.bio}
                  </Typography>
                </Box>
              </Grid>
              <Grid
                item
                sx={{ width: "100%" }}
                justifyItems="center"
                alignItems="center"
              >
                <CurrentSong
                  user={this.props.friend}
                  small={false}
                  sx={{ scrollLimit: { xs: 20 }, textWidth: "100%" }}
                />
              </Grid>
            </Grid>
          </Modal>
        </>
      );
    } else {
      return (
        <Box
          sx={{
            display: "grid",
            width: 150,
            height: 200,
            border: "4px solid",
            overflow: "hidden",
            borderColor: boxTheme.borderColor,
            borderRadius: "25px",
            gridTemplateRows: "80% 20%",
            background: boxTheme.backgroundPrimary,
            justifyContent: "center",
            justifyItems: "center",
            alignItems: "center",
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
          <Box width={"95%"} overflow="hidden">
            <CurrentSong user={this.props.friend} small={true} />
          </Box>
        </Box>
      );
    }
  }
}
