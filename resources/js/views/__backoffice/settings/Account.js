import React, { useState, useEffect } from 'react';

import { Grid, Hidden, Paper, Typography, withStyles } from '@material-ui/core';

import * as UrlUtils from '../../../utils/URL';
import {
    Clean as CleanLayout,
    Settings as SettingsLayout,
    Slave as SlaveLayout,
} from '../layouts';

function Account(props) {
    const { classes, ...other } = props;
    const { location } = props;
    const [formVisible, setFormVisibility] = useState(false);

    useEffect(() => {
        const queryParams = UrlUtils._queryParams(location.search);

        if (queryParams.hasOwnProperty('visible')) {
            setFormVisibility(true);
        } else if (queryParams.hasOwnProperty('hidden')) {
            setFormVisibility(false);
        }
    });

    const renderForm = (
        <Grid item md={8} sm={12} xs={12}>
            <Paper className={classes.form}>
                <Typography>Account Page</Typography>
            </Paper>
        </Grid>
    );

    const renderBody = (
        <SettingsLayout
            navigationProps={{
                ...other,
                formVisible,
                setFormVisibility: () => setFormVisibility(!formVisible),
            }}
        >
            <Hidden mdUp>{formVisible && renderForm}</Hidden>

            <Hidden smDown>{renderForm}</Hidden>
        </SettingsLayout>
    );

    if (formVisible) {
        return (
            <SlaveLayout {...other} pageTitle="Account" loading={false}>
                {renderBody}
            </SlaveLayout>
        );
    }

    return (
        <CleanLayout {...other} pageTitle="Account" loading={false}>
            {renderBody}
        </CleanLayout>
    );
}

const styles = theme => ({
    form: {
        padding: theme.spacing.unit * 3,
        minHeight: '100%',
    },
});

export default withStyles(styles)(Account);
