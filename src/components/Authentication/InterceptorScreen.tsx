import React from "react";
import { Link } from "react-router-dom";
import "../../styles/centeritems.css"

/**
 * If a user somehow is able to get to any of the components without logging in,
 * they'll be redirected to the interceptor screen.
 * @returns The Interceptor Screen.
 */
function InterceptorScreen(){
    return(
    <h1 className="centered">
        You are not currently signed in! <Link to="/">Go to login</ Link>
    </h1>
    )
}
export default InterceptorScreen;