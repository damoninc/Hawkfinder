import React from "react";
import "../../styles/userbox.css";
import User from "../../data/User";
import { Stack } from "@mui/material";

/**
 * Generates a HTML block that displays a user based on their Profile information
 *      Currently displays the name and interests as well as having buttons to go to
 *      their profile, messages, and removing them.
 * @param {User} displayUser - The user to display
 * @param {(arg0: User) => JSX.Element)} buttons - the buttons to display on side of the user box
 * @return {*} - UserBox HTML
 */
export default function UserBox(
  displayUser: User,
  buttons: (arg0: User) => JSX.Element
) {
  if (displayUser === undefined) {
    return <div></div>;
  }
  // need to update to get actual profile image
  const imgPath: string =
    "/src/assets/images/" + displayUser.profile.profilePicture; // database call to grab image

  // Generating string of interests, cutting off after ~25 characters
  let interests: string = displayUser.profile.interests[0];
  for (let i = 1; i < displayUser.profile.interests.length; i++) {
    if (interests.length + displayUser.profile.interests[i].length > 25) {
      interests += "...";
      break;
    }
    interests += ", " + displayUser.profile.interests[i];
  }

  return (
    <div className="usercontainer">
      <div className="propic">
        <img src={imgPath} width="100" height="100"></img>
      </div>
      <div className="bigContent">
        <Stack alignItems="left" spacing={1} style={{ lineHeight: "12px" }}>
          <h3>
            {displayUser.profile.firstName} {displayUser.profile.lastName}
          </h3>
          <p>{interests}</p>
        </Stack>
      </div>
      <div className="smallContent">
        <h3>
          {displayUser.profile.firstName} {displayUser.profile.lastName}{" "}
        </h3>
      </div>
      <div>{buttons(displayUser)}</div>
    </div>
  );
}
