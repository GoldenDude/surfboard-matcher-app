import React from 'react';
import {Route} from 'react-router-dom';
import Header from '../Header';
import Login from '../Components/Login';

const path = window.location.pathname === "/Search" ? "/" : window.location.pathname;

const ReactRouter = () => {
    return (
        <React.Fragment>
            <Header/>
            <Route exact path = {path} component = {Login}/>
            {/* <Route path = {`${path}Search`} component = {SearchForm}/> */}
        </React.Fragment>
    )
}

export default ReactRouter;