import React from 'react';
import User from '../User';
import Profile from '../Profile';
import './FriendPage.css';
import FriendBox from './FriendBox';
import { sampleProfiles } from '../Profile';

const userProfiles: Array<Profile> = [
  new Profile("Damon","Incorvaia","dwi2359",
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
  ),
  new Profile("Octavio","Galindo","og2828",
    "My name is Octavio Galindo and I am a man of culture.",
    ["Predatory Mobile Gaming", "Stale Bread", "Paint Chips", "Esoteric Art"],
    "profileimg.jpg",
    "coverphoto2.jpg",
    new Date(1999, 12, 20)
  ),
  new Profile("Octavio","Galindo","og2828",
  "My name is Octavio Galindo and I am a man of culture.",
  ["Stale Bread", "Paint Chips", "Esoteric Art"],
  "profileimg.jpg",
  "coverphoto2.jpg",
  new Date(1999, 12, 20)
  ),
  new Profile("Octavio","Galindo","og2828",
  "My name is Octavio Galindo and I am a man of culture.",
  ["Paint Chips", "Esoteric Art"],
  "profileimg.jpg",
  "coverphoto2.jpg",
  new Date(1999, 12, 20)
  ),
  new Profile("Octavio","Galindo","og2828",
  "My name is Octavio Galindo and I am a man of culture.",
  ["Esoteric Art"],
  "profileimg.jpg",
  "coverphoto2.jpg",
  new Date(1999, 12, 20)
  ),
];

function FriendPage() {
  const dbCall : Array<Profile> = sampleProfiles // grab user friend's profiles using database call
  return (
    <div className='friendPage'>
        <h1>Friends List</h1>
        {checkNullList(dbCall)}
    </div>
    )
}

function checkNullList(friends : Profile[]) {
  if (friends.length == 0) {
    return (
          <div>
              <h2>No Friends Found :(</h2>
          </div>
    )
  } else {
    return (
          <div className='friendBlock'>
              {friends.map((friend) => 
                <div className='friends'>{FriendBox(friend)}</div>
              )}
          </div>
    )
  }
}


export default FriendPage