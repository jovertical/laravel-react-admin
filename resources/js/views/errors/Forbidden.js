import React from 'react';

import { Grid, Link, Typography, withStyles } from '@material-ui/core';

import { Error as ErrorLayout } from '../layouts';

const Forbidden = ({ classes }) => (
    <ErrorLayout>
        <Grid item>
            <Typography variant="h1" color="textPrimary">
                403
            </Typography>
        </Grid>

        <Grid item>
            <Typography variant="h6" color="textSecondary">
                You shouldn't be here!
            </Typography>
        </Grid>

        <Grid className={classes.break} item />

        <Grid item>
            <Typography align="center" color="textSecondary">
                You are not allowed to visit this page. Contact your <br />
                administrator for more information
            </Typography>
        </Grid>

        <Grid className={classes.spacer} item />

        <Grid item>
            <Link href={null}>Contact Administrator</Link>
        </Grid>

        <Grid item>
            <Link href="#">Go Home</Link>
        </Grid>
    </ErrorLayout>
);

const styles = theme => ({
    spacer: {
        height: theme.spacing.unit * 4,
    },

    break: {
        height: theme.spacing.unit * 2,
    },
});

export default withStyles(styles)(Forbidden);
