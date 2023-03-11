import "./App.css";
import LogAndSign from "./components/authentification_system/LogAndSign";
import FriendPage from "./components/FriendSystem/FriendPage";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/"> Login and Signup </Link>
          </li>
          <li>
            <Link to="/friendpage"> FriendPage </Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<LogAndSign />} />
        <Route path="/friendpage" element={<FriendPage />} />
      </Routes>
    </Router>
  );
}

export default App;
