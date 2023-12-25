import { useState, useEffect } from "react";

import '../styles/FormConfig.css'

import { Outlet, useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'

function FormConfig(props) {

    const location = useLocation();

    useEffect(() => {
        init();
    }, []);

    const init = () => {
        console.log('Form Config Init')
    }

    return (
        <div className="FormConfig_wrapper">
            
        </div>
    )
}

export default FormConfig