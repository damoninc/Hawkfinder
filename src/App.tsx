import "./App.css"
import LoginScreen from "./components/authentification_system/LoginScreen"
import SignUpScreen from "./components/authentification_system/SignUpScreen"

function App() {

  return (
    <div className='app'>
      <LoginScreen />
      <SignUpScreen />
    </div>
  )
}

export default App
