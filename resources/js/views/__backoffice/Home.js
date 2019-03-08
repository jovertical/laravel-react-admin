import React, { Component } from 'react';
import { Typography } from '@material-ui/core';

import { BackofficeTemplate } from '../';

export class Home extends Component {
    render() {
        return (
            <BackofficeTemplate {...this.props} pageTitle="Dashboard">
                <Typography>There is no place like home</Typography>
            </BackofficeTemplate>
        );
    }
}
