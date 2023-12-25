import { useState, useEffect } from "react";

import '../styles/TeamManagement.css'

import { Outlet, useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'

function TeamManagement(props) {

    const location = useLocation();

    useEffect(() => {
        console.log("TeamManagement")
    }, []);

    return (
        <div className="TeamManagementWrapper">
            <div className="TeamManagementSideBar">
                <div style={{ height: '50px', display: 'flex', alignItems: 'center', paddingLeft: '15px', fontSize: '15px' }}><Link to='/home'><i className="fa fa-home" title="back" style={{ cursor: 'pointer', color: 'black', fontSize: '20px' }}></i></Link></div>
                <div className={`home_sidebar_item ${location.pathname === '/teamManagement' ? "activeComponent" : ""}`} style={{ cursor: 'pointer', height: '40px', display: 'flex', alignItems: 'center' }}>
                    <Link className='link' to="/teamManagement"> <i style={{ marginRight: '15px' }} className="fa fa-users" aria-hidden="true"></i>Team Creation </Link>
                </div>
                <div className={`home_sidebar_item ${location.pathname === '/teamManagement/taskCreation' ? "activeComponent" : ""}`} style={{ cursor: 'pointer', height: '40px', display: 'flex', alignItems: 'center' }}>
                    <Link className='link' to="/teamManagement/taskCreation"> <i style={{ marginRight: '15px' }} class="fa fa-tasks" aria-hidden="true"></i>Task Assignment </Link>
                </div>
                {JSON.parse(localStorage.getItem('features')).some((val) => { return val.id === 2 }) &&
                    <div className={`home_sidebar_item ${location.pathname === '/teamManagement/journeyPlan' ? "activeComponent" : ""}`} style={{ cursor: 'pointer', height: '40px', display: 'flex', alignItems: 'center' }}>
                        <Link className='link' to="/teamManagement/journeyPlan"> <i style={{ marginRight: '15px' }} class="fa fa-map-signs" aria-hidden="true"></i>Journey Plan </Link>
                    </div>
                }
            </div>
            <div className="TeamManagementOutlet">
                <Outlet />
            </div>
        </div>
    )
}

export default TeamManagement