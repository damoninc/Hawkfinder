import React from 'react';
import User from '../User';
import "./FriendBox.css"


type FriendBoxProps = {
    friend: User
}

export const FriendBox = ({friend}: FriendBoxProps) => 
<div className="container">

        <div className="content">
            <h2> {friend.username} </h2>
            <p>
                {friend.email} and {friend.password}
            </p> 
        </div>   
        <div className="buttons">
            <button className='button' type="button">Message</button>
            <button className='button' type="button">Profile</button>
            <button className='button' type="button">Remove</button>
    </div>                                    
</div>
