import React, { Component } from 'react';
import { MasterTemplate } from '../';

export class Edit extends Component {
    render() {
        const { params } = this.props.match;

        return (
            <MasterTemplate {...this.props} pageTitle="Edit user">
                <h1>Edit user: {params.id}</h1>
            </MasterTemplate>
        );
    }
}
