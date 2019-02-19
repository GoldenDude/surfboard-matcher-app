import React, { Component } from "react";
import SurfboardList from './SurfboardList';

class Favorites extends Component{

    constructor(props){
        super(props);
        
        this.email = this.props.email;
        this.surfboards = [];
        
        this.state = {
            loaded: false
        }

        this.add    = this.add.bind(this);
        this.nextID = this.nextID.bind(this);
    }

    componentWillMount(){
        let self = this;
        const getHistoryUrl = `https://surfboard-matcher.herokuapp.com/getHistory?email=${self.email}`;

        fetch(getHistoryUrl).then(res => res.json())
                              .then(json => {
                                     json.map(surfboard => {
                                        self.add({id: surfboard._id, brand: surfboard.brand, userMinWeight: surfboard.userMinWeight, userMaxWeight: surfboard.userMaxWeight,
                                            width: surfboard.width, thickness: surfboard.thickness, height: surfboard.height, maxSwell: surfboard.maxSwell, favorite: true});
                                        return 0;
                                    })
                                this.setState({loaded: true});
                              })
        .catch(err => console.log(err));
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
        (
            <div className = "favorites container">
                <SurfboardList email = {this.email} products = {false}  key = {2}>
                    {this.surfboards}
                </SurfboardList>
            </div>
        )
        
        :   
        
        (null)
            
    }
}

export default Favorites;