import Profile from '../Profile';
import './FriendPage.css';
import FriendBox from './FriendBox';
import { sampleProfiles } from '../Profile';

/**
 * Generates a HTML block that displays a user's friend list by creating
 *    a FriendBox for each friend in their friend list.
 * Shows all friends or a "no friends" message is applicable. 
 *
 * @return {*} - FriendPage HTML
 */
function FriendPage() {
  // FriendPage component which displays a friends list based on the currently active user
  //
  // returns: HTML for displaying the users insides of the current user's friend's list.
  //          If the user does not have any friends, it returns an empty list.

  const dbCall : Array<Profile> = sampleProfiles // grab user friend's profiles using database call

  return (
    <div className='friendPage'>
        <h1>Friends List</h1> 
        <div>
          <input type="text" placeholder="Username" />
          <button type="button" onClick={addFriend}>Remove</button>
        </div>
        {checkNullList(dbCall)}
    </div>
    )
}

function checkNullList(friends : Profile[]) {
  // Returns a list of FriendBox if the user's friends list is not empty
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

function addFriend() {
  // dummy function for adding a friend, no friend information is transfered
  alert('Adding Friend')
}

export default FriendPage