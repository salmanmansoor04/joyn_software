import React from 'react'

import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'

import Axios from 'axios';

import '../../node_modules/font-awesome/css/font-awesome.min.css';

import '../styles/home.css'

class Home extends React.Component {

    state = {

        auditShown: false,
        projectShown: true,
        active: false,
        projectActive: false,

        file: ''
    }

    // changeHandler = (event) => {
    // 	this.setState({file: event.target.files[0]})
    // };

    ProjectsClicked = () => {

        this.setState({ projectShown: !this.state.projectShown })
    }

    // handleSubmission = () => {
    //     console.log(this.state.file)
    //     var bodyFormData = new FormData();

    //     bodyFormData.append('myfile', this.state.file); 

    //     Axios({
    //         method: "post",
    //         url: "http://192.168.18.60:8001/otdr-scrapper/",
    //         data: bodyFormData,
    //         headers: { "Content-Type": "multipart/form-data" },
    //       })
    //         .then(function (response) {
    //           //handle success
    //           console.log(response.data);
    //         })
    //         .catch(function (error) {
    //           //handle error
    //           console.log(error);
    //         });

    // }

    render() {

        return (

            <div className='home_wrapper'>
                <div className='home_sideMenu'>
                    {localStorage.getItem('cust_id') === '2' &&
                        <>
                            <div className='home_sidebar_item' onClick={() => this.ProjectsClicked()} style={{ cursor: 'pointer', padding: '5px', height: '40px', display: 'flex', alignItems: 'center' }}>
                                Project <i style={{ fontWeight: 'bold', marginLeft: '5px' }} className="fa fa-angle-down"></i>
                            </div>
                            {this.state.projectShown &&
                                <div style={{ marginLeft: '10px' }}>
                                    <div className={`home_sidebar_item ${this.props.pathname === 'https://joynsoftware.com/#/home' ? "activeComponent" : ""}`} style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                                        <Link className={`link ${this.props.pathname === 'https://joynsoftware.com/#/home' ? "activeComponent" : ""}`} to='/home'> Dashboard </Link>
                                    </div>
                                    <div className={`home_sidebar_item ${this.props.pathname === 'https://joynsoftware.com/#/home/risk' ? "activeComponent" : ""}`} style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                                        <Link className={`link ${this.props.pathname === 'https://joynsoftware.com/#/home/risk' ? "activeComponent" : ""}`} to='/home/risk'> Risks </Link>
                                    </div>
                                    <div className={`home_sidebar_item ${this.props.pathname === 'https://joynsoftware.com/#/home/issue' ? "activeComponent" : ""}`} style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                                        <Link className={`link ${this.props.pathname === 'https://joynsoftware.com/#/home/issue' ? "activeComponent" : ""}`} to='/home/issue'> Issues </Link>
                                    </div>
                                </div>
                            }
                        </>
                    }

                    {JSON.parse(localStorage.getItem('features')).some((val) => { return val.id === 1 || val.id === 2 }) &&
                        <>
                            <div className={`home_sidebar_item ${this.props.pathname === 'https://joynsoftware.com/#/home/audit' ? "activeComponent" : ""}`} style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                                <Link className={`link ${this.props.pathname === 'https://joynsoftware.com/#/home/audit' ? "activeComponent" : ""}`} to="/home/audit"> Audit Dashboard </Link>
                            </div>
                        </>
                    }

                    {JSON.parse(localStorage.getItem('features')).some((val) => { return val.id === 1}) &&
                        <>
                            <div className={`home_sidebar_item ${this.props.pathname === 'https://joynsoftware.com/#/home/snag' ? "activeComponent" : ""}`} style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                                <Link className={`link ${this.props.pathname === 'https://joynsoftware.com/#/home/snag' ? "activeComponent" : ""}`} to="/home/snag"> Snag Dashboard </Link>
                            </div>
                            <div className='home_sidebar_item' style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                                <Link className='link' to="/snagreporting"> Snag Reporting </Link>
                            </div>
                        </>
                    }

                    {JSON.parse(localStorage.getItem('features')).some((val) => { return val.id === 1 || val.id === 2 }) &&
                        <>
                            <div className='home_sidebar_item' style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                                <Link className='link' to="/gis"> Inspection Dashboard </Link>
                            </div>
                        </>
                    }
                    {JSON.parse(localStorage.getItem('features')).some((val) => { return val.id === 3 }) &&
                        <>
                            <div className='home_sidebar_item' style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                                <Link className='link' to="/teamManagement"> Team Management </Link>
                            </div>
                        </>
                    }
                    {/* <input type="file" name="file" onChange={(e) => this.changeHandler(e)} />
                    <div>
                        <button onClick={() => this.handleSubmission()}>Submit</button>
                    </div> */}
                </div>

                <div className='home_Content'>
                    <Outlet />
                </div>
            </div>
        )
    }

    componentDidMount() {
        console.log('checking features', JSON.parse(localStorage.getItem('features')))
    }
}

export default Home