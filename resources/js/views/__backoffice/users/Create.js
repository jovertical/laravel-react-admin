import React, { Component } from 'react';
import { MasterLayout } from '../';

export class Create extends Component {
    render() {
        return (
            <MasterLayout {...this.props} pageTitle="Create a user">
                Create...
            </MasterLayout>
        );
    }
}
