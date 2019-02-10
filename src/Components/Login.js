
import GoogleLogin from 'react-google-login';
import React, { Component }  from 'react';
import HomePage from './HomePage.js';
import logo from '../logo.png';

class Login extends Component{
    constructor(props){
        super(props);

        this.state = {
            logged: false,
            user: null,
            email: null,
            pic:   null
        }

        this.responseGoogle = this.responseGoogle.bind(this);
        this.renderLogged = this.renderLogged.bind(this);
        this.renderLogin = this.renderLogin.bind(this);
    }

    renderLogin(){
        return(
            <div className = "Welcome">
                <img src = {logo} alt = "Logo"/>
                <div className = "login">
                    <GoogleLogin
                        clientId    = "366517766809-oktrgpvmmhneovtvi5a1q08cos7ahr66.apps.googleusercontent.com"
                        buttonText  = "Login With Google"
                        onSuccess   = {this.responseGoogle}
                        onFailure   = {this.responseGoogle}
                    />
                </div>
            </div>
        );
    }

    renderLogged(){
        return(
            <div>
                <HomePage admin = "false">
                    <h5>
                        Hello.
                        email: {this.state.email}
                        user:  {this.state.user}
                    </h5>
                    <img src = {this.state.pic} alt = "Profile"/>
                </HomePage>
            </div>
        )
    }

    responseGoogle = (response) => {
        let profile = response.profileObj;
        this.setState({
            logged: true,
            email: profile.email,
            user: profile.name,
            pic: profile.imageUrl
        });
        console.log(profile);
    }

    render(){
        return this.state.logged === false ? this.renderLogin() : this.renderLogged();
    }
}

export default Login;
