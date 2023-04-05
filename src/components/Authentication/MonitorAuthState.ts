import { onAuthStateChanged } from "@firebase/auth";
import { auth } from "../../firebase/config";

async function checkAuthState() {
    
    onAuthStateChanged(auth, user => {
        if (user) {
            console.log("Signed in!")
            console.log(user)
            return true;
        }
        else {
            console.log("Not signed in!")
            return false;
        }
    })
}
export default checkAuthState;