import React from "react";
function isUserLoggin(cUser : any) {
    if (cUser) {
        console.log("Sign in, here's the sauce " + cUser);
        return true;
    }
    else {
        console.log("Not signed in!");
        return false;
    }
}
export default isUserLoggin;