import Forum from "./components/Forum/Forum"
import PostView from "./components/Post/PostView";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import "./App.css"
import { SAMPLE_POSTS } from "./components/Post";

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
