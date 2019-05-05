import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import {
    AppBar,
    CircularProgress,
    CssBaseline,
    Grid,
    Hidden,
    withStyles,
} from '@material-ui/core';

import { Breadcrumbs, Snackbar, Modal } from '../../../ui';
import { LinearDeterminate } from '../../../ui/Loaders';
import { Footer, Header, Sidebar } from '../partials';
import { AppContext } from '../../../AppContext';

function Master(props) {
    const [minimized, setMinimized] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [localeMenuOpen, setLocaleMenuOpen] = useState(false);
    const [accountMenuOpen, setAccountMenuOpen] = useState(false);

    /**
     * Called when a nav link menu is clicked.
     *
     * @param {function} set The callback function to be called
     * @param {string} indicator The flag that will be toggled
     *
     * @return {undefined}
     */
    const handleNavLinkMenuToggled = (set, indicator) => {
        setLocaleMenuOpen(false);
        setAccountMenuOpen(false);
        setMobileOpen(false);

        set(!indicator);
    };

    /**
     * Toggles Locale Menu
     *
     * @return {undefined}
     */
    const handleLocaleMenuToggled = () => {
        handleNavLinkMenuToggled(setLocaleMenuOpen, localeMenuOpen);
    };

    /**
     * Toggles Account Menu
     *
     * @return {undefined}
     */
    const handleAccountMenuToggled = () => {
        handleNavLinkMenuToggled(setAccountMenuOpen, accountMenuOpen);
    };

    /**
     * Called when mobile drawer button is clicked.
     *
     * @return {undefined}
     */
    const handleDrawerToggled = () => {
        setMobileOpen(!mobileOpen);
    };

    useEffect(() => {
        //
    });

    const { nightMode } = useContext(AppContext);

    const { classes, showBreadcrumbs, ...other } = props;

    const {
        children,
        history,
        location,
        pageTitle,
        loading,
        message,
        alert,
    } = props;

    const renderLoading = (
        <Grid
            container
            className={classes.loadingContainer}
            justify="center"
            alignItems="center"
        >
            <Grid item>
                <CircularProgress color="primary" />
            </Grid>
        </Grid>
    );

    const renderBreadcrumbs = (
        <AppBar
            component="div"
            color="inherit"
            position="static"
            elevation={0}
            className={classes.breadcrumbBar}
            style={{
                backgroundColor: nightMode ? '#303030' : '#FAFAFA',
            }}
        >
            <div className={classes.breadcrumbWrapper}>
                <Breadcrumbs
                    segments={location.pathname
                        .split('/')
                        .splice(1)
                        .filter(segment => segment.length > 0)}
                    blacklistedSegments={['resources', 'analytics']}
                />
            </div>
        </AppBar>
    );

    return (
        <>
            {loading && <LinearDeterminate className={classes.loader} />}

            <div className={classes.root}>
                <CssBaseline />

                <nav
                    className={classNames(classes.drawer, {
                        [classes.minimized]: minimized,
                    })}
                >
                    <Hidden smUp implementation="js">
                        <Sidebar
                            {...other}
                            loading={loading}
                            navigate={path => history.push(path)}
                            variant="temporary"
                            open={mobileOpen}
                            onClose={handleDrawerToggled}
                            PaperProps={{ style: { width: drawerWidth } }}
                        />
                    </Hidden>

                    <Hidden xsDown implementation="css">
                        <Sidebar
                            {...other}
                            loading={loading}
                            navigate={path => history.push(path)}
                            minimized={minimized}
                            setMinimized={setMinimized}
                            PaperProps={{
                                style: { width: minimized ? 70 : drawerWidth },
                            }}
                        />
                    </Hidden>
                </nav>

                <div className={classes.contentWrapper}>
                    <Header
                        {...other}
                        mobileOpen={mobileOpen}
                        accountMenuOpen={accountMenuOpen}
                        localeMenuOpen={localeMenuOpen}
                        loading={loading}
                        onDrawerToggle={handleDrawerToggled}
                        onAccountMenuToggle={handleAccountMenuToggled}
                        onLocaleMenuToggle={handleLocaleMenuToggled}
                    />

                    {showBreadcrumbs && renderBreadcrumbs}

                    <main className={classes.content}>
                        {loading ? (
                            renderLoading
                        ) : (
                            <Grid container>{children}</Grid>
                        )}
                    </main>

                    <Footer />
                </div>
            </div>

            {message && message.hasOwnProperty('type') > 0 && (
                <Snackbar {...message} />
            )}

            {alert && alert.hasOwnProperty('type') > 0 && <Modal {...alert} />}
        </>
    );
}

Master.propTypes = {
    classes: PropTypes.object.isRequired,
    pageTitle: PropTypes.string.isRequired,
    loading: PropTypes.bool,

    primaryAction: PropTypes.object,
    tabs: PropTypes.array,
    showBreadcrumbs: PropTypes.bool,
    message: PropTypes.object,
    alert: PropTypes.object,
};

Master.defaultProps = {
    loading: false,

    tabs: [],
    showBreadcrumbs: true,
    message: {},
    alert: {},
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
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },

        '&$minimized': {
            [theme.breakpoints.up('sm')]: {
                width: 70,
            },
        },
    },

    minimized: {},

    breadcrumbBar: {
        zIndex: 0,
    },

    breadcrumbWrapper: {
        padding: theme.spacing.unit * 3,
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
        [theme.breakpoints.up('sm')]: {
            padding: `${theme.spacing.unit}px ${theme.spacing.unit * 3}px`,
        },
    },

    loadingContainer: {
        minHeight: '100%',
    },
});

export default withStyles(styles)(Master);
