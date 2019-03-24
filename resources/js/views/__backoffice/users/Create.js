import React, { Component } from 'react';

import { Master as MasterLayout } from '../layouts';

class Create extends Component {
    render() {
        return (
            <MasterLayout {...this.props} pageTitle="Create a user" tabs={[]}>
                Create...
            </MasterLayout>
        );
    }
}

export default Create;
