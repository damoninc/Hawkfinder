import Profile, { sampleProfiles } from '../../data/Profile';
import '../../styles/friendbox.css';
import FriendBox from './FriendBox';
import { testUsers } from '../../data/User';
import SearchForm from './SearchForm';

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