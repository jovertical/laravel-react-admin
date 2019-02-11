import React, { Component } from 'react';
import { Typography } from '@material-ui/core';

import { MasterTemplate } from './';

export class Home extends Component {
    render() {
        return (
            <MasterTemplate {...this.props} pageTitle="Dashboard">
                <Typography>There is no place like home</Typography>
            </MasterTemplate>
        );
    }
}
