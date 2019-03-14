import React, { Component } from 'react';
import { MasterLayout } from '../';

export class Edit extends Component {
    render() {
        const { params } = this.props.match;

        return (
            <MasterLayout {...this.props} pageTitle="Edit user">
                <h1>Edit user: {params.id}</h1>
            </MasterLayout>
        );
    }
}
