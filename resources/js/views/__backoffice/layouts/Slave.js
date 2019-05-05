import React from 'react';
import PropTypes from 'prop-types';

import {
    AppBar,
    colors,
    CircularProgress,
    CssBaseline,
    Grid,
    IconButton,
    Toolbar,
    Tooltip,
    Typography,
    withStyles,
} from '@material-ui/core';

import { ArrowBack as ArrowBackIcon } from '@material-ui/icons';

import { LinearDeterminate } from '../../../ui/Loaders';
import { Skeleton, Snackbar } from '../../../ui';

function Slave(props) {
    const { classes, ...other } = props;
    const { history, location, loading, message, pageTitle } = props;

    const skeletonProps = {
        color: colors.grey[400],
        highlightColor: colors.grey[200],
    };

    const renderLoading = (
        <Grid
            container
            className={classes.root}
            justify="center"
            alignItems="center"
        >
            <Grid item>
                <CircularProgress color="primary" />
            </Grid>
        </Grid>
    );

    const renderNavigating = (
        <>
            <AppBar
                color="primary"
                position="sticky"
                elevation={0}
                className={classes.header}
            >
                <Toolbar>
                    <Grid container spacing={8} alignItems="center">
                        <Grid item>
                            <Skeleton
                                {...skeletonProps}
                                height={25}
                                width={25}
                            />
                        </Grid>

                        <Grid item>
                            <Skeleton
                                {...skeletonProps}
                                height={30}
                                width={75 + pageTitle.length * 2}
                            />
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>

            <main className={classes.content}>{renderLoading}</main>
        </>
    );

    const renderNavigated = (
        <>
            <AppBar
                color="primary"
                position="sticky"
                elevation={0}
                className={classes.header}
            >
                <Toolbar>
                    <Grid container spacing={8} alignItems="center">
                        <Grid item>
                            <Tooltip title={Lang.get('actions.back')}>
                                <IconButton
                                    color="inherit"
                                    aria-label={Lang.get('actions.back')}
                                    onClick={() =>
                                        history.push(
                                            `${location.pathname}?hidden`,
                                        )
                                    }
                                    className={classes.backButton}
                                >
                                    <ArrowBackIcon />
                                </IconButton>
                            </Tooltip>
                        </Grid>

                        <Grid item>
                            <Typography color="inherit" variant="h5">
                                {pageTitle}
                            </Typography>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>

            <main className={classes.content}>{props.children}</main>
        </>
    );

    return (
        <>
            {loading && <LinearDeterminate className={classes.loader} />}

            <div className={classes.root}>
                <CssBaseline />

                <div className={classes.contentWrapper}>
                    {loading ? renderNavigating : renderNavigated}
                </div>
            </div>

            {message && message.hasOwnProperty('type') && (
                <Snackbar {...message} />
            )}
        </>
    );
}

Slave.propTypes = {
    classes: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,

    pageTitle: PropTypes.string,
    loading: PropTypes.bool,
    message: PropTypes.object,
};

Slave.defaultProps = {
    pageTitle: '',
    loading: false,
    message: {},
};

const styles = theme => ({
    root: {
        display: 'flex',
        position: 'relative',
        minHeight: '100vh',
        maxWidth: '100%',
    },

    contentWrapper: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'scroll',
    },

    header: {
        paddingTop: 8,
        paddingBottom: 8,
    },

    backButton: {
        marginLeft: -theme.spacing.unit,
    },

    content: {
        flex: 1,
        padding: `0 ${theme.spacing.unit}px`,
        marginBottom: 75,
        marginLeft: 0,
        [theme.breakpoints.up('sm')]: {
            marginBottom: 50,
            padding: `${theme.spacing.unit}px ${theme.spacing.unit * 3}px`,
        },
    },
});

export default withStyles(styles)(Slave);
