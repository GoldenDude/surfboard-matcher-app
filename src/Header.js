import {Link} from 'react-scroll';
import Matcher from './Matcher.png';
import React, {Component} from 'react';

class Header extends Component{
    
    constructor(props){
        super(props);

        this.pic  = this.props.profilePic;
        this.name = this.props.userName;
    }
        
    render(){
        return(
            <div className = "header navbar navbar-light">
                <Link href = "#" to = "top" smooth = {true} offset = {-60} duration = {500}>
                    <img className = "navbar-brand" src = {Matcher} alt = "Surfboard Matcher"/>
                </Link>

                <div className = "navLinkContainer">
                    <Link href = "#" to = "top" smooth = {true} offset = {-60} duration = {500} className = "navLink nav-item">
                        Home
                    </Link>

                    <Link href = "#" to = "liveCams" smooth = {true} offset = {-50} duration = {500} className = "navLink nav-item">
                        Surfing Spots
                    </Link>

                    <Link href = "#" to = "formLocation" smooth = {true} offset = {-95} duration = {500} className = "navLink nav-item">
                        Find a Match!
                    </Link>

                    <Link href = "#" to = "products" smooth = {true} offset = {-75} duration = {500} className = "navLink nav-item">
                        Your Favorites
                    </Link>

                    <Link href = "#" to = "products" smooth = {true} offset = {-75} duration = {500} className = "navLink nav-item">
                        Our Products
                    </Link>

                    <div className = "userProfile">
                        <img src = {this.pic} className = "userPicture" alt = "profile"/>
                        <h6>{this.name}</h6>
                    </div>
                </div>
            </div>
        );
    }
}

export default Header;

