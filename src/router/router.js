import React from 'react';
import {Route} from 'react-router-dom';
import Header from '../Header';
import HomePage from '../Components/HomePage';

const path = window.location.pathname;

const ReactRouter = () => {
    return (
        <React.Fragment>
            <Header/>
            <Route exact path = {path} component = {HomePage}/>
        </React.Fragment>
    )
}

export default ReactRouter;