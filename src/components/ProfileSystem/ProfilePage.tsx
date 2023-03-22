import React from "react";
import User from "../../data/User";
import "../../styles/Profile.css";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { auth } from "../../App";
import { db } from "../../App";
import Navbar from "../Navbar/Navbar";
/**
 * Firebase implementation is required for all
 *
 * This will be changed later to check for authentication and so on.
 */

const docRef = doc(db, "Users", "sq0kklKJQLYTuFQ6IQf6fzxi4Iu1");
const docSnap = await getDoc(docRef);

function getUser() {
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    return docSnap.data();
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
}

const user = getUser();

function ProfilePage() {
  return (
    <>
      <Navbar />
      <div className="profile-info">
          <img
            src={"src/assets/images/coverphoto.jpg"}
            alt="image"
            className="cover-photo"
          />
        <span className="profile-name">
          <span>{user?.profile.firstName + " " + user?.profile.lastName}</span>
          <br></br>
        </span>
        <span className="friend-count">
          <span>{user?.friendsList.length + " Friends"}</span>
          <br />
        </span>
        <img
          src={"src/assets/images/profileimg.jpg"}
          alt="image"
          loading="lazy"
          className="profile-photo"
        />
      </div>
      <div className="about">
        <span className="about-title">
          <span>About Me</span>
          <br></br>
          <p>{user?.profile.bio}</p> {/* INSERT BIO */}
        </span>
      </div>
      <div className="interests">
        <span className="text4">
          <span>My Interests</span>
          <br></br>
        </span>
        <ul className="list">
          {user?.profile.interests.map((interest: any) => (
            <li key={interest}>{interest}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
export default ProfilePage;
