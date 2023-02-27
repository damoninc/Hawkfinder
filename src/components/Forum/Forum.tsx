import Post from '../Post';
import Posts from '../Post/Post'

let SAMPLE_POSTS: Post[] = [
    new Post(
        "0b0koxs", 
        new Date(2023, 2, 16, 10, 0), 
        "i heckin love this song!!!!!", 
        "music",
        "img1.jpg", 
        new Map<string, string>([
            ["39kvfsb", "like"],
            ["b929kcs", "dislike"]
        ])
    ),
    new Post(
        "8fSD8930bFg", 
        new Date(2023, 2, 16, 10, 0), 
        "can i get uhhhhhhhh 2 fries",
        "food",
        "",
        new Map<string, string>([
            ["z0l2pvd", "dislike"],
        ])
    ),
    new Post(
        "8fSD8930bFg", 
        new Date(2023, 2, 16, 10, 0), 
        "hypergrindcore death grunge ambient experimental prog art country",
        "music",
        "", 
        new Map<string, string>([
            ["39kvfsb", "like"],
            ["b929kcs", "like"],
            ["z0l2pvd", "like"],
        ])
    ),
];

function Forum() {
    // Will change 'any' to its appropriate type later
    // npm install --save @types/react-helmet
    const posts: any = SAMPLE_POSTS.map((post) => {
        <Posts 
            {...post}
        />
    })

    return (
        <div className='main-forum'>
            {posts}
        </div>
    )
}

export default Forum;