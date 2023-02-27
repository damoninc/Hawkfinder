import React from 'react';
import User from '../User';

type FriendBoxProps = {
    friend: User
}

export const FriendBox = ({friend}: FriendBoxProps) => <aside>
    <h2> {friend.username} </h2>
    <p>
        {friend.email} and {friend.password}
    </p>                                                    
</aside>
