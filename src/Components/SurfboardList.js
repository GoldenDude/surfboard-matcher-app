import React, { Component } from 'react';
import Surfboard from './Surfboard';
import SurfboardPic from '../surfboard.png'


class SurfboardList extends Component{
    constructor(props){
        super(props);
        
        this.state = {
            allSurfboards: [],
            shownSurfboards: [],
            shown: 20
        }

        this.add           = this.add.bind(this);
        this.nextID        = this.nextID.bind(this);
        this.eachSurfboard = this.eachSurfboard.bind(this);
    }

    componentDidMount(){
        var self = this;
        const url = 'https://surfboard-matcher.herokuapp.com/getAllSurfboards';

        fetch(url)
        .then(res => res.json())
            .then(json => {
                json.map((surfboard, i) => {
                    self.add({id: surfboard._id, brand: surfboard.brand, userMinWeight: surfboard.userMinWeight, userMaxWeight: surfboard.userMaxWeight,
                              width: surfboard.width, thickness: surfboard.thickness, height: surfboard.height, maxSwell: surfboard.maxSwell, i: i});
                    return 0;
                });
                
            })
        .catch(err => console.log(err));
    }

    add({id = null, brand = 'default name', userMinWeight = 0, userMaxWeight = 0, width = 0, thickness = 0, height = 0, maxSwell = 0, i = 0}){
        this.setState(prevState => ({
            allSurfboards: [
                ...prevState.allSurfboards, {
                    id: id !== null? id : this.nextID(prevState.allSurfboards),
                    brand: brand,
                    userMinWeight: userMinWeight,
                    userMaxWeight: userMaxWeight,
                    width: width,
                    thickness: thickness,
                    height: height,
                    maxSwell: maxSwell
                }
            ]
        }))

        if(i < this.state.shown){
            this.setState(prevState => ({
                shownSurfboards: [
                    ...prevState.shownSurfboards, {
                        id: id !== null? id : this.nextID(prevState.shownSurfboards),
                        brand: brand,
                        userMinWeight: userMinWeight,
                        userMaxWeight: userMaxWeight,
                        width: width,
                        thickness: thickness,
                        height: height,
                        maxSwell: maxSwell
                    }
                ]
            }))
        }
    }

    nextID(surfboards = []){
        let max = surfboards.reduce((prev, curr) => prev.id > curr.id ? prev.id :  curr.id, 0);
        return ++max;
    }

    eachSurfboard(surfboards, i) {
        return (
        <div className = "card" key = {`container${i}`} style={{width: 18 + 'rem', marginBottom: 7 + 'px'}}>
            <div className = "card-body">
                <Surfboard key = {`surfboard${i}`} index = {surfboards.id}>
                    <img src = {SurfboardPic} alt = "surfboard"/>
                    <h5 className = "card-title">{surfboards.brand}</h5>
                    <p className = "card-text">Minimum Weight: {surfboards.userMinWeight}</p>
                    <p className = "card-text">Maximum Weight: {surfboards.userMaxWeight}</p>
                    <p className = "card-text">Width: {surfboards.width}</p>
                    <p className = "card-text">Thickness: {surfboards.thickness}</p>
                    <p className = "card-text">Height: {surfboards.height}</p>
                    <p className = "card-text">Max Swell Size: {surfboards.maxSwell}</p>
                </Surfboard>
            </div>
        </div>
        )
    }

    render(){
        return(
            <div className = 'surfboardList'>
                {this.state.shownSurfboards.map(this.eachSurfboard)}
            </div>
        )
    }
}

export default SurfboardList;