import React, { Component } from 'react';
import './footer.css';
import { Fa } from 'mdbreact';

export default class Footer extends Component {
    render() {
        return (
            <div className="footer">
                <div className="row footer-row-1">
                    <div className="col-md-3">
                        <img className="footer-logo" src={require('../../assets/images/React-Logo-Trans.png')}></img>
                    </div>
                    <div className="col-md-3">
                        <h5>GoPro-MDb</h5>
                        <p>Movies - Cinemas VN Forums</p>
                    </div>
                    <div className="col-md-3">
                        <h5>Development Stack</h5>
                        <ul>
                            <li>ReactJS</li>
                            <li>Node.js - ExpressJS</li>
                            <li>MySQL</li>
                        </ul>
                    </div>
                    <div className="col-md-3">
                        <h5>Sponsored</h5>
                        <ul>
                            <li>GoPro Teams</li>
                            <li>HUST</li>
                        </ul>
                    </div>
                </div>
                <div className="row footer-row-2">
                    <h6>Copyright © 2019 GoPro Teams</h6>
                </div>
            </div>
        )
    }
}