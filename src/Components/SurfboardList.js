import React, { Component } from 'react';
import Surfboard from './Surfboard';
import SurfboardPic from '../surfboard.png'


class SurfboardList extends Component{
    constructor(props){
        super(props);
        
        this.state = {
            allSurfboards: [],
            shownSurfboards: [],
            email: this.props.email,
            name: this.props.name,
            shown: 20
        }

        this.add           = this.add.bind(this);
        this.nextID        = this.nextID.bind(this);
        this.eachSurfboard = this.eachSurfboard.bind(this);
        this.addToFav      = this.addToFav.bind(this);
        this.removeFromFav = this.removeFromFav.bind(this);
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
                    id: id !== null ? id : this.nextID(prevState.allSurfboards),
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
                        maxSwell: maxSwell,
                        favorite: false
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
            <div className = "card" key = {`container${i}`}>
                <div className = "card-body">
                    <Surfboard key = {`surfboard${i}`} index = {surfboards.id} onAdd = {this.addToFav} onRemove = {this.removeFromFav} favorite = {surfboards.favorite}>
                        <img src = {SurfboardPic} alt = "surfboard"/>
                        <h5 className = "card-title">{surfboards.brand}</h5>
                        <p className  = "card-text">Minimum Weight: {surfboards.userMinWeight}kg</p>
                        <p className  = "card-text">Maximum Weight: {surfboards.userMaxWeight}kg</p>
                        <p className  = "card-text">Width: {surfboards.width}cm</p>
                        <p className  = "card-text">Thickness: {surfboards.thickness}cm</p>
                        <p className  = "card-text">Height: {surfboards.height}cm</p>
                        <p className  = "card-text">Max Swell Size: {surfboards.maxSwell}m</p>
                    </Surfboard>
                </div>
            </div>
        )
    }

    addToFav(index, surfboard){
        const url = 'https://surfboard-matcher.herokuapp.com/addUserSurfboard';
        let surfboardToAdd;

        /* Finding the surfboard in the state */
        this.state.shownSurfboards.map( surfboard => {
            if(surfboard.id === index)
                surfboardToAdd = surfboard;

            return null;
        })

        const json = {
            surfboard: {
                _id:            surfboardToAdd.id,
                brand:          surfboardToAdd.brand,
                userMinWeight:  surfboardToAdd.userMinWeight,
                userMaxWeight:  surfboardToAdd.userMaxWeight,
                width:          surfboardToAdd.width,
                thickness:      surfboardToAdd.thickness,
                height:         surfboardToAdd.height,
                maxSwell:       surfboardToAdd.maxSwell 
            },
            email: this.state.email
        }

        if(surfboardToAdd){
            fetch(url, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(json)
            }).then(res => res.json())
                .then(json => {
                    console.log(JSON.stringify(json));  
                    if(json.result === "Success"){
                        surfboard.setState({favorite: true});
                    }   
                })
            .catch(err => console.log(err));
        }
    }

    removeFromFav(index, surfboard){
        const url = `https://surfboard-matcher.herokuapp.com/deleteFromHistory?_id=${index}&email=${this.state.email}`;

        fetch(url, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
            },
        }).then(res => res.json())
            .then(json => {
                console.log(JSON.stringify(json));  
                if(json.result === "Success"){
                    surfboard.setState({favorite: false});
                }   
            })
        .catch(err => console.log(err));
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