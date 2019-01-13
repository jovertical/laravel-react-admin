import React, { Component } from 'react';
import { MasterTemplate } from './';

export class Home extends Component {
    render() {
        return (
            <MasterTemplate {...this.props} pageTitle="Dashboard">
                Dashboard
            </MasterTemplate>
        );
    }
}
