import React from "react";
import "../../styles/userbox.css";
import User from "../../data/User";
import { Stack, Box, Button, Typography, Grid, Avatar } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { storage } from "../../firebase/config";
import { getDownloadURL, ref } from "firebase/storage";
import { Navigate } from "react-router-dom";
import * as fp from "./FriendPage";
import * as requests from "../FriendSystem/FriendRequests";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import Modal from "@mui/material/Modal";
import CurrentSong from "../SpotifyIntegration/SpotifyComponents";
import { boxTheme } from "../../App";

const buttonStyle = {
  width: "100%",
  height: "100%",
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  textTransform: "none",
};

const inButtonStyle = {
  width: "50%",
  height: "100%",
  borderRadius: 0,
  textTransform: "none",
};

export enum ButtonType {
  Friends = 1,
  NotFriends,
  Incoming,
  Outgoing,
}

interface IProps {
  user: User;
  currentUser: User | null;
}

interface IState {
  pfpUrl: string;
  mainClicked: boolean;
  smallClick: boolean;
  modalClick: boolean;
  refresh: number;
}

export default class UserBox extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      pfpUrl: "",
      mainClicked: false,
      smallClick: false,
      modalClick: false,
      refresh: 1,
    };
  }

  componentDidMount() {
    this.getUrl();
  }
  async getUrl() {
    await getDownloadURL(
      ref(storage, this.props.user.profile.profilePicture)
    ).then((storageUrl) => {
      this.setState({ pfpUrl: storageUrl });
    });
  }

  confirmButtons = (func: (arg0: User, arg1: User) => void) => {
    const confButtonStyle = {
      width: "50%",
      height: "100%",
      textTransform: "none",
    };
    return (
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="flex-start"
        spacing={0}
        sx={{ width: "100%" }}
      >
        <Button
          sx={confButtonStyle}
          variant="contained"
          color="success"
          onClick={() => {
            func(this.props.currentUser!, this.props.user);
            setTimeout(() => {
              this.setState({ smallClick: false });
            }, 1000);
          }}
        >
          <CheckIcon />
        </Button>
        <Button
          color="error"
          variant="contained"
          sx={confButtonStyle}
          onClick={() => {
            this.setState({ smallClick: false });
          }}
        >
          <CloseIcon />
        </Button>
      </Stack>
    );
  };

  render() {
    if (!this.props.user || !this.props.currentUser) {
      return <div></div>;
    }
    if (this.state.mainClicked) {
      return (
        <Navigate to={`/components/Profile#userid=${this.props.user.userid}`} />
      );
    }

    const buttons = () => {
      if (!this.props.currentUser) {
        return <div></div>;
      }
      if (this.props.currentUser.userid == this.props.user.userid) {
        return (
          <div>
            {" "}
            <Button
              variant="contained"
              sx={buttonStyle}
              onClick={() => {
                this.setState({ modalClick: true });
              }}
            >
              <Typography variant="body1">
                <b>dis u?</b>
              </Typography>
            </Button>
          </div>
        );
      } else if (
        this.props.currentUser.friendsList.includes(this.props.user.userid)
      ) {
        return (
          <Button
            variant="contained"
            sx={buttonStyle}
            onClick={() => {
              this.setState({ modalClick: true });
            }}
          >
            <HeadphonesIcon />
          </Button>
        );
      } else if (
        this.props.currentUser.incomingRequests.includes(this.props.user.userid)
      ) {
        return this.state.smallClick ? (
          this.confirmButtons(requests.accept)
        ) : (
          <Box>
            <Button
              variant="contained"
              sx={inButtonStyle}
              onClick={() => {
                this.setState({ smallClick: true });
              }}
            >
              <CheckCircleOutlineOutlinedIcon />
            </Button>
            <Button
              variant="contained"
              sx={inButtonStyle}
              onClick={() => {
                requests.decline(this.props.currentUser!, this.props.user);
              }}
            >
              <CancelOutlinedIcon />
            </Button>
          </Box>
        );
      } else if (
        this.props.currentUser.outgoingRequests.includes(this.props.user.userid)
      ) {
        return this.state.smallClick ? (
          this.confirmButtons(requests.cancel)
        ) : (
          <Button
            variant="contained"
            sx={buttonStyle}
            onClick={() => {
              this.setState({ smallClick: true });
            }}
          >
            <CancelOutlinedIcon />
          </Button>
        );
      } else {
        return this.state.smallClick ? (
          this.confirmButtons(fp.addFriend)
        ) : (
          <Button
            variant="contained"
            sx={buttonStyle}
            onClick={() => {
              this.setState({ smallClick: true });
            }}
          >
            <PersonAddIcon />
          </Button>
        );
      }
    };

    return (
      <div>
        <Box
          sx={{
            display: "grid",
            width: 150,
            height: 200,
            border: "4px solid",
            borderColor: boxTheme.borderColor,
            borderRadius: "25px",
            overflow: "hidden",
            backgroundColor: boxTheme.backgroundPrimary,
            gridTemplateRows: "80% 20%",
          }}
        >
          <Button
            onClick={() => {
              this.setState({ mainClicked: true });
            }}
          >
            <Stack
              justifyContent="center"
              alignItems="center"
              spacing={0.5}
              sx={{ height: "100%" }}
            >
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
                {this.props.user.profile.firstName}{" "}
                {this.props.user.profile.lastName}
              </h3>
            </Stack>
          </Button>
          {buttons()}
        </Box>
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
              backgroundColor: boxTheme.backgroundPrimary,
              transform: "translate(-50%, -50%)",
            }}
          >
            <Grid item sx={{ width: "100%", padding: "10px" }}>
              <SmallUserBox user={this.props.user} pfp={this.state.pfpUrl} />
            </Grid>
            <Grid item sx={{ padding: "10px" }}>
              <Typography>{this.props.user.profile.bio}</Typography>
            </Grid>
            <Grid
              item
              sx={{ width: "100%" }}
              justifyItems="center"
              alignItems="center"
            >
              <CurrentSong user={this.props.user} small={false} />
            </Grid>
          </Grid>
        </Modal>
      </div>
    );
  }
}

function SmallUserBox(props: { user: User; pfp: string }) {
  return (
    <Grid container spacing={2} sx={{ paddingLeft: "10px" }}>
      <Grid item xs={4}>
        <Avatar src={props.pfp} sx={{ width: 96, height: 96 }} />
      </Grid>
      <Stack justifyContent="center" alignItems="center">
        <Typography variant="h4">
          <b>
            {props.user.profile.firstName} {props.user.profile.lastName}
          </b>
        </Typography>
      </Stack>
    </Grid>
  );
}
