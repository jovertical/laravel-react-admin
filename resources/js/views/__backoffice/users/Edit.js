import React, { Component } from 'react';

import { Master as MasterLayout } from '../layouts';

class Edit extends Component {
    render() {
        const { params } = this.props.match;

        return (
            <MasterLayout {...this.props} pageTitle="Edit user" tabs={[]}>
                Edit user: {params.id}
            </MasterLayout>
        );
    }
}

export default Edit;
