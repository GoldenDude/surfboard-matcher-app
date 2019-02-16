import React, { Component } from "react";
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import SurfboardList from "./SurfboardList";
import findAMatch from "../FindAMatch.png";

const Handle = Slider.Handle;

class MatchForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            result: [],
            email: "edanazran@gmail.com",
            name: null,
            level: 0,
            weight: 0,
            height: 0,
            location: 0,
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
    }

    renderSent() {      
        return (
            <div className = "matchForm">
                {this.renderDefault()}
                <SurfboardList email = {this.state.email} userName = {this.state.name} products = {false} key = {1}>
                    {this.state.result}
                </SurfboardList>
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
                            <input required type = "name" className = "form-control" id = "Name" placeholder = "Enter Height in Centimeters..." onChange = {self.handleHeight}/>
                        </div>
                        <div className="form-group">
                            <label name = "weight">Weight</label>
                            <input required className="form-control" id = "weight" placeholder = "Enter Weight in Kilograms..." onChange = {self.handleWeight}/>
                        </div>
                        
                        <div className = "form-group">
                            <label name = "Inputselect">Your Level</label>
                            <div className = "wrapperStyle">
                                <Slider className = "level" min = {0} max = {10} defaultValue = {1} handle = {self.handle}/>
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
        const getMatchedUrl = `https://surfboard-matcher.herokuapp.com/matchSurfboard?height=${self.state.height}&weight=${self.state.weight}&level=${self.state.level}&location=4219`;
        self.setState({level: level, result: [], sent: false});
        let favList;
        const getHistoryUrl = `https://surfboard-matcher.herokuapp.com/getHistory?email=${self.state.email}`;

        fetch(getMatchedUrl).then(res => res.json()).then(async json => {
            await fetch(getHistoryUrl).then(res => res.json()).then(json => favList = json);
            for(let i = 0; i < 4; ++i){
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

    handleHeight(event){
        this.setState({
            height: event.target.value
        })
    }
    
    handleWeight(event){
        this.setState({
            weight: event.target.value
        })
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