import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

export default class MainRouter extends Component {
    render() {
        return(
            <Router>
                {/* <div>
                    <Route exact path="/" component={Home} />
                </div> */}
            </Router>
        )
    }
}