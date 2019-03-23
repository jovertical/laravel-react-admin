import React from 'react';
import { withStyles, Grid } from '@material-ui/core';

const Error = props => (
    <Grid
        container
        justify="center"
        alignItems="center"
        className={props.classes.root}
    >
        <Grid item>{props.children}</Grid>
    </Grid>
);

const styles = theme => ({
    root: {
        minHeight: '100vh',
    },
});

export default withStyles(styles)(Error);
