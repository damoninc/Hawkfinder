import { User } from "@firebase/auth";
import React from "react";
export let signinUID = "";
function isUserLoggin(cUser : any) {
    if (cUser) {
        console.log("Sign in, here's the sauce " + cUser.uid);
        signinUID = cUser.uid;
        return true;
    }
    else {
        console.log("Not signed in!");
        return false;
    }
}
export default isUserLoggin;