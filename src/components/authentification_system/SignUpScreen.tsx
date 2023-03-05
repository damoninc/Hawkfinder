import { useState } from "react";
import './LoginScreen.css'

// function SignUpScreen() {
//     const [usernameInput, setUsernameInput] = useState("");
//     const [passwordInput, setPasswordInput] = useState("");
//     const [firstnameInput, setFirstName]

  
//     return (
//       <div className="backboard">
//         <fieldset className="loginSquare">
//           <h1>Login</h1>
//           <h1>
//             <label>
//               Username
//               <input
//                 name="nameTyped"
//                 id="name"
//                 type="text"
//                 placeholder="Write your name"
//                 required
//                 onChange={(namewrote) => setUsernameInput(namewrote.target.value)}
//               />
//             </label>
//           </h1>
//           <h1>
//             <label>
//               Password{" "}
//               <input
//                 name="passTyped"
//                 id="password"
//                 type="text"
//                 placeholder="Write your password"
//                 required
//                 onChange={(passwrote) => setPasswordInput(passwrote.target.value)}
//               />
//             </label>
//           </h1>
//           <button type="submit" onClick={checkExist}>
//             Login
//           </button>
//         </fieldset>
//       </div>
//     );
//   }
//   export default LoginScreen;