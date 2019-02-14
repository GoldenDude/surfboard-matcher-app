import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import {Link, animateScroll as scroll} from 'react-scroll';
import Matcher from './Matcher.png';
const path = window.location.pathname === "/Profile" ? "/" : window.location.pathname;

class Header extends Component{
    render(){
        return(
            <div className = "navbar navbar-light">
                <div>
                    <Link href = "#" to = "products" smooth = {true} offset = {25} duration = {500} className = "Matcher">
                        <img className = "navbar-brand" src = {Matcher} alt = "Surfboard Matcher"/>
                    </Link>

                    <Link href = "#" to = "products" smooth = {true} offset = {25} duration = {500} className = "navLink nav-item">
                        Home
                    </Link>

                    <Link href = "#" to = "products" smooth = {true} offset = {25} duration = {500} className = "navLink nav-item">
                        Matching Form
                    </Link>

                    <Link href = "#" to = "products" smooth = {true} offset = {25} duration = {500} className = "navLink nav-item">
                        Our Products
                    </Link>

                    <Link href = "#" to = "products" smooth = {true} offset = {25} duration = {500} className = "navLink nav-item">
                        Surfing Locations
                    </Link>
                </div>
            </div>
        );
    }
}

export default Header;

