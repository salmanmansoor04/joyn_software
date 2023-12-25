import React from 'react'

import { Link } from 'react-router-dom'

import Axios from 'axios';

import '../styles/Login.css'

class Login extends React.Component {

    state = {
        username: '',
        password: '',
        users: [{ username: 'dejavu@latitude.com.pk', password: 'Huawei@123' }]

    }

    usernametyping = (event) => {

        this.setState({ username: event.target.value })
    }

    passwordtyping = (event) => {
        this.setState({ password: event.target.value })
    }

    loginClicked = () => {

        // let status = false;
        // this.state.users.forEach((val) => {
        //     if(val.username == this.state.username && val.password == this.state.password){
        //         status = true;
        //     }
        // })
        // if(status){
        //     this.props.navigate("/home");
        // }else{
        //     alert('Invalid Username or Password')
        // }
        Axios.post(process.env.REACT_APP_BACKEND_BASE_URL + 'api/login', { username: this.state.username, password: this.state.password })
            .then(res => {

                console.log(res.data);
                localStorage.setItem("access_token_expiry", res.data.access_token_expiry);
                localStorage.setItem("refresh_token_expiry", res.data.refresh_token_expiry);
                localStorage.setItem("access_token", res.data.access_token);
                localStorage.setItem("refresh_token", res.data.refresh_token);
                localStorage.setItem("id", res.data.id);
                localStorage.setItem("name", res.data.name);
                localStorage.setItem("cust_id", res.data.cust_id);
                localStorage.setItem("features", JSON.stringify(res.data.features));
                localStorage.setItem("permissions", JSON.stringify(res.data.permissions));
                localStorage.setItem("role", res.data.role)
                this.props.navigate("/home");
                this.props.updateName(res.data.name);
                //console.log(this.state.posts);
            }).catch(err => {
                alert(err.response.data.message)
            })

    }

    render() {

        return (

            <div className="box-form" style={{ marginTop: '20px' }}>
                <div className="left">
                    <div className="overlay">
                        <h1>Joyn Software.</h1>
                        <p>Powered By JoynDigital</p>

                    </div>
                </div>


                <div className="right" style={{ height: '500px' }}>
                    <h5>Login</h5>
                    <div className="inputs">
                        <input type="text" placeholder="user name" onChange={(e) => this.usernametyping(e)} />
                        <br />
                        <input type="password" placeholder="password" onChange={(e) => this.passwordtyping(e)} />
                    </div>

                    <br /><br />

                    <div className="remember-me--forget-password">
                       <Link to='/forgotPassword'><p style={{color: 'purple'}}>forgot password?</p></Link>
                    </div>

                    <br />
                    <button className='LoginButton' onClick={() => this.loginClicked()}>Login</button>
                </div>

            </div>
        )
    }

    componentDidMount() {
        this.props.updatePathname(window.location.href)
    }
}

export default Login