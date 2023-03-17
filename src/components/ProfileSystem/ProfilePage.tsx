import React from "react";
import Profile from "../Profile";
import "../../styles/Profile.css";
const testProfile = new Profile(
  "Damon",
  "Incorvaia",
  "dwi2359",
  "Hello, my name is Damon Incorvaia. I am currently a Senior studying Computer Science! Other things about me: I am a musician of 12 years, I am a car enthusiast and I thorughly enjoy videogames and technology",
  [
    "Music",
    "Videogames",
    "Cars",
    "Computers",
    "Technology",
    "Drums",
    "Bass",
    "Guitar",
  ],
  "profileimg.jpg",
  "coverphoto.jpg",
  new Date(2000, 6, 17)
);

function ProfilePage() {
  return (
    <div className="container">
      <div className="banner">
        <span className="hawkfinder">Hawkfinder</span>
      </div>
      <div className="profile-info">
        <img
          src={"src/assets/images/" + testProfile.coverPhoto}
          alt="image"
          className="cover-photo"
        />
        <span className="profile-name">
          <span>{testProfile.firstName + " " + testProfile.lastName}</span>
          <br></br>
        </span>
        <img
          src={"src/assets/images/" + testProfile.profilePicture}
          alt="image"
          loading="lazy"
          className="profile-photo"
        />
      </div>
      <div className="about">
        <span className="about-title">
          <span>About Me</span>
          <br></br>
          <p>{testProfile.bio}</p> {/* INSERT BIO */}
        </span>
      </div>
      <div className="interests">
        <span className="text4">
          <span>My Interests</span>
          <br></br>
        </span>
        <ul className="list">
          {testProfile.interests.map((interest) => (
            <li key={interest}>{interest}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
export default ProfilePage;
