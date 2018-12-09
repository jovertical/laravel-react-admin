import React, { Component } from 'react';
import MasterTemplate from './templates/MasterTemplate';

class Dashboard extends Component {
    render() {
        return (
            <MasterTemplate {...this.props} pageTitle="Dashboard">
                Dashboard
            </MasterTemplate>
        );
    }
}

export default Dashboard;
