import React from 'react'

import { Link } from 'react-router-dom'

import Axios from 'axios';

import Spinner from "./Spinner";

// import '../styles/Login.css'

// import '../styles/ForgotPassword.css'

class ForgotPassword extends React.Component {

    state = {

        isLoading: false,

        correctCode: false,
        emailEntered: false,

        email: '',
        verificationCode: '',
        newPassword: '',
        confirmNewPassword: ''
    }

    enterVerificationCode = () => {
        this.setState({ isLoading: true }, () => {
            console.log('hello')
            Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/enterVerificationCode', { email: this.state.email })
                .then(res => {

                    console.log(res.data)
                    if (res.data == 'ok') {
                        this.setState({ emailEntered: true, isLoading: false })
                    }

                }).catch(err => {
                    console.log(err.response.data)
                    this.setState({ isLoading: false }, () => {
                        alert(err.response.data.message)
                    })
                })
        })

    }

    verifyVerificationCode = () => {
        this.setState({ isLoading: true }, () => {
            console.log('hello')
            Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/verifyVerificationCode', { email: this.state.email, verificationCode: this.state.verificationCode })
                .then(res => {

                    console.log(res.data)
                    if (res.data == 'ok') {
                        this.setState({ correctCode: true, isLoading: false })
                    }
                }).catch(err => {
                    console.log(err.response.data)
                    this.setState({ isLoading: false }, () => {
                        alert(err.response.data.message)
                    })
                })
        })
    }

    resetPassword = () => {
        if (this.state.newPassword !== this.state.confirmNewPassword) {
            alert('Password and Confirm Password Must be the same');
            return;
        }
        this.setState({ isLoading: true }, () => {
            Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/resetPassword', { email: this.state.email, password: this.state.newPassword })
                .then(res => {

                    console.log(res.data)
                    if (res.data == 'ok') {
                        alert('Password Changed Successfully');
                        this.props.navigate("/");
                    }
                }).catch(err => {
                    console.log(err.response.data)
                    this.setState({ isLoading: false }, () => {
                        alert(err.response.data.message)
                    })
                })
        })
    }

    emailTyping = (e) => {
        this.setState({ email: e.target.value }, () => {
            console.log(this.state.email);
        })
    }

    verificationCodeTyping = (e) => {
        this.setState({ verificationCode: e.target.value }, () => {
            console.log(this.state.verificationCode);
        })
    }

    newPasswordTyping = (e) => {
        this.setState({ newPassword: e.target.value }, () => {
            console.log(this.state.newPassword);
        })
    }

    confirmNewPasswordTyping = (e) => {
        this.setState({ confirmNewPassword: e.target.value }, () => {
            console.log(this.state.confirmNewPassword);
        })
    }

    render() {

        return (
            <>
                {this.state.isLoading &&
                    <div style={{ height: '100%', width: '100%', background: 'white', position: 'absolute', top: '0px', left: '0px', zIndex: '10000000' }}>
                        <Spinner />
                    </div>
                }
                <div className="box-form" style={{ marginTop: '20px' }}>
                    <div className="left">
                        <div className="overlay">
                            <h1>Joyn Software.</h1>
                            <p>Powered By JoynDigital</p>

                        </div>
                    </div>


                    <div className="right" style={{ height: '500px' }}>
                        <h1 style={{ fontWeight: '40px', marginBottom: '20px' }}>Password Reset</h1>
                        <br></br>
                        {this.state.emailEntered === false &&
                            <>
                                <p style={{ color: 'black' }}>Enter Your Email Address</p>
                                <div className="inputs">
                                    <input onChange={(e) => this.emailTyping(e)} type="text" placeholder="Email" />
                                    <br />
                                    <br></br>
                                    <button className='LoginButton' onClick={() => this.enterVerificationCode()}>Enter</button>
                                </div>
                            </>
                        }
                        {this.state.emailEntered &&
                            <>
                                <p style={{ color: 'black' }}>Please Enter the Verification Code We have sent you on Your Email</p>
                                <div className="inputs">
                                    <input onChange={(e) => this.verificationCodeTyping(e)} type="text" placeholder="Verification Code" />
                                    <br />
                                    <br></br>
                                    <button className='LoginButton' onClick={() => this.verifyVerificationCode()}>Enter</button>
                                </div>
                            </>

                        }

                        <br />

                        {this.state.correctCode &&

                            <div className="inputs">
                                <input onChange={(e) => this.newPasswordTyping(e)} type="password" placeholder="New Password" />
                                <br />
                                <input onChange={(e) => this.confirmNewPasswordTyping(e)} type="password" placeholder="Confirm New Password" />
                                <br />
                                <br />
                                <button className='LoginButton' onClick={() => this.resetPassword()}>Reset Password</button>
                            </div>

                        }

                        {this.state.correctCode == false &&

                            <div className="remember-me--forget-password">
                                <Link to='/'><p style={{ color: 'purple' }}>Login</p></Link>
                            </div>

                        }

                    </div>

                </div>
            </>
        )
    }

    componentDidMount() {
        console.log('forgotPassword')
    }
}

export default ForgotPassword