import React from "react";

import '../styles/TobBar.css';
import { Link } from 'react-router-dom'

class TopBar extends React.Component {

    state = {
        settingsButtonOpen: false
    }

    logout = () => {
        this.setState({ settingsButtonOpen: false }, () => {
            localStorage.removeItem("access_token_expiry");
            localStorage.removeItem("refresh_token_expiry");
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("id");
            localStorage.removeItem("name");
            this.props.updateName('');
            this.props.navigate("/");
        })

    }

    settings = () => {
        this.setState({ settingsButtonOpen: false }, () => {
            this.props.navigate("/resetCredentials");
        })

    }

    adminPanel = () => {
        this.setState({ settingsButtonOpen: false }, () => {
            this.props.navigate("/adminPanel");
        })
    }
    //#5961f9ad
    //#7cb5ec
    render() {
        return (
            <div style={{ background: '#4162A6', height: '50px' }}>
                <div style={{ float: 'left', height: '100%', width: '15%', fontWeight: 'bold', fontSize: '25px', color: 'white', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', fontFamily: "'Lucida Console', 'Courier New', monospace", letterSpacing: '3px', marginLeft: '10px' }}> J<span style={{ color: 'red' }}>O</span>YN</div>
                {localStorage.getItem('name') &&
                    <>
                        <div style={{ marginLeft: '20px', fontWeight: 'bold', fontFamily: 'sans-serif', fontSize: '14px', color: 'white', float: 'left', height: '30px', marginTop: '15px', transform: 'translateY(-5px)', lineHeight: '30px' }}> Welcome, {localStorage.getItem('name')} </div>
                        <div onClick={() => { this.setState({ settingsButtonOpen: !this.state.settingsButtonOpen }) }} style={{ cursor: 'pointer', color: 'white', fontSize: '14px', fontWeight: 'bold', marginRight: '20px', display: 'flex', float: 'right', width: '30px', height: '30px', borderRadius: '15px', background: '#ff5722', marginTop: '15px', transform: 'translateY(-7.5px)', justifyContent: 'center', alignItems: 'center' }}><div>{localStorage.getItem('name').split(/\s/).reduce((response, word) => response += word.slice(0, 1), '')}</div></div>
                    </>
                }

                {this.state.settingsButtonOpen &&
                    <div className="TopBar_SettingsButton">
                        <div className="TopBar_SettingsButton_inner" onClick={() => this.settings()}>
                            
                            <i style={{ marginLeft: '10px', marginRight: '10px', width: '20px' }} className="fa fa-cog" aria-hidden="true"></i>
                            Settings
                        </div>

                        {localStorage.getItem('role') === '2' &&
                            <div className="TopBar_SettingsButton_inner" onClick={() => this.adminPanel()}><i style={{ marginLeft: '10px', marginRight: '10px', width: '20px' }} className="fa fa-user-plus" aria-hidden="true"></i>Admin Panel</div>
                        }

                        <div className="TopBar_SettingsButton_inner" onClick={() => this.logout()}><i style={{ marginLeft: '10px', marginRight: '10px', width: '20px' }} className="fa fa-sign-out" aria-hidden="true"></i>Logout</div>
                    </div>
                }

            </div>
        )
    }

}

export default TopBar;
