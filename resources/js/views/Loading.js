import React, { useContext } from 'react';
import { withStyles, Grid, CircularProgress } from '@material-ui/core';

import darkLogo from '../../img/logos/short-dark.svg';
import lightLogo from '../../img/logos/short-light.svg';
import { AppContext } from '../AppContext';

const Loading = props => {
    const { nightMode } = useContext(AppContext);

    return (
        <Grid
            container
            justify="center"
            alignItems="center"
            className={props.classes.container}
        >
            <Grid item>
                <Grid item className={props.classes.logoContainer}>
                    <img
                        src={nightMode ? darkLogo : lightLogo}
                        alt="company-logo"
                        className={props.classes.logo}
                    />
                </Grid>

                <Grid item className={props.classes.loadingContainer}>
                    <CircularProgress color="primary" />
                </Grid>
            </Grid>
        </Grid>
    );
};

const styles = theme => ({
    container: {
        height: '100vh',
    },

    logoContainer: {
        padding: 12,
        textAlign: 'center',
    },

    logo: {
        width: 80,
        height: 80,
    },

    loadingContainer: {
        padding: 12,
        textAlign: 'center',
    },
});

export default withStyles(styles)(Loading);
