import React from "react";

/**
 * Uses the FireBase Auth hook to check if a user exists.
 * If a user is signed in, it will be true. Otherwise, false.
 * @param cUser Firebase User
 * @returns boolean
 */
function isUserLoggin(cUser : any) {
    if (cUser) {
        console.log("Signed in!");
        return true;
    }
    else {
        console.log("Not signed in!");
        return false;
    }
}
export default isUserLoggin;