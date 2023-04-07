import React, { useEffect, useState } from "react";
import User from "../../data/User";
import axios from "axios";
import "../../styles/spotify.css";
import { LinearProgress } from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

const api_uri = "https://api.spotify.com/v1";
const spotifyLogo =
  "https://firebasestorage.googleapis.com/v0/b/csc-450-project.appspot.com/o/HAWKFINDER%2Ffile-spotify-logo-png-4.png?alt=media&token=4ffa3420-edf1-4f8e-8ee4-8b1b7fc19093";

export const spotifyPulled: boolean[] = [false, false];

async function makeRequest(
  user: User,
  setResult: any,
  request_uri: string,
  boolIndex: number
) {
  await axios
    .get(api_uri + request_uri, {
      method: "GET",
      headers: { Authorization: `Bearer ${user.spotify.accessToken}` },
    })
    .then((response) => {
      if (response.data != "" && !spotifyPulled[boolIndex]) {
        setResult(response.data);

        spotifyPulled[boolIndex] = true;
      }
    })
    .catch(function (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
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

function DisplaySong(
  song: {
    album: { images: { url: string | null }[]; name: string | null };
    name: string | null;
    artists: string | any[];
  },
  times?: number[]
) {
  return (
    <div style={{ display: "block" }}>
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
          <h3 style={{ marginTop: "0px", lineHeight: "0px" }}>{song.name}</h3>
          <p style={{ paddingLeft: "15px", lineHeight: "0px" }}>
            by{" "}
            {song.artists.length == 1
              ? song.artists[0].name
              : song.artists[0].name + " and others"}
          </p>
          <p style={{ paddingLeft: "15px", lineHeight: "0px" }}>
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
        <div style={{ display: "flex", flexDirection: "row" }}>
          <p style={{ fontSize: "16px" }}>
            {`0${Math.floor((times[0] / 1000 / 60) << 0)}`.slice(-2)}:
            {`0${Math.floor((times[0] / 1000) % 60)}`.slice(-2)}
          </p>
          <LinearProgress
            value={(times[0] / times[1]) * 100}
            variant="determinate"
            style={{ width: "100%", marginRight: "4px", marginLeft: "4px" }}
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
  times?: number[]
) {
  return (
    <marquee style={{ color: "black", fontSize: "1em" }}>
      Listening to: <b>{song.name}</b> by{" "}
      {song.artists.length == 1
        ? song.artists[0].name
        : song.artists[0].name + " and others"}
    </marquee>
  );
}

interface IProps {
  user: User;
  small: boolean;
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
    await axios
      .get(api_uri + request_uri, {
        method: "GET",
        headers: { Authorization: `Bearer ${user.spotify.accessToken}` },
      })
      .then((response) => {
        if (response.data != "" && !spotifyPulled[boolIndex]) {
          spotifyPulled[boolIndex] = true;
          console.log(response.data);
        }
        this.setState({ result: response.data });
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          console.log("bad refresh token, clearing");
          axios
            .get("/api/spotify/refresh_token", {
              method: "GET",
              headers: {
                Authorization: `Bearer ${user.spotify.refreshToken}`,
              },
            })
            .then((response) => {
              console.log("db access update");
              user.spotify.accessToken = response.data.access_token;
              updateDoc(
                doc(db, "Users", user.userid),
                "spotifyTokens.accessToken",
                user.spotify.accessToken
              );
              console.log("db refresh update");

              spotifyPulled[boolIndex] = true;
            });
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

export default class CurrentSong extends spotifyComponent {
  constructor(props: IProps) {
    super(props);
  }

  componentDidMount() {
    setInterval(
      () => {
        this.setState({ time: new Date() });
        spotifyPulled[0] = false;
      },
      this.props.small ? 60000 : 20000
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
          {!this.props.small
            ? DisplaySong(this.state.result.item, times)
            : DisplaySongSmall(this.state.result.item, times)}
        </div>
      );
    }
  }
}

export function CurrentSongFunc(user: User, small: boolean) {
  const [result, setCurrSongs] = useState(null);
  const [time, setTime] = useState(new Date());

  setInterval(() => {
    setTime(new Date());
    spotifyPulled[0] = false;
  }, 10000);

  if (!spotifyPulled[0] && user !== undefined) {
    makeRequest(user, setCurrSongs, "/me/player/currently-playing", 0);
  }
  if (result == null) {
    return <div></div>;
  } else {
    if (result.item == null) {
      return <div></div>;
    }
    const times: number[] = [result.progress_ms, result.item.duration_ms];

    return (
      <div style={{ padding: "10px" }}>
        <h3>Listening To On Spotify</h3>
        {!small
          ? DisplaySong(result.item, times)
          : DisplaySongSmall(result.item, times)}
        <h1> </h1>
        <h2>Current Song but small</h2>
        <h3>Listening To On Spotify</h3>
        {DisplaySongSmall(result.item, times)}
      </div>
    );
  }
}

export function TopSongs(user: User, totalSongs: number) {
  const [result, setTopSongs] = useState(null);
  if (!spotifyPulled[1] && result == null && user !== undefined) {
    makeRequest(user, setTopSongs, "/me/top/tracks", 1);
  }
  if (result == null) {
    return <div></div>;
  } else {
    if (result.items == null) {
      return <div></div>;
    }
    return (
      <div>
        <h3>Top Songs</h3>
        {result.items.slice(-totalSongs).map((song) => (
          <div key={song.id}>{DisplaySong(song)}</div>
        ))}
      </div>
    );
  }
}

export function RecentSongs(user: User, totalSongs: number) {
  const [result, setRecentSongs] = useState(null);
  if (!spotifyPulled[2] && result == null && user !== undefined) {
    makeRequest(user, setRecentSongs, "/me/player/recently-played", 2);
  }
  if (result == null) {
    return <div></div>;
  } else {
    if (result.items == null) {
      return <div></div>;
    }
    return (
      <div>
        <h3>Recent Songs</h3>
        {result.items.slice(-totalSongs).map((song) => (
          <div
            key={song.track.id + Math.floor(Math.random() * 3000).toString()}
          >
            {DisplaySong(song.track)}
          </div>
        ))}
      </div>
    );
  }
}
