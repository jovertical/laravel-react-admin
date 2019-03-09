import React, { Component } from 'react';
import { Typography } from '@material-ui/core';

import { BackofficeLayout } from '../';

export class Home extends Component {
    render() {
        return (
            <BackofficeLayout {...this.props} pageTitle="Dashboard">
                <Typography>There is no place like home</Typography>
            </BackofficeLayout>
        );
    }
}
