import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
    CircularProgress,
    CssBaseline,
    Grid,
    Hidden,
    withStyles,
} from '@material-ui/core';
import classNames from 'classnames';

import { Snackbar } from '../../../ui';
import { LinearDeterminate } from '../../../ui/Loaders';
import { Footer, Header, Sidebar } from '../partials';

function Clean(props) {
    const { classes, ...other } = props;
    const { history, loading, message } = props;

    const [drawerOpen, setDrawer] = useState(false);
    const [localeMenuOpen, setLocaleMenu] = useState(false);
    const [accountMenuOpen, setAccountMenu] = useState(false);

    const sidebarProps = Object.assign(other, {
        navigate: path => history.push(path),
        PaperProps: { style: { width: drawerWidth } },
        open: drawerOpen,
        onClose: () => setDrawer(!drawerOpen),
    });

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

    return (
        <>
            {loading && <LinearDeterminate className={classes.loader} />}

            <div className={classes.root}>
                <CssBaseline />

                <nav className={classes.drawer}>
                    <Hidden smUp implementation="js">
                        <Sidebar {...sidebarProps} variant="temporary" />
                    </Hidden>

                    <Hidden xsDown implementation="css">
                        <Sidebar {...sidebarProps} variant="persistent" />
                    </Hidden>
                </nav>

                <div className={classes.contentWrapper}>
                    <Header
                        {...other}
                        variant="slim"
                        drawerOpen={drawerOpen}
                        accountMenuOpen={accountMenuOpen}
                        localeMenuOpen={localeMenuOpen}
                        onDrawerToggle={() => setDrawer(!drawerOpen)}
                        onLocaleMenuToggle={() =>
                            setLocaleMenu(!localeMenuOpen)
                        }
                        onAccountMenuToggle={() =>
                            setAccountMenu(!accountMenuOpen)
                        }
                    />

                    <main
                        className={classNames(classes.content, {
                            [classes.contentShift]: drawerOpen,
                        })}
                    >
                        {loading ? renderLoading : props.children}
                    </main>
                </div>

                <Footer />
            </div>

            {message && message.hasOwnProperty('type') && (
                <Snackbar {...message} />
            )}
        </>
    );
}

Clean.propTypes = {
    classes: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,

    pageTitle: PropTypes.string,
    loading: PropTypes.bool,
    message: PropTypes.object,
};

Clean.defaultProps = {
    pageTitle: '',
    loading: false,
    message: {},
};

const drawerWidth = 256;

const styles = theme => ({
    loader: {
        zIndex: 9999,
    },

    root: {
        display: 'flex',
        position: 'relative',
        minHeight: '100vh',
        maxWidth: '100%',
    },

    drawer: {
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },

    contentWrapper: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'auto',
    },

    content: {
        flex: 1,
        padding: `0 ${theme.spacing.unit}px`,
        marginBottom: 75,
        marginLeft: 0,
        [theme.breakpoints.up('sm')]: {
            padding: `${theme.spacing.unit}px ${theme.spacing.unit * 3}px`,
        },
    },

    contentShift: {
        [theme.breakpoints.up('sm')]: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: drawerWidth,
        },
    },
});

export default withStyles(styles)(Clean);
