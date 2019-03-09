import React, { Component } from 'react';
import { BackofficeLayout } from '../../';

export class Edit extends Component {
    render() {
        const { params } = this.props.match;

        return (
            <BackofficeLayout {...this.props} pageTitle="Edit user">
                <h1>Edit user: {params.id}</h1>
            </BackofficeLayout>
        );
    }
}
