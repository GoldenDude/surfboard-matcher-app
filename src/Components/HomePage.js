import logo from '../logo.png';
import MatchForm from './MatchForm';
import {Element} from 'react-scroll';
import React, { Component }  from 'react';
import ProductsPic from '../products4.jpg';
import SurfboardList from './SurfboardList';
import GoogleLogin from 'react-google-login';
import SurfingSpots from '../surfingSpots.png';

class HomePage extends Component{
    constructor(props){
        super(props);

        this.name   = null;
        this.email  = null;
        this.level  = 0;
        this.weight = 0;
        this.height = 0;
        
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
                else {
                    console.log("User Already Exists ");
                    this.weight = json.weight;
                    this.height = json.height;
                    this.level  = json.level;
                };

                this.email = profile.email;
                this.name  = profile.name;
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
                            <iframe src="https://www.youtube.com/embed/n_e-kzztGIU"
                                frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" title = "Nazare" allowFullScreen/>
                            <iframe src="https://www.youtube.com/embed/ArBfFABUDWA" 
                                frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" title = "Ashdod" allowFullScreen/>
                        </div>
                    </Element>
                    
                    <Element id = "formLocation">
                        <MatchForm email = {this.email} name = {this.name} 
                                   level = {this.level} weight = {this.weight}
                                   height = {this.height}
                        />
                    </Element>
                    <img src = {ProductsPic} className = "productPic" alt = "products"/>
                    <Element id = "products" className = "container">
                        <SurfboardList email = {this.email} userName = {this.name} products = {true}/>
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