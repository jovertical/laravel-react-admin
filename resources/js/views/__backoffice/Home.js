import React, { Component } from 'react';
import { Typography } from '@material-ui/core';

import { Master as MasterLayout } from './layouts';

class Home extends Component {
    render() {
        const primaryAction = {
            text: 'Export Stats',
            clicked: () => alert('Exporting your awesome stats...'),
        };

        const tabs = [
            {
                name: 'Overview',
                active: true,
            },

            {
                name: 'Monthly',
                active: false,
            },
        ];

        return (
            <MasterLayout
                {...this.props}
                pageTitle={Lang.get('navigation.dashboard')}
                primaryAction={primaryAction}
                tabs={tabs}
                breadcrumbs={[]}
            >
                <Typography>There is no place like home</Typography>
            </MasterLayout>
        );
    }
}

export default Home;
