import React from 'react';
import { FriendBox } from './FriendBox';
import User from '../User';

const testUsers: Array<User> = [
  new User("og2828@uncw.edu", "gamertime"),
  new User("pio1681@uncw.edu", "siuuuuuuuu"),
  new User("dwi2359@uncw.edu", "Grugley da master ;)"),
  new User("rajebj@uncw.edu", "suppa hot FIYA")
];

function FriendPage() {
  return (
    <div className='friendPage'>
        <div>
            {testUsers.map((friend) => 
                <div>{<FriendBox friend={friend}/>}</div>
            )}
        </div>
    </div>
  )
}

function FriendList(friends : User[]) {
    friends.map((friend) => <li>{<FriendBox friend={friend}/>}</li>)
}

export default FriendPage
