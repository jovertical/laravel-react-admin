import React, { Component } from 'react';
import { Templates } from '../';

class Edit extends Component {
    render() {
        const { params } = this.props.match;

        return (
            <Templates.Master {...this.props} pageTitle="Edit user">
                <h1>Edit user: {params.id}</h1>
            </Templates.Master>
        );
    }
}

export default Edit;
