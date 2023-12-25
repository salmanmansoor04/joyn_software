import { useState, useEffect } from "react";

import '../styles/AdminPanel.css'

import { Outlet, useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'

function AdminHome(props) {

    const location = useLocation();

    useEffect(() => {

    }, []);

    return (
        <div className="TeamManagementWrapper">
            <div className="TeamManagementSideBar">
                <div className={`home_sidebar_item ${location.pathname === '/home' ? "activeComponent" : ""}`} style={{ cursor: 'pointer', padding: '5px', height: '40px', display: 'flex', alignItems: 'center' }}>
                    <Link className='link' to="/home"> User Management </Link>
                </div>
                <div className={`home_sidebar_item ${location.pathname === '/home/features' ? "activeComponent" : ""}`} style={{ cursor: 'pointer', padding: '5px', height: '40px', display: 'flex', alignItems: 'center' }}>
                    <Link className='link' to="/home/features"> Feature Configuration </Link>
                </div>
            </div>
            <div className="TeamManagementOutlet">
                <Outlet />
            </div>
        </div>
    )
}

export default AdminHome