import React, { Component }     from 'react';
import Header                   from '../Header';
import consts                   from '../consts';
import logo                     from '../logo.png';
import MatchForm                from './MatchForm';
import Favorites                from './Favorites';
import {Element}                from 'react-scroll';
import SurfboardList            from './SurfboardList';
import openSocket               from 'socket.io-client';
import ProductsPic              from '../products4.jpg';
import GoogleLogin              from 'react-google-login';
import favoritesPic             from '../favoritesPic.png';
import SurfingSpots             from '../surfingSpots.png';

class HomePage extends Component{
    constructor(props){
        super(props);
        this.level      = 0;
        this.height     = 0;
        this.weight     = 0;
        this.pic        = null;
        this.name       = null;
        this.email      = null;
        this.socket     = openSocket(consts.SERVICE_URL);
        
        this.state = {
            logged: false,
        }
                
        this.renderLogged        = this.renderLogged.bind(this);
        this.responseGoogle      = this.responseGoogle.bind(this);
        this.renderLoggedOut     = this.renderLoggedOut.bind(this);
        this.failedToConnect     = this.failedToConnect.bind(this);
    }

    responseGoogle(response){
        let profile = response.profileObj;
        const getUserUrl = `${consts.SERVICE_URL}/getUser?email=${profile.email}`;
        const addUserUrl = `${consts.SERVICE_URL}/addUser`;

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
                else {
                    console.log("User Already Exists ");
                    this.weight = json.weight;
                    this.height = json.height;
                    this.level  = json.level;
                };

                this.name  = profile.name;
                this.email = profile.email;
                this.pic   = profile.imageUrl;
                this.setState({
                    logged: true
                });
            })
            .catch(err => console.log(err));
    }

    failedToConnect(response){
        alert("Connection Failed!");
        console.log(response);
    }

    renderLogged(){
        return (
            <div>
                <Header userName = {this.name} profilePic = {this.pic}/>
                <div>
                    <Element id = "top"/>
                    <div className = "firstBackground">
                        <div className = "container">
                            <div className = "Welcome">
                                <img src = {logo} alt = "Logo" className = "Logo"/>
                            </div>
                        </div>
                    </div>

                    <Element id = "liveCams">
                        <div className = "iframeContainer">
                            <img className = "spotsPic" src = {SurfingSpots} alt = "spots"/>
                            <iframe src="https://www.youtube.com/embed/gDDg-fO_ESk?autoplay=1&mute=1"
                                frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" title = "Nazare" allowFullScreen/>
                            <iframe src="https://www.youtube.com/embed/ArBfFABUDWA?autoplay=1&mute=1" 
                                frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" title = "Ashdod" allowFullScreen/>
                        </div>
                    </Element>
                    
                    <Element id = "formLocation">
                        <MatchForm email = {this.email} name = {this.name} 
                                   level = {this.level} weight = {this.weight}
                                   height = {this.height} socket = {this.socket}
                        />
                    </Element>

                    <img src = {favoritesPic} className = "favoritesPic" alt = "Favorites"/>
                    <div className = "listContainer">
                        <Element id = "favoriteList">
                            <Favorites email = {this.email} socket = {this.socket}/>
                        </Element>
                    </div>
                    
                    <img src = {ProductsPic} className = "productPic" alt = "products"/>
                    <div className = "listContainer">
                        <Element id = "products" className = "container">
                            <SurfboardList email = {this.email} products = {true} socket = {this.socket}/>
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
                                clientId    = {consts.GOOGLE_CLIENT_ID}
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