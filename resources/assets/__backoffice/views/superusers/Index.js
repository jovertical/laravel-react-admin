import React, { Component } from 'react';
import Master from '../templates/MasterTemplate';

class Index extends Component {
    render() {
        return (
            <Master {...this.props}>
                <h2>Superusers List</h2>
            </Master>
        );
    }
}

export default Index;