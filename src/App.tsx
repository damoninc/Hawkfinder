import Forum from "./components/Forum/Forum"
import PostView from "./components/Post/PostView";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import "./App.css"
import Post from "./components/Post";

let SAMPLE_POSTS: Post[] = [
  new Post(
      "0b0koxs", 
      new Date(2023, 0, 16, 10, 0), 
      "i heckin love this song!!!!!", 
      "music",
      "dog.jpg", 
      new Map<string, string>([
          ["39kvfsb", "upvote"],
          ["b929kcs", "downvote"]
      ])
  ),
  new Post(
      "8fSD8930bFg", 
      new Date(2023, 1, 15, 10, 0), 
      "can i get uhhhhhhhh 2 fries",
      "food",
      "profileimg.jpg",
      new Map<string, string>([
          ["z0l2pvd", "downvote"],
      ])
  ),
  new Post(
      "8fSD8930bFg", 
      new Date(2023, 1, 27, 10, 0), 
      "hypergrindcore death grunge ambient experimental prog art country",
      "music",
      "coverphoto.jpg", 
      new Map<string, string>([
          ["39kvfsb", "upvote"],
          ["b929kcs", "upvote"],
          ["z0l2pvd", "upvote"],
      ])
  ),
];

const posts = SAMPLE_POSTS.map((post) => {
  let json: string = JSON.stringify(post)
  let postJSON = JSON.parse(json)
  console.log(postJSON)
  return <Forum
    // key={postJSON._postID}
    // {...postJSON}
    postID={post.postID}
    postDate={post.postDate}
    description={post.description}
    interest={post.interest}
    imageURL={post.imageURL}
    ratings={post.ratings}
    rating={post.calculateRating()}
  />
})

function App() {

  return (
    <div className='app'>
      <h3>All the pages we are working on</h3>
      <h3>John</h3>
      <Router>
        <ul>
          <li>
            <Link to="/components/Forum">Forum</Link>
          </li>
          <li>
            <Link to="/components/Post">Post</Link>
          </li>
        </ul>
        <Routes>
          <Route path="/components/Forum" element={posts} />
          <Route path="/components/Post" element={<PostView />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
