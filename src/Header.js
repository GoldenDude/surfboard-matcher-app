import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import Matcher from './Matcher.png';
const path = window.location.pathname === "/Profile" ? "/" : window.location.pathname;

class Header extends Component{
    active = {
        backgroundColor: "#212F3D",
        color: "white",
        fontWeight: "bold"
    };

    render(){
        return(
            <div className = "navbar navbar-light">
                <div>
                    <NavLink exact to = {path} className = "Matcher">
                        <img className = "navbar-brand" src = {Matcher} alt = "Surfboard Matcher"/>
                    </NavLink>
                    <NavLink exact to = {path} className = "navLink nav-item" activeStyle = {this.active}>
                        Home
                    </NavLink>

                    <NavLink to = {`${path}Profile`} activeStyle = {this.active} className = "navLink nav-item">
                        My Profile
                    </NavLink>
                </div>
            </div>
        );
    }
}

export default Header;

