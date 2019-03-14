import React, { Component } from 'react';
import { Typography } from '@material-ui/core';

import { BackofficeLayout } from '../';

export class Home extends Component {
    render() {
        return (
            <BackofficeLayout
                {...this.props}
                pageTitle={Lang.get('navigation.dashboard')}
            >
                <Typography>There is no place like home</Typography>
            </BackofficeLayout>
        );
    }
}
