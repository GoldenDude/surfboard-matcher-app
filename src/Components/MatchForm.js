import React, { Component } from "react";
import SurfboardList from "./SurfboardList";

class MatchForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            result: [],
            email: null,
            name: null,
            level: 0,
            weight: 0,
            height: 0,
            sent: false
        }

        this.renderSent     = this.renderSent.bind(this);
        this.renderDefault  = this.renderDefault.bind(this);
    }

    renderSent() {
        return (
            <div className="matchForm">
                <img src="../FormImg.png" alt="form"></img>
                <form>

                </form>
                <SurfboardList email={this.state.email} userName={this.state.name}></SurfboardList>
            </div>
        )
    }

    renderDefault() {
        return (
            <div className="matchForm">
                {/* <img src="../FormImg.png" alt="form"></img> */}
                <div className="container">
                    <h1>Find a Match!</h1>
                    <h4>Please Fill the Following</h4>
                    <form>
                        <div className="form-group">
                            <label name="height">Height</label>
                            <input type="name" className="form-control" id="Name" placeholder="Height"/>
                        </div>
                        <div className="form-group">
                            <label name="weight">Weight</label>
                            <input className="form-control" id="weight" placeholder="Weight"/>
                        </div>
                        
                        <div className="form-group">
                            <label name="Inputselect">Your Level</label>
                            <select className="form-control" >
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-info">Submit Information</button>
                    </form>
                </div>
            </div>  
        );
    }
                
    render(){
        return this.state.sent ? this.renderSent() : this.renderDefault();
    }
                
}            
                
export default MatchForm;