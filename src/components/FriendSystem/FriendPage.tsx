import React from 'react';
import { FriendBox } from './FriendBox';
import User from '../User';
import './FriendPage.css'

const testUsers: Array<User> = [
  new User("og2828@uncw.edu", "gamertime"),
  new User("pio1681@uncw.edu", "siuuuuuuuu"),
  new User("dwi2359@uncw.edu", "Grugley da master ;)"),
  new User("rajebj@uncw.edu", "suppa hot FIYA"),
  new User("njb4775@uncw,edu", "password"),
  new User("jag1452@uncw.edu", "Abc123"),
  new User("nam3261@uncw.edu", "heyHowsitgoing")
];

function FriendPage() {
  if (testUsers.length == 0) {
    return (
      <div className='friendPage'>
          <h1>Friends List</h1>
          <div>
              <h3>No Friends Found :(</h3>
          </div>
      </div>
    )
  } else {
    return (
      <div className='friendPage'>
          <h1>Friends List</h1>
          <div className='friendBlock'>
              {testUsers.map((friend) => 
                <div className='friends'>{<FriendBox friend={friend}/>}</div>
              )}
          </div>
      </div>
    )
  }
}

export default FriendPage