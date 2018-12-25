import React, { Component } from 'react';
import { Templates } from '../';

class Create extends Component {
    render() {
        return (
            <Templates.Master {...this.props} pageTitle="Create user">
                <h1>Create a new user</h1>
            </Templates.Master>
        );
    }
}

export default Create;
