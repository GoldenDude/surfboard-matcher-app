import React, { Component }  from 'react';
import SurfboardList from './SurfboardList';
import logo from '../logo.png';


class HomePage extends Component{
    constructor(props){
        super(props);
        
        this.renderAdmin    = this.renderAdmin.bind(this);
        this.renderUser     = this.renderUser.bind(this);
        
        this.state = {
            admin: false,
            name: null,
            email: null,
            surfboards: 0
        }
    }

    renderUser(){
        return (
            <div className = "container">
                <div className = "Welcome">
                    <img src = {logo} alt = "Logo"/>
                </div>
                <SurfboardList></SurfboardList>
            </div>
        )
    }

    renderAdmin(){

    }


    render(){
        return this.props.admin === true ? this.renderAdmin() : this.renderUser();
    }
}

export default HomePage;