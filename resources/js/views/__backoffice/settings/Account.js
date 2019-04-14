import React from 'react';

import { Typography } from '@material-ui/core';

import { Clean as CleanLayout } from '../layouts';

function Account(props) {
    const { classes, ...other } = props;

    return (
        <CleanLayout {...other} pageTitle="Account" loading={false}>
            <Typography>Account Page</Typography>
        </CleanLayout>
    );
}

export default Account;
