import { useState, useEffect } from "react";

import '../styles/AdminPanel.css'

import { Outlet, useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'

function AdminPanel(props) {

    const location = useLocation();

    useEffect(() => {
        //console.log("TeamManagement")
    }, []);

    return (
        <div className="TeamManagementWrapper">
            <div className="TeamManagementSideBar">
                <div><Link to='/home'><i className="fa fa-arrow-left" title="back" style={{ cursor: 'pointer', color: 'black' }}></i></Link></div>
                <div className={`home_sidebar_item ${location.pathname === '/adminPanel' ? "activeComponent" : ""}`} style={{ cursor: 'pointer', padding: '5px', height: '40px', display: 'flex', alignItems: 'center' }}>
                    <Link className='link' to="/adminPanel"> Project Entry </Link>
                </div>
                <div className={`home_sidebar_item ${location.pathname === '/adminPanel/projecttables' ? "activeComponent" : ""}`} style={{ cursor: 'pointer', padding: '5px', height: '40px', display: 'flex', alignItems: 'center' }}>
                    <Link className='link' to="/adminPanel/projecttables"> Project Tables </Link>
                </div>
                {/* <div className={`home_sidebar_item ${location.pathname === '/adminPanel/formConfig' ? "activeComponent" : ""}`} style={{ cursor: 'pointer', padding: '5px', height: '40px', display: 'flex', alignItems: 'center' }}>
                    <Link className='link' to="/adminPanel/formConfig"> Form Config </Link>
                </div> */}
                {localStorage.getItem('cust_id') === '2' &&
                    <>
                        <div className={`home_sidebar_item ${location.pathname === '/adminPanel/otdrconfig' ? "activeComponent" : ""}`} style={{ cursor: 'pointer', padding: '5px', height: '40px', display: 'flex', alignItems: 'center' }}>
                            <Link className='link' to="/adminPanel/otdrconfig"> Otdr Results </Link>
                        </div>
                        <div className={`home_sidebar_item ${location.pathname === '/adminPanel/rowconfig' ? "activeComponent" : ""}`} style={{ cursor: 'pointer', padding: '5px', height: '40px', display: 'flex', alignItems: 'center' }}>
                            <Link className='link' to="/adminPanel/rowconfig"> Right Of Way </Link>
                        </div>
                    </>
                }
                {/* <div className='home_sidebar_item' style={{ cursor: 'pointer', padding: '5px', height: '40px', display: 'flex', alignItems: 'center'}}>
                    <Link className='link' to="/teamManagement/taskCreation"> Users </Link>
                </div> */}
            </div>
            <div className="TeamManagementOutlet">
                <Outlet />
            </div>
        </div>
    )
}

export default AdminPanel