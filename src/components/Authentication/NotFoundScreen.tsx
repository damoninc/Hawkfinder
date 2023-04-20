import React from "react";
import { Link } from "react-router-dom";
import "../../styles/centeritems.css"

/**
 * If a user routes to a page which doesn't exist, they'll get this screen
 * @returns 404 Error Screen.
 */
function NotFound(){
    return(
    <h1 className="centered">
        404 Error: Page not found <Link to="/">Go Back</ Link>
    </h1>
    )
}
export default NotFound;