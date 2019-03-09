import React, { Component } from 'react';
import { BackofficeLayout } from '../../';

export class Create extends Component {
    render() {
        return (
            <BackofficeLayout {...this.props} pageTitle="Create a user">
                Create...
            </BackofficeLayout>
        );
    }
}
