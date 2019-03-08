import React, { Component } from 'react';
import { BackofficeTemplate } from '../../';

export class Create extends Component {
    render() {
        return (
            <BackofficeTemplate {...this.props} pageTitle="Create a user">
                Create...
            </BackofficeTemplate>
        );
    }
}
