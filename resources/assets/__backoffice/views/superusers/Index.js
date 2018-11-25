import React, { Component } from 'react';
import Master from '../templates/MasterTemplate';

class Index extends Component {
    render() {
        return (
            <Master {...this.props}>
                Superusers List
            </Master>
        );
    }
}

export default Index;