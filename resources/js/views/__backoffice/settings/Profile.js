import React from 'react';

import { Master as MasterLayout } from '../layouts';

function Profile(props) {
    const { classes, ...other } = props;

    return (
        <MasterLayout {...other} pageTitle="Profile" showBreadcrumbs={false}>
            Profile Page
        </MasterLayout>
    );
}

export default Profile;
