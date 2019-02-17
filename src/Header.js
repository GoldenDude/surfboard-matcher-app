import React, {Component} from 'react';
import {Link} from 'react-scroll';
import Matcher from './Matcher.png';

class Header extends Component{
    render(){
        return(
            <div className = "header navbar navbar-light">
                <div>
                    <Link href = "#" to = "top" smooth = {true} offset = {-60} duration = {500} className = "Matcher">
                        <img className = "navbar-brand" src = {Matcher} alt = "Surfboard Matcher"/>
                    </Link>

                    <Link href = "#" to = "top" smooth = {true} offset = {-60} duration = {500} className = "navLink nav-item">
                        Home
                    </Link>

                    <Link href = "#" to = "formLocation" smooth = {true} offset = {-60} duration = {500} className = "navLink nav-item">
                        Find a Match!
                    </Link>

                    <Link href = "#" to = "products" smooth = {true} offset = {-550} duration = {500} className = "navLink nav-item">
                        Our Products
                    </Link>

                    <Link href = "#" to = "products" smooth = {true} offset = {20} duration = {500} className = "navLink nav-item">
                        Surfing Locations
                    </Link>
                </div>
            </div>
        );
    }
}

export default Header;

