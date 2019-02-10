import React, { Component } from 'react';
import { MasterTemplate } from '../';

export class Create extends Component {
    render() {
        return (
            <MasterTemplate {...this.props} pageTitle="Create a user">
                Create...
            </MasterTemplate>
        );
    }
}
