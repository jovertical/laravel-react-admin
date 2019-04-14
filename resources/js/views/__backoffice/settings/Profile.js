import React from 'react';

import { Typography } from '@material-ui/core';

import { Clean as CleanLayout } from '../layouts';

function Profile(props) {
    const { classes, ...other } = props;

    return (
        <CleanLayout {...other} pageTitle="Profile" loading={false}>
            <Typography>Profile Page</Typography>
        </CleanLayout>
    );
}

export default Profile;
