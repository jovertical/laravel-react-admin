import React from 'react';

import { Grid, Link, Typography, withStyles } from '@material-ui/core';

import { Error as ErrorLayout } from '../layouts';

const InternalServer = ({ classes }) => (
    <ErrorLayout>
        <Grid item>
            <Typography variant="h1" color="textPrimary">
                500
            </Typography>
        </Grid>

        <Grid item>
            <Typography variant="h6" color="textSecondary">
                Well, you broke the internet!
            </Typography>
        </Grid>

        <Grid className={classes.break} item />

        <Grid item>
            <Typography align="center" color="textSecondary">
                Just kidding, looks like we have an internal issue,
                <br />
                please try again in couple minutes
            </Typography>
        </Grid>

        <Grid className={classes.spacer} item />

        <Grid item>
            <Link href={null}>Report Problem</Link>
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

export default withStyles(styles)(InternalServer);
