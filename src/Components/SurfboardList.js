import React, { Component } from 'react';
import consts               from '../consts';
import Surfboard            from './Surfboard';
import SurfboardPic         from '../surfboard.png';

class SurfboardList extends Component{
    constructor(props){
        super(props);
        this.allSurfboards = [];
        this.email         = this.props.email;
        this.socket        = this.props.socket;

        this.state = {
            shownSurfboards: [],
            products: this.props.products,
            shown: this.props.products ? consts.PRODUCTS_SHOWN : this.props.children.length
        }

        this.add                = this.add.bind(this);
        this.nextID             = this.nextID.bind(this);
        this.loadMore           = this.loadMore.bind(this);
        this.addToFav           = this.addToFav.bind(this);
        this.addToShown         = this.addToShown.bind(this);
        this.removeFromFav      = this.removeFromFav.bind(this);
        this.eachSurfboard      = this.eachSurfboard.bind(this);
        this.renderMatched      = this.renderMatched.bind(this);
        this.renderProducts     = this.renderProducts.bind(this);
        this.handleFavChange    = this.handleFavChange.bind(this);
    }

    componentDidMount(){
        let self = this;
        const getAllUrl = `${consts.SERVICE_URL}/getAllSurfboards`;
        const getHistoryUrl = `${consts.SERVICE_URL}/getHistory?email=${self.email}`;
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
                            Checking if the user's surfboards history appear in the list of all surfboards 
                            to indicate in the list of all surfboards the surfboards that are in the user's favorites.
                        */
                        if(matched < favList.length){ // if favList is not empty 
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
            surfboard.map(surfboard => {
                self.add({id: surfboard.id, brand: surfboard.brand, userMinWeight: surfboard.userMinWeight, userMaxWeight: surfboard.userMaxWeight,
                    width: surfboard.width, thickness: surfboard.thickness, height: surfboard.height, maxSwell: surfboard.maxSwell, favorite: surfboard.favorite});
                    return 0;
            })
        }

        this.socket.on('favChange', data => {
            this.handleFavChange(data.email, data.id);
        })
    }

    add({id = null, brand = 'default name', userMinWeight = 0, userMaxWeight = 0, width = 0, thickness = 0, height = 0, maxSwell = 0, favorite = false ,i = 0}){
        
        let surfboard = {
            id: id !== null ? id : this.nextID(this.allSurfboards),
            brand: brand,
            userMinWeight: userMinWeight,
            userMaxWeight: userMaxWeight,
            width: width,
            thickness: thickness,
            height: height,
            maxSwell: maxSwell,
            favorite: favorite
        }

        this.allSurfboards.push(surfboard);

        if(i < this.state.shown){
            this.addToShown(surfboard);
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

    handleFavChange(email, id){
        let self = this;
        if(self.email === email){
            for(let i = 0; i < self.allSurfboards.length; ++i){
                if(id === self.allSurfboards[i].id){
                    self.allSurfboards[i].favorite = !self.allSurfboards[i].favorite;

                    if(i < this.state.shownSurfboards.length){
                        this.setState({shownSurfboards: []});
                        for(let i = 0; i < this.state.shown; ++i){
                            this.addToShown(this.allSurfboards[i]);
                        }
                    }
                    break;
                }
            }
        }

        else{
            console.log("Nothing to do");
            return;
        }
    }

    loadMore(){
        let self = this;
        let oldShown = self.state.shown;

        if(oldShown >= self.allSurfboards.length){
            document.body.getElementsByClassName("loadMore")[0].style.display = "none";
            return;
        }

        let newShown;
        if(oldShown + consts.PRODUCTS_SHOWN > self.allSurfboards.length){
            newShown = self.allSurfboards.length;
        }
        else newShown = oldShown + consts.PRODUCTS_SHOWN;

        let surfboard;
        
        for(oldShown; oldShown < newShown; ++oldShown){
            surfboard = self.allSurfboards[oldShown];
            this.addToShown(surfboard);
        }  
        
        if(newShown >= self.allSurfboards.length){
            document.body.getElementsByClassName("loadMore")[0].style.display = "none";
        }
        
        self.setState({shown: newShown});
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
        const url = `${consts.SERVICE_URL}/addUserSurfboard`;
        let surfboardToAdd;

        /* Finding the surfboard in the state */
        this.state.shownSurfboards.map( shownSurfboard => {
            if(shownSurfboard.id === index)
                surfboardToAdd = shownSurfboard;

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
                    if(json.result === "Success"){
                        surfboard.setState({favorite: true});
                        this.socket.emit('favChange', {email: this.email, id: surfboardToAdd.id});
                    }   
                })
            .catch(err => console.log(err));
        }
    }

    removeFromFav(index, surfboard){
        const url = `${consts.SERVICE_URL}/deleteFromHistory?_id=${index}&email=${this.email}`;

        fetch(url, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
            },
        }).then(res => res.json())
            .then(json => { 
                if(json.result === "Success"){
                    surfboard.setState({favorite: false});
                    this.socket.emit('favChange', {email: this.email, id: index});
                }   
            })
        .catch(err => console.log(err));
    }

    /* at least 2 rows of surfboards */
    renderProducts(){
        document.body.style.height = (this.state.shown / 4) * 720 + 2985 + "px";
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