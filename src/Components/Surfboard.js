import React, { Component } from "react";
import {MdFavoriteBorder}   from 'react-icons/md';
import {MdFavorite}         from 'react-icons/md';

class Surfboard extends Component{
    constructor(props){
        super(props);
        
        this.state = {
            favorite: this.props.favorite
        }

        this.addToFav       = this.addToFav.bind(this);
        this.renderRegular  = this.renderRegular.bind(this);
        this.removeFromFav  = this.removeFromFav.bind(this);
        this.renderFavorite = this.renderFavorite.bind(this);
    }

    addToFav(){
        this.props.onAdd(this.props.index, this);
    }

    removeFromFav(){
        this.props.onRemove(this.props.index, this);
    }

    renderFavorite(){
        return(
            <span>
                <button onClick = {this.removeFromFav} className = "btn btn-primary addToFav"><MdFavorite className = "Heart"/>Favorite</button>
            </span>
       )
    }

    renderRegular(){
        return(
            <span>
                <button onClick = {this.addToFav} className = "btn btn-primary addToFav nonFav"><MdFavoriteBorder className = "Heart"/>Add To Favorites</button>
            </span>
       )
    }

    render(){
        return (
            <div className = "surfboard">
                {this.props.children}
                {this.state.favorite ? this.renderFavorite() : this.renderRegular()}
            </div>
        )
    }
}

export default Surfboard;