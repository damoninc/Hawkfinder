import React from "react";
import Profile from "../../data/Profile";
import User from "../../data/User";
import "../../styles/Profile.css";
const testProfile = new User(
  "dwi2359@uncw.edu",
  "strongpassword",
  "Skarrow",
  "9"
);
testProfile.profile.bio = "Hey guys skarrow9 here";
testProfile.profile.interests = ["destiny2", "ur mom"];
testProfile.profile.profilePicture =
  "https://pbs.twimg.com/media/EPK5mPuWoAAELqI.jpg";
testProfile.profile.coverPhoto =
  "https://cdn.discordapp.com/attachments/598723135608586250/1086147225492672624/CrhFKYpgaXntNcM-800x450-noPad.png";

/**
 * Firebase implementation is required for all
 *
 */

function ProfilePage() {
  return (
    <div className="container">
      <div className="banner">
        <span className="hawkfinder">Hawkfinder</span>
      </div>
      <div className="profile-info">
        <img
          src={testProfile.profile.coverPhoto}
          alt="image"
          className="cover-photo"
        />
        <span className="profile-name">
          <span>
            {testProfile.profile.firstName + " " + testProfile.profile.lastName}
          </span>
          <br></br>
        </span>
        <img
          src={testProfile.profile.profilePicture}
          alt="image"
          loading="lazy"
          className="profile-photo"
        />
      </div>
      <div className="about">
        <span className="about-title">
          <span>About Me</span>
          <br></br>
          <p>{testProfile.profile.bio}</p> {/* INSERT BIO */}
        </span>
      </div>
      <div className="interests">
        <span className="text4">
          <span>My Interests</span>
          <br></br>
        </span>
        <ul className="list">
          {testProfile.profile.interests.map((interest) => (
            <li key={interest}>{interest}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
export default ProfilePage;
