import "./App.css"
import LoginScreen from "./components/authentification_system/LoginScreen"
import SignUpScreen from "./components/authentification_system/SignUpScreen"
import FriendPage from "./components/FriendSystem/FriendPage"

function App() {

  return (
    <div className='app'>
      <h1>Hi :)</h1>
      <FriendPage />
      <LoginScreen />
      <SignUpScreen />
    </div>
  )
}

export default App
