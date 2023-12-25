import { useState, useEffect } from "react";

import '../styles/WelcomePage.css'

import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'

function WelcomePage(props) {

    useEffect(() => {
        console.log("TeamManagement")
    }, []);

    return (
        <div className="WelcomePageWrapper">
            <h1 style={{margin: '0px'}}>Welcome To Joyn Software</h1>
        </div>
    )
}

export default WelcomePage