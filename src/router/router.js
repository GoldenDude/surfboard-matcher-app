import React from 'react';
import {Route} from 'react-router-dom';
import Header from '../Header';
import HomePage from '../Components/HomePage';
import Profile from '../Components/Profile'

const path = window.location.pathname === "/Profile" ? "/" : window.location.pathname;

const ReactRouter = () => {
    return (
        <React.Fragment>
            <Header/>
            <Route exact path = {path} component = {HomePage}/>
            <Route path = {`${path}Profile`} component = {Profile}/>
        </React.Fragment>
    )
}

export default ReactRouter;