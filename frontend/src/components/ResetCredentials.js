import React from 'react'

import Axios from 'axios';

import '../styles/ResetCredentials.css'

import { Link } from 'react-router-dom'

class ResetCredentials extends React.Component {

    state = {
        username: '',
        email: '',
        existingPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    }

    credentailsEntered = (e, type) => {

        if (type == 'email') {
            let temp = '';
            temp = temp + e.target.value;
            console.log('email', temp)
            this.setState({ email: temp });
        }
        if (type == 'username') {
            let temp = '';
            temp = temp + e.target.value;
            console.log('username', temp)
            this.setState({ username: temp });
        }
        if (type == 'existingPassword') {
            let temp = '';
            temp = temp + e.target.value;
            console.log('existingPassword', temp)
            this.setState({ existingPassword: temp });
        }
        if (type == 'newPassword') {
            let temp = '';
            temp = temp + e.target.value;
            console.log('newPassword', temp)
            this.setState({ newPassword: temp });
        }
        if (type == 'confirmNewPassword') {
            let temp = '';
            temp = temp + e.target.value;
            console.log('confirm', temp)
            this.setState({ confirmNewPassword: temp });
        }
    }

    resetCredentials = () => {

        if (this.state.email === '' || this.state.username === '' || this.state.existingPassword === '' || this.state.newPassword === '' || this.state.confirmNewPassword === '') {
            alert('All fields are compulsory');
            return
        }

        if (this.state.newPassword !== this.state.confirmNewPassword) {
            alert('New Password and Confirm New Password must be similar')
            return
        }

        let data = {
            username: this.state.username,
            email: this.state.email,
            existingPassword: this.state.existingPassword,
            newPassword: this.state.newPassword,
            id: localStorage.getItem('id')
        }

        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/resetCredentials', data)
            .then(res => {

                alert(res.data)
                this.props.navigate("/home");

            }).catch(err => alert(err.response.data.message))
    }


    render() {

        return (
            <div className="box-form" style={{ marginTop: '20px' }}>
                <div className="left" style={{ width: '70%' }}>
                    <div className="overlay">
                        <h1>Joyn Software.</h1>
                        <p>Powered By JoynDigital</p>

                    </div>
                </div>


                <div className="right" style={{ width: '30%' }}>
                    <h4 style={{ marginTop: '50px' }}>Credentials Settings</h4>
                    <div className="inputs">
                        <input value={this.state.username} type="text" placeholder="Username" onChange={(e) => this.credentailsEntered(e, 'username')} />
                        <br />
                        <input value={this.state.email} type="email" placeholder="Email" onChange={(e) => this.credentailsEntered(e, 'email')} />
                        <br />
                        <input value={this.state.existingPassword} type="password" placeholder="Existing Password" onChange={(e) => this.credentailsEntered(e, 'existingPassword')} />
                        <br />
                        <input value={this.state.newPassword} type="password" placeholder="New Password" onChange={(e) => this.credentailsEntered(e, 'newPassword')} />
                        <br />
                        <input value={this.state.confirmNewPassword} type="password" placeholder="Confirm New Password" onChange={(e) => this.credentailsEntered(e, 'confirmNewPassword')} />
                    </div>
                    <br></br>
                    <br></br>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <button className='LoginButton' onClick={() => this.resetCredentials()} >Reset Credentials</button>
                        <Link to='/home'><button className='LoginButton'>Cancel</button></Link>
                    </div>
                </div>

            </div>
        )
    }

    async componentDidMount() {
        this.props.updatePathname(window.location.href)
        var auth = await this.props.authChecker(localStorage.getItem("access_token_expiry"), localStorage.getItem("refresh_token_expiry"));
        if (auth === 'login') {
            alert('Session has expired you need to login again')
            localStorage.removeItem("access_token_expiry");
            localStorage.removeItem("refresh_token_expiry");
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("id");
            this.props.navigate("/");
            return
        }

        let config = {
            headers: {
                'X-Access-Token': localStorage.getItem("access_token"),
                'X-Refresh-Token': localStorage.getItem("refresh_token"),
                'X-User-ID': localStorage.getItem("id"),
            }
        }

        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/resetCredentialsInit', {}, config)
            .then(res => {
                if (res.data === 'login') {
                    //alert('No Unauthorized Access');
                    localStorage.removeItem("access_token_expiry");
                    localStorage.removeItem("refresh_token_expiry");
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                    localStorage.removeItem("id");
                    this.props.navigate("/");
                    return
                }

                this.setState({ username: res.data.username, email: res.data.email })

            }).catch(err => console.log(err))
    }
}

export default ResetCredentials

{/* <div className='resetCredentialsWrapper' >
            //     <ul className="circles">
            //         <li></li>
            //         <li></li>
            //         <li></li>
            //         <li></li>
            //         <li></li>
            //         <li></li>
            //         <li></li>
            //         <li></li>
            //         <li></li>
            //         <li></li>
            //     </ul>
            //     <div className="resetCredentailsFormBox" style={{ marginTop: '20px' }}>
            //         <h4 className='resetCredentialsHeading'>Credentials Settings</h4>

            //         <div style={{ marginTop: '30px' }}>
            //             <h5 style={{ textAlign: 'left', paddingLeft: '30px', margin: '0px' }}>Username</h5>
            //             <div style={{ textAlign: 'left', paddingLeft: '30px', paddingRight: '30px' }}>
            //                 <input value={this.state.username} onChange={(e) => this.credentailsEntered(e, 'username')} style={{ width: '100%' }} type="text" />
            //             </div>
            //         </div>

            //         <div style={{ marginTop: '30px' }}>
            //             <h5 style={{ textAlign: 'left', paddingLeft: '30px', margin: '0px' }}>Email</h5>
            //             <div style={{ textAlign: 'left', paddingLeft: '30px', paddingRight: '30px' }}>
            //                 <input value={this.state.email} onChange={(e) => this.credentailsEntered(e, 'email')} style={{ width: '100%' }} type="email" />
            //             </div>
            //         </div>

            //         <div style={{ marginTop: '30px' }}>
            //             <h5 style={{ textAlign: 'left', paddingLeft: '30px', margin: '0px' }}>Existing Password</h5>
            //             <div style={{ textAlign: 'left', paddingLeft: '30px', paddingRight: '30px' }}>
            //                 <input value={this.state.existingPassword} onChange={(e) => this.credentailsEntered(e, 'existingPassword')} style={{ width: '100%' }} type="password" />
            //             </div>
            //         </div>

            //         <div style={{ marginTop: '30px' }}>
            //             <h5 style={{ textAlign: 'left', paddingLeft: '30px', margin: '0px' }}>New Password</h5>
            //             <div style={{ textAlign: 'left', paddingLeft: '30px', paddingRight: '30px' }}>
            //                 <input value={this.state.newPassword} onChange={(e) => this.credentailsEntered(e, 'newPassword')} style={{ width: '100%' }} type="password" />
            //             </div>
            //         </div>

            //         <div style={{ marginTop: '30px' }}>
            //             <div style={{ textAlign: 'center' }}><button>Reset Credentials</button></div>
            //         </div>
            //     </div>
            // </div> */}