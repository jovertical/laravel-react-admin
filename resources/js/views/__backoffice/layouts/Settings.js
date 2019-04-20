import React from 'react';
import PropTypes from 'prop-types';

import { Grid, Hidden, withStyles } from '@material-ui/core';

import { Navigation } from '../settings';

function Settings(props) {
    const { classes, children, navigationProps } = props;
    const { formVisible } = navigationProps;

    return (
        <div className={classes.root}>
            <Grid
                container
                spacing={16}
                justify="center"
                className={classes.content}
            >
                <Hidden mdUp>
                    {!formVisible && <Navigation {...navigationProps} />}
                </Hidden>

                <Hidden smDown>
                    <Navigation {...navigationProps} />
                </Hidden>

                {children}
            </Grid>
        </div>
    );
}

Settings.propTypes = {
    classes: PropTypes.object.isRequired,
    navigationProps: PropTypes.object.isRequired,
};

const styles = theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
    },

    content: {
        width: '85%',
        marginTop: theme.spacing.unit * 3,
        minHeight: '75vh',
    },
});

export default withStyles(styles)(Settings);
