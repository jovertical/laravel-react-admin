import React, { Component } from 'react';
import { Typography } from '@material-ui/core';

import { MasterLayout } from './';

export class Home extends Component {
    render() {
        const primaryAction = {
            text: 'Export Stats',
            clicked: () => alert('Exporting your awesome stats...'),
        };

        const tabs = [
            {
                name: 'Stats',
                active: true,
            },
        ];

        return (
            <MasterLayout
                {...this.props}
                pageTitle={Lang.get('navigation.dashboard')}
                primaryAction={primaryAction}
                tabs={tabs}
            >
                <Typography>There is no place like home</Typography>
            </MasterLayout>
        );
    }
}
