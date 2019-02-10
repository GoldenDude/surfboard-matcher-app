import React, { Component }  from 'react';



class HomePage extends Component{
    constructor(props){
        super(props);
        
        this.renderAdmin    = this.renderAdmin.bind(this);
        this.renderUser     = this.renderUser.bind(this);
        
        this.state = {
            admin: false,
            name: null,
            email: null
        }
    }

    renderUser(){
        return (
            <div className = "HomePage">
                {this.props.children}
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