import React from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
function InterceptorScreen(){
    const navigate = useNavigate();
    return(
    <h1>
        You are not currently signed in! <Link to="/components/Login">Go to login</ Link>
    </h1>
    )
}
export default InterceptorScreen;