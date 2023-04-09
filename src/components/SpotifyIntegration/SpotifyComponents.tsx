import React from "react";
import User from "../../data/User";
import axios from "axios";
import "../../styles/spotify.css";
import { LinearProgress } from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

const api_uri = "https://api.spotify.com/v1";
const spotifyLogo =
  "https://firebasestorage.googleapis.com/v0/b/csc-450-project.appspot.com/o/HAWKFINDER%2Ffile-spotify-logo-png-4.png?alt=media&token=4ffa3420-edf1-4f8e-8ee4-8b1b7fc19093";

const spotifyPulled: boolean[] = [false, true, true];

function DisplaySong(
  song: {
    album: { images: { url: string | null }[]; name: string | null };
    name: string | null;
    artists: string | any[];
  },
  times?: number[]
) {
  return (
    <div
      style={{
        display: "block",
        border: "1px solid black",
        maxWidth: "400px",
        minWidth: "350px",
        padding: "10px",
        borderRadius: "25px",
      }}
    >
      <div className="songBox">
        <div style={{}}>
          <img
            src={
              song.album.images[1].url == null ? "" : song.album.images[1].url
            }
            style={{ width: "100px", height: "100px" }}
          />
        </div>
        <div className="songText">
          <p style={{ marginTop: "0px", lineHeight: "0px", fontSize: "20px" }}>
            <b>{song.name}</b>
          </p>
          <p
            style={{ paddingLeft: "15px", lineHeight: "0px", fontSize: "16px" }}
          >
            by{" "}
            {song.artists.length == 1
              ? song.artists[0].name
              : song.artists[0].name + " and others"}
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
        >
          <img
            src={spotifyLogo}
            style={{ height: "30px", width: "30px", margin: "20px" }}
          />
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

function DisplaySongSmall(
  song: {
    album: { images: { url: string | null }[]; name: string | null };
    name: string | null;
    artists: string | any[];
  },
  scrolling: boolean,
  times?: number[]
) {
  if (scrolling) {
    return (
      <marquee style={{ color: "black", fontSize: "1em" }}>
        Listening to: <b>{song.name}</b> by{" "}
        {song.artists.length == 1
          ? song.artists[0].name
          : song.artists[0].name + " and others"}
      </marquee>
    );
  } else {
    return (
      <div
        style={{
          lineHeight: "0%",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          marginRight: "15%",
        }}
      >
        <p>
          <b>{song.name}</b>
        </p>
        <p>
          by{" "}
          {song.artists.length == 1
            ? song.artists[0].name
            : song.artists[0].name + " and others"}
        </p>
      </div>
    );
  }
}

interface IProps {
  user: User;
  small: boolean;
  limit?: number;
}

interface IState {
  result?: null;
  time: Date;
}

class spotifyComponent extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { result: null, time: new Date() };
  }

  async makeRequest(user: User, request_uri: string, boolIndex: number) {
    console.log("making request");
    if (user.spotify.accessToken != "null") {
      await axios
        .get(api_uri + request_uri, {
          method: "GET",
          headers: { Authorization: `Bearer ${user.spotify.accessToken}` },
        })
        .then((response) => {
          if (response.data != "" && !spotifyPulled[boolIndex]) {
            spotifyPulled[boolIndex] = true;
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
              this.refreshToken(boolIndex);
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
  async refreshToken(boolIndex: number) {
    console.log("bad access token, refreshing");
    await axios
      .get("/api/spotify/refresh_token", {
        method: "GET",
        params: {
          refresh_token: this.props.user.spotify.refreshToken,
        },
      })
      .then((response) => {
        console.log("db access update");
        this.props.user.spotify.accessToken = response.data.access_token;
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
        spotifyPulled[boolIndex] = false;
        window.location.reload;
      });
  }
}

export default class CurrentSong extends spotifyComponent {
  constructor(props: IProps) {
    super(props);
  }

  componentDidMount() {
    this.setState({ time: new Date() });
    spotifyPulled[0] = false;
    setInterval(
      () => {
        this.setState({ time: new Date() });
        spotifyPulled[0] = false;
      },
      this.props.small ? 60000 : 3000
    );
  }

  render() {
    if (!spotifyPulled[0] && this.props.user !== undefined) {
      spotifyPulled[0] = true;
      this.makeRequest(this.props.user, "/me/player/currently-playing", 0);
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
        <div style={{ padding: "10px" }}>
          {!this.props.small ? (
            <div>
              <h3 style={{ fontSize: "12px" }}>Listening to on Spotify</h3>
              {DisplaySong(this.state.result.item, times)}
            </div>
          ) : (
            DisplaySongSmall(this.state.result.item, true, times)
          )}
        </div>
      );
    }
  }
}

export class TopSongs extends spotifyComponent {
  constructor(props: IProps) {
    super(props);
  }

  componentDidMount() {
    this.setState({ time: new Date() });
    spotifyPulled[1] = false;
    setInterval(() => {
      this.setState({ time: new Date() });
      spotifyPulled[1] = false;
    }, 60000);
  }

  render() {
    if (
      !spotifyPulled[1] &&
      this.state.result == null &&
      this.props.user !== undefined
    ) {
      this.makeRequest(this.props.user, "/me/top/tracks", 1);
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
          <ul style={{ paddingLeft: "5%" }}>
            {this.state.result.items
              .slice(-this.props.limit!)
              .map((song: any) => (
                <li key={song.id}>{DisplaySongSmall(song, false)}</li>
              ))}
          </ul>
        </div>
      );
    } else {
      return (
        <div>
          <h3>Top Songs</h3>
          {this.state.result.items
            .slice(-this.props.limit!)
            .map((song: any) => (
              <div key={song.id}>{DisplaySong(song)}</div>
            ))}
        </div>
      );
    }
  }
}

export class RecentSongs extends spotifyComponent {
  constructor(props: IProps) {
    super(props);
  }

  componentDidMount() {
    this.setState({ time: new Date() });
    spotifyPulled[2] = false;
    setInterval(() => {
      this.setState({ time: new Date() });
      spotifyPulled[2] = false;
    }, 60000);
  }

  render() {
    if (
      !spotifyPulled[1] &&
      this.state.result == null &&
      this.props.user !== undefined
    ) {
      spotifyPulled[1] = true;
      this.makeRequest(this.props.user, "/me/player/recently-played", 2);
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
            <h3>Recent Songs</h3>
            <ul style={{ paddingLeft: "5%" }}>
              {this.state.result.items.slice(-this.props.limit!).map((song) => (
                <li
                  key={
                    song.track.id + Math.floor(Math.random() * 3000).toString()
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
            <h3>Recent Songs</h3>
            {this.state.result.items
              .slice(-this.props.limit!)
              .map((song: any) => (
                <div
                  key={
                    song.track.id + Math.floor(Math.random() * 3000).toString()
                  }
                >
                  {DisplaySong(song.track)}
                </div>
              ))}
          </div>
        );
      }
    }
  }
}
