import React, { Component } from "react";
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import SurfboardList from "./SurfboardList";
import findAMatch from "../findAMatch.jpg";

const Handle = Slider.Handle;

class MatchForm extends Component {
    constructor(props) {
        super(props);
        this.name       = null;
        this.level      = this.props.level;
        this.weight     = this.props.weight;
        this.height     = this.props.height;
        this.email      = this.props.email;
        this.location   = 4219;
        
        this.state = {
            result: [],
            sent: false
        }

        this.renderSent     = this.renderSent.bind(this);
        this.renderDefault  = this.renderDefault.bind(this);
        this.handle         = this.handle.bind(this);
        this.handleHeight   = this.handleHeight.bind(this);
        this.handleWeight   = this.handleWeight.bind(this);
        this.getMatched     = this.getMatched.bind(this);
        this.add            = this.add.bind(this);
        this.nextID         = this.nextID.bind(this);
        this.handleLocation = this.handleLocation.bind(this);
        this.updateUserInfo = this.updateUserInfo.bind(this);
    }

    renderSent() {      
        return (
            <div className = "matchForm">
                {this.renderDefault()}
                <div className = "container">
                    <SurfboardList email = {this.email} userName = {this.name} products = {false} key = {1}>
                        {this.state.result}
                    </SurfboardList>
                </div>
            </div>
        )
    }

    handle(props){
        const { value, dragging, index, ...restProps } = props;
        
        return (
            <Tooltip
            prefixCls="rc-slider-tooltip"
            overlay={value}
            visible={dragging}
            placement="top"
            key={index}
            >
                <Handle value={value} {...restProps} />
            </Tooltip>
        );
    }
    
    renderDefault() {
        let self = this;
        return (
            <div className = "matchForm">
                <img src = {findAMatch} alt = "form"></img>
                <div className = "container formContainer">
                    <h1>Find a Match!</h1>
                    <h4>Please Fill the Following</h4>
                    <form onSubmit = {self.getMatched}>
                        <div className = "form-group">
                            <label name = "height">Height</label>
                            <input required type = "name" className = "form-control" id = "Name" defaultValue = {this.height} onChange = {self.handleHeight}/>
                        </div>
                        <div className="form-group">
                            <label name = "weight">Weight</label>
                            <input required className="form-control" id = "weight" defaultValue = {this.weight} onChange = {self.handleWeight}/>
                        </div>

                        <div className="form-group">
                            <label name = "weight">Location</label>
                            <div className = "wrapper">
                                <div className = "toggle_radio">
                                    <input type = "radio" checked  className = "toggle_option" 
                                            id = "first_toggle" name = "toggle_option" value = {4219} onChange = {self.handleLocation}/>
                                    <input type = "radio" className = "toggle_option" 
                                            id = "second_toggle" name = "toggle_option" value = {194} onChange = {self.handleLocation}/>
                                    <label className = "firstLabel" htmlFor = "first_toggle"><p>Ashdod, Israel</p></label>
                                    <label className = "secondLabel" htmlFor = "second_toggle"><p>Nazaré, Portugal</p></label>
                                    <div className = "toggle_option_slider"></div>
                                </div>
                            </div>
                        </div>
                        <div className = "form-group">
                            <label name = "Inputselect">Your Level</label>
                            <div className = "wrapperStyle">
                                <Slider className = "level" min = {0} max = {10} defaultValue = {this.level} handle = {self.handle}/>
                            </div>
                        </div>
                        <button type = "submit" className = "btn btn-info">Submit Information</button>
                    </form>
                </div>
            </div>  
        );
    }

    getMatched(event){
        event.preventDefault();
        let self = this;
        let level = document.body.getElementsByClassName("rc-slider-handle")[0].getAttribute("aria-valuenow");
        self.level = level; 
        const getMatchedUrl = `https://surfboard-matcher.herokuapp.com/matchSurfboard?height=${self.height}&weight=${self.weight}&level=${self.level}&location=${self.location}`;
        
        self.setState({result: [], sent: false});
        let favList;
        const getHistoryUrl = `https://surfboard-matcher.herokuapp.com/getHistory?email=${self.email}`;

        fetch(getMatchedUrl).then(res => res.json()).then(async json => {
            await fetch(getHistoryUrl).then(res => res.json()).then(json => favList = json);
            let size = json.length < 4 ? json.length : 4;
            console.log(size);

/*
    Checking if the user's surfboards history appear in the record of matched surfboards according to parameters in form 
    to indicate in the record of matched surfboards the surfboards that are in the user's favorites.
*/
            for(let i = 0; i < size; ++i){
                let favorite = false;

                for(let j = 0; j < favList.length; ++j){
                    if(json[i]._id === favList[j]._id){
                        favorite = true;
                    }
                }

                self.add({id: json[i]._id, brand: json[i].brand, userMinWeight: json[i].userMinWeight, userMaxWeight: json[i].userMaxWeight,
                    width: json[i].width, thickness: json[i].thickness, height: json[i].height, maxSwell: json[i].maxSwell, favorite: favorite});
            }
            self.setState({sent: true});
        })
        .catch(err => {
            alert("Bad Input");
            console.log(err);
        });

        this.updateUserInfo();
    }

    updateUserInfo(){
        const updateUrl = `https://surfboard-matcher.herokuapp.com/updateUser?email=${this.email}&height=${this.height}&weight=${this.weight}&level=${this.level}`;

        fetch(updateUrl, {
            'method': "PUT",
            headers: {
                'Accept': 'application/json'
            }
        }).then(res => res.json())
            .then(json => {
                if(json.result === 'Failure'){
                    console.log("Unable to update User's Info");
                }
            })
        .catch(err => console.log(err));
    }

    add({id = null, brand = 'default name', userMinWeight = 0, userMaxWeight = 0, width = 0, thickness = 0, height = 0, maxSwell = 0, favorite = false}){

        this.setState(prevState => ({
            result: [
                ...prevState.result, {
                    id:id !== null ? id : this.nextID(prevState.result),
                    brand: brand,
                    userMinWeight: userMinWeight,
                    userMaxWeight: userMaxWeight,
                    width: width,
                    thickness: thickness,
                    height: height,
                    maxSwell: maxSwell,
                    favorite: favorite
                }
            ]
        }))
    }

    handleLocation(event){
        this.location = event.target.value;
    }

    handleHeight(event){
        this.height = event.target.value;
    }
    
    handleWeight(event){
        this.weight = event.target.value;
    }
    
    nextID(surfboards = []){
        let max = surfboards.reduce((prev, curr) => prev.id > curr.id ? prev.id :  curr.id, 0);
        return ++max;
    }

    render(){
        return this.state.sent ? this.renderSent() : this.renderDefault();
    }
    
}            
                
export default MatchForm;