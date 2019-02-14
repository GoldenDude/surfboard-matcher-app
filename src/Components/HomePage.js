import React, { Component }  from 'react';
import SurfboardList from './SurfboardList';
import GoogleLogin from 'react-google-login';
import {Element} from 'react-scroll';
import {ReactHeight} from 'react-height';
import logo from '../logo.png';
import MatchForm from './MatchForm';


class HomePage extends Component{
    constructor(props){
        super(props);
        
        this.renderLogged        = this.renderLogged.bind(this);
        this.renderLoggedOut     = this.renderLoggedOut.bind(this);
        this.responseGoogle      = this.responseGoogle.bind(this);
        this.failedToConnect     = this.failedToConnect.bind(this);
        
        this.state = {
            admin: false,
            logged: false,
            name: null,
            email: null,
        }
    }

    responseGoogle(response){
        const url = 'https://surfboard-matcher.herokuapp.com/addUser';
        let profile = response.profileObj;
        this.setState({
            logged: true,
            email: profile.email,
            name: profile.name,
        });

        const newUser = {
            email: profile.email,
            name: profile.name
        }

        fetch(url, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser)
        }).then(res => res.json())
            .then(json => {
                console.log(json);
            })

        /* Need to add query to add a new user to the DB */
    }

    failedToConnect(response){
        alert("Connection Failed!");
    }

    renderLogged(){
        return (
            <div>
                <Element id = "top"/>
                <div className = "firstBackground">
                    <div className = "container">
                        <div className = "Welcome">
                            <img src = {logo} alt = "Logo" className = "Logo"/>
                        </div>
                        {/* <MatchForm email = {this.state.email} name = {this.state.name}></MatchForm> */}
                        <Element id = "products">
                            <SurfboardList email = {this.state.email} userName = {this.state.name}></SurfboardList>
                        </Element>
                    </div>
                </div>
            </div> 
        )
    }

    renderLoggedOut(){
        return (
            <div className = "firstBackground">
                <div className = "container">
                    <div className = "Welcome">
                        <img src = {logo} alt = "Logo" className = "Logo"/>
                        <div className = "login">
                            <GoogleLogin
                                clientId    = "366517766809-oktrgpvmmhneovtvi5a1q08cos7ahr66.apps.googleusercontent.com"
                                buttonText  = "Login With Google"
                                onSuccess   = {this.responseGoogle}
                                onFailure   = {this.failedToConnect}
                            />
                        </div>
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