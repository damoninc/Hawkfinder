import React from 'react';
import "./FriendBox.css"
import Profile from '../Profile';

type FriendBoxProps = {
    friend: Profile
}

function FriendBox(friend : Profile) { 
    let imgPath : string = "src/assets/images/" + friend.profilePicture;    // database call to grab image

    let interests : string = friend.interests[0];
    for(let i=1; i<friend.interests.length; i++){
        if (interests.length > 25) {
            interests += "...";
            break;
        }
        interests += ", " + friend.interests[i];
    }
    return (
        <div className="container">
                <div className='propic'>
                    <img src={imgPath} width="100" height="100"></img>
                </div>
                <div className="content">
                    <h3> {friend.firstName} {friend.lastName} </h3>
                    <p>{interests}</p>
                </div>   
                <div className="buttons">
                    <form action="/Messages">
                        <button className="button">Messages</button>
                    </form>   
                    <form action="/Profile">
                        <button className="button">Profile</button>
                    </form>                  
                    <button className='button' type="button">Remove</button>
            </div>                                    
        </div>
    )
}
export default FriendBox;