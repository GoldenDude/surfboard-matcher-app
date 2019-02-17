import React, { Component }  from 'react';
import SurfboardList from './SurfboardList';
import GoogleLogin from 'react-google-login';
import {Element} from 'react-scroll';
import logo from '../logo.png';
import ProductsPic from '../products4.jpg';
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
            logged: true,
            name: null,
            email: "edanazran@gmail.com",
            level: 0,
            weight: 0,
            height: 0,
        }
    }

    responseGoogle(response){
        let profile = response.profileObj;
        const getUserUrl = `https://surfboard-matcher.herokuapp.com/getUser?email=${profile.email}`;
        const addUserUrl = 'https://surfboard-matcher.herokuapp.com/addUser';
        const newUser = {
            email: profile.email,
            name: profile.name
        }

        fetch(getUserUrl, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(res => res.json())
            .then(json => {
                console.log(json);
                /* Checking if user already exists in the database before trying to add it */
                if(json.result === 'Failure'){
                    console.log("Adding a New User");
                    fetch(addUserUrl, {
                        method: "POST",
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(newUser)
                    }).then(res => res.json())
                        .then(json => {
                            console.log(json);
                        })
                        .catch(err => console.log(err));
                }
                else console.log("User Already Exists");
                this.setState({
                    logged: true,
                    email: profile.email,
                    name: profile.name,
                });
            })
            .catch(err => console.log(err));
    }

    failedToConnect(response){
        alert("Connection Failed!");
    }

    renderLogged(){
        return (
            <div>
                <div>
                    <Element id = "top"/>
                    <div className = "firstBackground">
                        <div className = "container">
                            <div className = "Welcome">
                                <img src = {logo} alt = "Logo" className = "Logo"/>
                            </div>
                        </div>
                    </div>
                    <Element id = "formLocation">
                        <MatchForm email = {this.state.email} name = {this.state.name}></MatchForm>
                    </Element>
                    <img src = {ProductsPic} className = "productPic" alt = "products"/>
                    <Element id = "products" className = "container">
                        <SurfboardList email = {this.state.email} userName = {this.state.name} products = {true}></SurfboardList>
                    </Element>
                    
                <div className = "clear"/>
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