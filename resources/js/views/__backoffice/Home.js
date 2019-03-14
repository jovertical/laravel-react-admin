import React, { Component } from 'react';
import { Typography } from '@material-ui/core';

import { MasterLayout } from './';

export class Home extends Component {
    render() {
        return (
            <MasterLayout
                {...this.props}
                pageTitle={Lang.get('navigation.dashboard')}
            >
                <Typography>There is no place like home</Typography>
            </MasterLayout>
        );
    }
}
