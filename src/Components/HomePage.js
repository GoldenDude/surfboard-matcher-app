import React, { Component }  from 'react';
import SurfboardList from './SurfboardList';
import GoogleLogin from 'react-google-login';
import logo from '../logo.png';


class HomePage extends Component{
    constructor(props){
        super(props);
        
        this.renderLogged        = this.renderLogged.bind(this);
        this.renderLoggedOut     = this.renderLoggedOut.bind(this);
        this.responseGoogle      = this.responseGoogle.bind(this);
        
        this.state = {
            admin: false,
            logged: false,
            name: null,
            email: null,
        }
    }

    responseGoogle = (response) => {
        let profile = response.profileObj;
        this.setState({
            logged: true,
            email: profile.email,
            name: profile.name,
        });

        /* Need to add query to add a new user to the DB */
    }

    renderLogged(){
        return (
            <div className = "container">
                <div className = "Welcome">
                    <img src = {logo} alt = "Logo"/>
                </div>
                <SurfboardList email = {this.state.email} name = {this.state.name}></SurfboardList>
            </div>
        )
    }

    renderLoggedOut(){
        return (
            <div className = "container">
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
            </div>
        )
    }


    render(){
        return this.state.logged ? this.renderLogged() : this.renderLoggedOut();
    }
}

export default HomePage;