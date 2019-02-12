import React, { Component } from "react";
import {MdFavoriteBorder} from 'react-icons/md';
import {MdFavorite} from 'react-icons/md';

class Surfboard extends Component{
    constructor(props){
        super(props);
        this.state = {
            favorite: false
        }

        this.renderFavorite = this.renderFavorite.bind(this);
        this.renderRegular  = this.renderRegular.bind(this);
        this.addToFav       = this.addToFav.bind(this);
        this.removeFromFav  = this.removeFromFav.bind(this);
    }

    addToFav(){
        this.props.onAdd(this.props.index)
        this.setState({
            favorite: true
        })
    }

    removeFromFav(){
        /* need to add code that will remove the surfboard from the user's history. */ 
        this.setState({
            favorite: false
        })
    }

    renderFavorite(){
        return(
            <div className = "surfboard">
                   {this.props.children}
                   <span>
                       <button onClick = {this.removeFromFav} className = "btn btn-primary addToFav"><MdFavorite className = "Heart"/>Favorited</button>
                   </span>
               </div>
       )
    }

    renderRegular(){
        return(
            <div className = "surfboard">
                   {this.props.children}
                   <span>
                       <button onClick = {this.addToFav} className = "btn btn-primary addToFav nonFav"><MdFavoriteBorder className = "Heart"/>Add To Favorites</button>
                   </span>
               </div>
       )
    }

    render(){
        return this.state.favorite ? this.renderFavorite() : this.renderRegular();
    }
}

export default Surfboard;