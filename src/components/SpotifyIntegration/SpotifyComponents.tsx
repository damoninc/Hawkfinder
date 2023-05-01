import React from "react";
import User from "../../data/User";
import axios from "axios";
import "../../styles/spotify.css";
import { Box, LinearProgress, Stack, Typography } from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import { db, functions } from "../../firebase/config";
import Marquee from "react-fast-marquee";
import { boxTheme } from "../../App";
import { httpsCallable } from "@firebase/functions";

const api_uri = "https://api.spotify.com/v1";
const spotifyLogo =
  "https://firebasestorage.googleapis.com/v0/b/csc-450-project.appspot.com/o/HAWKFINDER%2Ffile-spotify-logo-png-4.png?alt=media&token=4ffa3420-edf1-4f8e-8ee4-8b1b7fc19093";

function DisplaySong(
  song: Song,
  times?: number[],
  sx: {
    width?: string;
    maxWidth?: string;
    minWidth?: string;
    textWidth?: string;
    fontSize?: string;
    fontStyle?: string;
    imgSize?: string;
    imgBorder?: string;
    scrollLimit?: {
      xs?: number;
      sm?: number;
      md?: number;
      lg?: number;
      xl?: number;
    };
  } = { width: "100%", imgSize: "100px" }
) {
  if (!sx.scrollLimit) {
    sx.scrollLimit = { xs: 7 };
  }
  let scrollLimit = 20;
  if (screen.width < 600) {
    scrollLimit = sx.scrollLimit.xs ? sx.scrollLimit.xs : 7;
  } else if (screen.width < 900) {
    scrollLimit = sx.scrollLimit.sm
      ? sx.scrollLimit.sm
      : sx.scrollLimit.xs
      ? sx.scrollLimit.xs
      : 10;
  } else {
    scrollLimit = sx.scrollLimit.md
      ? sx.scrollLimit.md
      : sx.scrollLimit.sm
      ? sx.scrollLimit.sm
      : sx.scrollLimit.xs
      ? sx.scrollLimit.xs
      : 15;
  }
  return (
    <div
      style={{
        display: "block",
        border: boxTheme.border,
        borderColor: boxTheme.borderColor,
        background: boxTheme.backgroundPrimary,
        width: sx.width ? sx.width : "100%",
        maxWidth: sx.maxWidth ? sx.maxWidth : `${Number(screen.width * 0.9)}px`,
        minWidth: sx.minWidth ? sx.minWidth : "0px",
        padding: "10px",
        borderRadius: "25px",
      }}
    >
      <div
        className="songBox"
        style={{ justifyItems: "center", alignContent: "center" }}
      >
        <Box alignItems="center" justifyContent="center">
          <img
            src={
              song.album.images[1].url == null ? "" : song.album.images[1].url
            }
            style={{
              width: sx.imgSize ? sx.imgSize : "100px",
              height: sx.imgSize ? sx.imgSize : "100px",
              borderRadius: sx.imgBorder ? sx.imgBorder : "25px",
            }}
          />
        </Box>
        <div className="songText">
          <Marquee
            play={song.name ? song.name.length > scrollLimit : false}
            speed={20}
            gradient={false}
            style={{
              width:
                screen.width < 600
                  ? "100%"
                  : sx.textWidth
                  ? sx.textWidth
                  : "120px",
            }}
          >
            <Typography variant="h6" sx={{ marginRight: "25px" }}>
              <b>{song.name}</b>
            </Typography>
          </Marquee>
          <p
            style={{
              paddingLeft: "10px",
              lineHeight: "0px",
              fontSize: "16px",
              fontStyle: sx?.fontStyle,
            }}
          >
            by{" "}
            {song.artists.length == 1
              ? song.artists[0].name
              : song.artists[0].name + " et al."}
          </p>
          <p
            style={{ paddingLeft: "15px", lineHeight: "0px", fontSize: "16px" }}
          >
            on {song.album.name}
          </p>
        </div>
        <a
          href={song.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginLeft: "10px" }}
        >
          <img src={spotifyLogo} style={{ height: "30px", width: "30px" }} />
        </a>
      </div>

      {times == null ? (
        <div></div>
      ) : (
        <div className="currSong">
          <p style={{ fontSize: "16px" }}>
            {`0${Math.floor((times[0] / 1000 / 60) << 0)}`.slice(-2)}:
            {`0${Math.floor((times[0] / 1000) % 60)}`.slice(-2)}
          </p>
          <LinearProgress
            value={(times[0] / times[1]) * 100}
            variant="determinate"
            style={{
              width: "100%",
              marginRight: "8px",
              marginLeft: "8px",
              marginTop: "8px",
              paddingTop: "10px",
            }}
          />

          <p style={{ fontSize: "16px" }}>
            {`0${Math.floor((times[1] / 1000 / 60) << 0)}`.slice(-2)}:
            {`0${Math.floor((times[1] / 1000) % 60)}`.slice(-2)}
          </p>
        </div>
      )}
    </div>
  );
}

function DisplaySongSmall(song: Song, scrolling: boolean) {
  if (scrolling) {
    return (
      <Marquee
        play={scrolling}
        speed={20}
        gradient={false}
        style={{ width: screen.width < 600 ? "100%" : "150px" }}
      >
        <Typography variant="body2" sx={{ marginRight: "15px" }}>
          Listening to: <b>{song.name}</b> by{" "}
          {song.artists.length == 1
            ? song.artists[0].name
            : song.artists[0].name + " et al."}
        </Typography>
      </Marquee>
    );
  } else {
    return (
      <div
        style={{
          lineHeight: "0%",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          marginRight: "15px",
        }}
      >
        <p>
          <b>{song.name}</b>
        </p>
        <p>
          by{" "}
          {song.artists.length == 1
            ? song.artists[0].name
            : song.artists[0].name + " et al."}
        </p>
      </div>
    );
  }
}

// type for song recieved from spotify api call
interface Song {
  album: {
    images: { url: string | null }[];
    name: string | null;
  };
  name: string | null;
  artists: { name: string }[];
  external_urls: { spotify: string };
  duration_ms: number;
  id: string;
}

interface IProps {
  user: User;
  small: boolean;
  limit?: number;
  sx?: {
    width?: string;
    maxWidth?: string;
    minWidth?: string;
    textWidth?: string;
    fontSize?: string;
    fontStyle?: string;
    imgSize?: string;
    imgBorder?: string;
    scrollLimit?: {
      xs?: number;
      sm?: number;
      md?: number;
      lg?: number;
      xl?: number;
    };
  };
}

interface IState {
  result?: { item: Song; progress_ms: number; items: { track: Song }[] } | null;
  time: Date;
}

class spotifyComponent extends React.Component<IProps, IState> {
  pulled = false;
  constructor(props: IProps) {
    super(props);
    this.state = { result: null, time: new Date() };
  }

  async makeRequest(user: User, request_uri: string) {
    if (user.spotify.refreshToken != "null") {
      await axios
        .get(api_uri + request_uri, {
          method: "GET",
          headers: { Authorization: `Bearer ${user.spotify.accessToken}` },
        })
        .then((response) => {
          if (response.data != "" && !this.pulled) {
            this.pulled = true;
          }
          this.setState({ result: response.data });
        })
        .catch(async (error) => {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            if (error.response.status === 401) {
              this.refreshToken();
            }
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
          }
          console.log(error.config);
        });
    }
  }
  refreshToken() {
    const spotRefresh = httpsCallable(functions, 'spotifyRefresh');
    spotRefresh({refresh_token: this.props.user.spotify.refreshToken})
    .then((result : any) => {
      console.log(result)
      if (result.data) {
        console.log(result.data)
        if (result.data.access_token){
          console.log("db access update");
          this.props.user.spotify.accessToken = result.data.access_token;
          updateDoc(
            doc(db, "Users", this.props.user.userid),
            "spotifyTokens.accessToken",
            this.props.user.spotify.accessToken
          ); 

          if (this.props.user.spotify.accessToken == "null") {
            console.log("bad refresh, reauthenticate");
            this.props.user.spotify.refreshToken = "null";
            updateDoc(
              doc(db, "Users", this.props.user.userid),
              "spotifyTokens.refreshToken",
              this.props.user.spotify.refreshToken
            );
          }
          console.log("db refresh update");
          this.setState({ result: null });
          this.pulled = false;
          window.location.reload;
        }}
    });
  }
}

/**
 * Returns component that displays the song on spotify that the given user is currently listening to
 *
 * @param user : User - the user to get currently listening to
 * @param small : boolean - whether the component should display in small mode (true if yes, false if no)
 * @export
 * @class CurrentSong
 * @extends {spotifyComponent}
 */
export default class CurrentSong extends spotifyComponent {
  constructor(props: IProps) {
    super(props);
  }

  componentDidMount() {
    this.setState({ time: new Date() });
    this.pulled = false;
    setInterval(
      () => {
        this.setState({ time: new Date() });
        this.pulled = false;
      },
      this.props.small ? 60000 : 3000
    );
  }

  render() {
    if (!this.pulled && this.props.user !== undefined) {
      this.pulled = true;
      this.makeRequest(this.props.user, "/me/player/currently-playing");
    }
    if (this.state.result == null) {
      return <div></div>;
    } else {
      if (this.state.result.item == null) {
        return <div></div>;
      }
      const times: number[] = [
        this.state.result.progress_ms,
        this.state.result.item.duration_ms,
      ];
      return (
        <div style={{ padding: this.props.small ? "0px" : "10px" }}>
          {!this.props.small ? (
            <div>
              <h3 style={{ fontSize: "12px" }}>Listening to on Spotify</h3>
              {DisplaySong(this.state.result.item, times, this.props.sx)}
            </div>
          ) : (
            DisplaySongSmall(this.state.result.item, true)
          )}
        </div>
      );
    }
  }
}

/**
 * Returns component that displays a list of top songs the user listens to on spotify
 *
 * @param user : User - the user to get top songs for
 * @param small : boolean - whether the component should display in small mode (true if yes, false if no)
 * @param limit : number - the number of top songs to display (max of 20)
 * @export
 * @class TopSongs
 * @extends {spotifyComponent}
 */
export class TopSongs extends spotifyComponent {
  constructor(props: IProps) {
    super(props);
  }

  componentDidMount() {
    this.setState({ time: new Date() });
    this.pulled = false;
    setInterval(() => {
      this.setState({ time: new Date() });
      this.pulled = false;
    }, 60000);
  }

  render() {
    if (
      !this.pulled &&
      this.state.result == null &&
      this.props.user !== undefined
    ) {
      this.makeRequest(this.props.user, "/me/top/tracks");
    }
    if (this.state.result == null) {
      return <div></div>;
    } else {
      if (this.state.result.items == null) {
        return <div></div>;
      }
    }
    if (this.props.small) {
      return (
        <div>
          <h3>Top Songs</h3>
          <ul style={{ paddingLeft: "5%", flexWrap: "wrap" }}>
            {this.state.result.items
              .slice(this.props.limit === undefined ? 15 : -this.props.limit)
              .map((song: any) => (
                <li style={{ flexWrap: "wrap" }} key={song.id}>
                  {DisplaySongSmall(song, false)}
                </li>
              ))}
          </ul>
        </div>
      );
    } else {
      return (
        <div>
          <h3>Top Songs</h3>
          {this.state.result.items
            .slice(this.props.limit === undefined ? 15 : -this.props.limit)
            .map((song: any) => (
              <div key={song.id}>{DisplaySong(song)}</div>
            ))}
        </div>
      );
    }
  }
}

/**
 * Returns component that displays a list of recent songs the user listens to on spotify
 *
 * @param user : User - the user to get recent songs for
 * @param small : boolean - whether the component should display in small mode (true if yes, false if no)
 * @param limit : number - the number of top songs to display (max of 20)
 * @export
 * @class RecentSongs
 * @extends {spotifyComponent}
 */
export class RecentSongs extends spotifyComponent {
  constructor(props: IProps) {
    super(props);
  }

  componentDidMount() {
    this.setState({ time: new Date() });
    this.pulled = false;
    setInterval(() => {
      this.setState({ time: new Date() });
      this.pulled = false;
    }, 60000);
  }

  render() {
    if (
      !this.pulled &&
      this.state.result == null &&
      this.props.user !== undefined
    ) {
      this.pulled = true;
      this.makeRequest(this.props.user, "/me/player/recently-played");
    }
    if (this.state.result == null) {
      return <div></div>;
    } else {
      if (this.state.result.items == null) {
        return <div></div>;
      }
      if (this.props.small) {
        return (
          <div>
            <ul style={{ paddingLeft: "5%" }}>
              {this.state.result.items
                .slice(this.props.limit === undefined ? 15 : -this.props.limit)
                .map((song) => (
                  <li
                    key={
                      song.track.id +
                      Math.floor(Math.random() * 3000).toString()
                    }
                  >
                    {DisplaySongSmall(song.track, false)}
                  </li>
                ))}
            </ul>
          </div>
        );
      } else {
        return (
          <div>
            <Stack spacing={2}>
              {this.state.result.items
                .slice(this.props.limit === undefined ? 15 : -this.props.limit)
                .map((song: any) => (
                  <div
                    style={{ maxWidth: this.props.sx?.maxWidth }}
                    key={
                      song.track.id +
                      Math.floor(Math.random() * 3000).toString()
                    }
                  >
                    {DisplaySong(song.track)}
                  </div>
                ))}
            </Stack>
          </div>
        );
      }
    }
  }
}
