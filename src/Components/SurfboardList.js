import React, { Component } from 'react';
import Surfboard from './Surfboard';
import SurfboardPic from '../surfboard.png';

class SurfboardList extends Component{
    constructor(props){
        super(props);
        this.allSurfboards = [];
        this.email         =  this.props.email;
        this.name          = this.props.userName;

        this.state = {
            products: this.props.products,
            shownSurfboards: [],
            shown: 8
        }

        this.add                = this.add.bind(this);
        this.nextID             = this.nextID.bind(this);
        this.eachSurfboard      = this.eachSurfboard.bind(this);
        this.addToFav           = this.addToFav.bind(this);
        this.removeFromFav      = this.removeFromFav.bind(this);
        this.loadMore           = this.loadMore.bind(this);
        this.renderProducts     = this.renderProducts.bind(this);
        this.renderMatched      = this.renderMatched.bind(this);
    }

    componentDidMount(){
        let self = this;
        const getAllUrl = 'https://surfboard-matcher.herokuapp.com/getAllSurfboards';
        const getHistoryUrl = `https://surfboard-matcher.herokuapp.com/getHistory?email=${self.email}`;
        let favList;

        if(self.state.products){
            fetch(getAllUrl)
            .then(res => res.json())
                .then(async json => {
                    await fetch(getHistoryUrl).then(res => res.json()).then(json => favList = json);
                    let matched = 0;

                    json.map((surfboard, i) => {
                        let favorite = false;
/*
    Checking if the user's surfboards history appear in the record of all surfboards 
    to indicate in the record of all surfboards the surfboards that are in the user's favorites.
*/
                        if(matched < favList.length){ // if favList is empty 
                            for(let j = 0; j < favList.length; ++j){
                                if(surfboard._id === favList[j]._id){
                                    favorite = true;
                                    ++matched;
                                    break;
                                }
                            }
                        }

                        self.add({id: surfboard._id, brand: surfboard.brand, userMinWeight: surfboard.userMinWeight, userMaxWeight: surfboard.userMaxWeight,
                                width: surfboard.width, thickness: surfboard.thickness, height: surfboard.height, maxSwell: surfboard.maxSwell, favorite: favorite ,i: i});
                        return 0;
                    });
                    
                })
            .catch(err => console.log(err));
        }

        else{
            let surfboard = this.props.children;
            console.log(surfboard[0])
            surfboard.map(surfboard => {
                self.add({id: surfboard.id, brand: surfboard.brand, userMinWeight: surfboard.userMinWeight, userMaxWeight: surfboard.userMaxWeight,
                    width: surfboard.width, thickness: surfboard.thickness, height: surfboard.height, maxSwell: surfboard.maxSwell, favorite: surfboard.favorite});
                    return 0;
            })
        }
    }

    add({id = null, brand = 'default name', userMinWeight = 0, userMaxWeight = 0, width = 0, thickness = 0, height = 0, maxSwell = 0, favorite = false ,i = 0}){
        
        this.allSurfboards.push({
            id: id !== null ? id : this.nextID(this.allSurfboards),
            brand: brand,
            userMinWeight: userMinWeight,
            userMaxWeight: userMaxWeight,
            width: width,
            thickness: thickness,
            height: height,
            maxSwell: maxSwell,
            favorite: favorite
        })

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
                        favorite: favorite
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

    loadMore(){
        let self = this;
        let oldShown = self.state.shown;

        if(oldShown >= self.allSurfboards.length){
            oldShown = self.allSurfboards.length;
            document.body.getElementsByClassName("loadMore")[0].style.display = "none";
            return;
        }

        let newShown = oldShown + 8;
        let surfboard;
        
        self.setState({shown: newShown});

        for(oldShown; oldShown < newShown; ++oldShown){
            surfboard = self.allSurfboards[oldShown];
            this.addToShown(surfboard);
        }  

        if(newShown >= self.allSurfboards.length){
            document.body.getElementsByClassName("loadMore")[0].style.display = "none";
        }

    }

    addToShown(surfboard){
        let self = this;
        self.setState(prevState => ({
            shownSurfboards: [
                ...prevState.shownSurfboards, {
                    id: surfboard.id !== null? surfboard.id : this.nextID(prevState.shownSurfboards),
                    brand: surfboard.brand,
                    userMinWeight: surfboard.userMinWeight,
                    userMaxWeight: surfboard.userMaxWeight,
                    width: surfboard.width,
                    thickness: surfboard.thickness,
                    height: surfboard.height,
                    maxSwell: surfboard.maxSwell,
                    favorite: surfboard.favorite
                }
            ]
        }))
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
            email: this.email
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
        console.log(index);
        const url = `https://surfboard-matcher.herokuapp.com/deleteFromHistory?_id=${index}&email=${this.email}`;

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

    /* at least 2 rows of surfboards */
    renderProducts(){
        document.body.style.height = (this.state.shown / 4) * 720 * 2 + 50 + "px";
        return(
            <div>
                <div className = 'surfboardList'>
                    {this.state.shownSurfboards.map(this.eachSurfboard)}
                    <button className = "loadMore" onClick = {this.loadMore}>Show More!</button>
                </div>
            </div>
        )
    }

    /* height = 720 */
    renderMatched(){
        return(
            <div className = 'surfboardList'>
                {this.state.shownSurfboards.map(this.eachSurfboard)}
            </div>
        )
    }

    render(){
        return this.state.products ? this.renderProducts() : this.renderMatched();
    }
}

export default SurfboardList;