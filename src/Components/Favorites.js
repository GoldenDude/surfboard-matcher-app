import React, { Component } from "react";
import SurfboardList from './SurfboardList';

class Favorites extends Component{

    constructor(props){
        super(props);
        
        this.surfboards = [];
        this.email = this.props.email;
        this.socket = this.props.socket;

        this.state = {
            loaded: false
        }

        this.add             = this.add.bind(this);
        this.nextID          = this.nextID.bind(this);
        this.loadFavorite    = this.loadFavorite.bind(this);
        this.handleFavChange = this.handleFavChange.bind(this);
    }

    componentDidMount(){
       this.loadFavorite();

        this.socket.on('favChange', data => {
            this.handleFavChange(data.email);
        });
    }

    loadFavorite(){
        let self = this;
        const getHistoryUrl = `https://surfboard-matcher.herokuapp.com/getHistory?email=${self.email}`;

        fetch(getHistoryUrl).then(res => res.json())
                              .then(json => {
                                    this.surfboards = [];
                                    this.setState({loaded: false});
                                    json.map(surfboard => {
                                        self.add({id: surfboard._id, brand: surfboard.brand, userMinWeight: surfboard.userMinWeight, userMaxWeight: surfboard.userMaxWeight,
                                            width: surfboard.width, thickness: surfboard.thickness, height: surfboard.height, maxSwell: surfboard.maxSwell, favorite: true});
                                        return 0;
                                    })
                                this.setState({loaded: true});
                              })
        .catch(err => console.log(err));
    }

    handleFavChange(email){

        if(this.email === email){
            this.loadFavorite();
        }

        else {
            console.log("Nothing to do!");
            return;
        }
    }

    add({id = null, brand = 'default name', userMinWeight = 0, userMaxWeight = 0, width = 0, thickness = 0, height = 0, maxSwell = 0, favorite = false}){
        this.surfboards.push({
                    id:id !== null ? id : this.nextID(this.surfboards),
                    brand: brand,
                    userMinWeight: userMinWeight,
                    userMaxWeight: userMaxWeight,
                    width: width,
                    thickness: thickness,
                    height: height,
                    maxSwell: maxSwell,
                    favorite: favorite
                })
    }

    nextID(surfboards = []){
        let max = surfboards.reduce((prev, curr) => prev.id > curr.id ? prev.id :  curr.id, 0);
        return ++max;
    }

    render(){
        return this.state.loaded ? 
            <div className = "favorites container">
                <SurfboardList email = {this.email} products = {false} socket = {this.socket} key = {2}>
                    {this.surfboards}
                </SurfboardList>
            </div>
        :   
        null
            
    }
}

export default Favorites;