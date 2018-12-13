import React, { Component } from 'react';
import { Templates } from './';

class Dashboard extends Component {
    render() {
        return (
            <Templates.Master {...this.props} pageTitle="Dashboard">
                Dashboard
            </Templates.Master>
        );
    }
}

export default Dashboard;
