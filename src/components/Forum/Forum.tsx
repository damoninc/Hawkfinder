import { useState } from 'react';
import '../../styles/Forum.css';

function Forum(props: any) {
    const [ratings, setRatings] = useState(props.rating)
    const [upvoted, setUpvoted] = useState(false)
    const [downvoted, setDownvoted] = useState(false)

    const upvote = () => {
        if (!upvoted) {
            setRatings(ratings + 1)
            setUpvoted(true)
        } else {
            setRatings(ratings-1)
            setUpvoted(false)
        }
    }

    const downvote = () => {
        if (!downvoted) {
            setRatings(ratings - 1)
            setDownvoted(true)
        } else {
            setRatings(ratings + 1)
            setDownvoted(false)
        }
    }

    let postImgPath =  `/src/assets/images/${props.imageURL}`

    // let rating = upvotes - downvotes

    return (
        // Data passed in from props
        /* {props._postID}
        {props._postDate.toString}
        {props._description}
        {props._interest}
        {props._imageURL}
        {props._ratings} */
        <div className="post-container">
            <div className="pic-crop">
                <img className="profile-pic" src="\src\assets\images\profileimg.jpg" />
            </div>
            <div className="post-img-container">
                <img className="post-img" src={postImgPath} />
            </div>
            <p className="post-description">
                {props.description}
            </p>
            <h4>
            {props.ratings.length}
            </h4>
            <div className="ratings">
                <button onClick={upvote}>
                    Upvote
                </button>
                <span>{ratings}</span>
                <button onClick={downvote}>
                    Downvote
                </button>
            </div>
            <span className='post-interest'>
                {props.interest}
            </span>
        </div>
    )
}

export default Forum;