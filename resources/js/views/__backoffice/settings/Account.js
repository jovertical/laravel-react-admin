import React from 'react';

import { Master as MasterLayout } from '../layouts';

function Account(props) {
    const { classes, ...other } = props;

    return (
        <MasterLayout {...other} pageTitle="Account" showBreadcrumbs={false}>
            Account Page
        </MasterLayout>
    );
}

export default Account;
