import React, { Component } from "react";
import SurfboardList from "./SurfboardList";

class MatchForm extends Component{
    constructor(props){
        super(props);

        this.state = {
            email: null,
            name: null,

        }
    }
    
    render(){
        return(
            <div className = "matchForm">
                <img src = "../FormImg.png" alt = "form"></img>
                <form>
                    
                </form>
            </div>
        );
    }
}



export default MatchForm;