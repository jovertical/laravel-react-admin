import React from 'react';
import { withStyles, Grid } from '@material-ui/core';

const Error = ({ classes, children }) => (
    <Grid
        className={classes.root}
        container
        direction="column"
        justify="center"
        alignItems="center"
        spacing={4}
    >
        {children}
    </Grid>
);

const styles = theme => ({
    root: {
        minHeight: '100vh',
    },
});

export default withStyles(styles)(Error);
