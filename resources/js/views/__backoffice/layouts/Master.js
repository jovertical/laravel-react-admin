import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

import {
    AppBar,
    CircularProgress,
    CssBaseline,
    Grid,
    Hidden,
    Link,
    Typography,
    withStyles,
} from '@material-ui/core';

import { Breadcrumbs } from '@material-ui/lab';

import { Home as HomeIcon } from '@material-ui/icons';

import * as NavigationUtils from '../../../utils/Navigation';
import * as StringUtils from '../../../utils/String';
import * as UrlUtils from '../../../utils/URL';
import { Snackbar, Modal } from '../../../ui';
import { LinearDeterminate } from '../../../ui/Loaders';
import { Header, Sidebar } from '../partials';

class Master extends Component {
    state = {
        mobileOpen: false,
        localeMenuOpen: false,
        localeMenuEl: null,
        accountMenuOpen: false,
        accountMenuEl: null,
        message: {},
    };

    /**
     * Event listener that is triggered when the a nav link menu is clicked.
     *
     * @param {string} statusIndicator
     *
     * @return {undefined}
     */
    handleNavLinkMenuToggled = statusIndicator => {
        this.setState(prevState => {
            return {
                localeMenuOpen: false,
                accountMenuOpen: false,
                mobileOpen: false,
                [statusIndicator]: !prevState[statusIndicator],
            };
        });
    };

    /**
     * Event listener that is triggered when the the mobile drawer toggle is clicked.
     *
     * @return {undefined}
     */
    handleDrawerToggled = () => {
        this.setState(prevState => ({ mobileOpen: !prevState.mobileOpen }));
    };

    /**
     * This will setup a global message into the state coming from the URL
     * passed message parameters. Useful when attempting to notify actions after
     * a redirect by React's router.
     *
     * @return {undefined}
     */
    setGlobalMessage = () => {
        const { history, location } = this.props;

        const queryParams = UrlUtils._queryParams(location.search);
        const messageKeys = Object.keys(queryParams).filter(
            key => key.indexOf('_message') > -1,
        );

        const message = {};

        messageKeys.forEach(key => {
            message[key.match(/\[(.*)\]/).pop()] = queryParams[key];
        });

        message.closed = () => {
            this.setState({ message: {} });

            history.push(location.pathname);
        };

        this.setState({ message });
    };

    componentDidMount() {
        this.setGlobalMessage();
    }

    render() {
        const {
            classes,
            children,
            history,
            location,
            pageProps,
            loading,
            message,
            alert,
        } = this.props;
        const { navigating, nightMode } = pageProps;

        const { mobileOpen, message: globalMessage } = this.state;

        const segments = location.pathname
            .split('/')
            .splice(1)
            .filter(segment => segment.length > 0);

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

        return (
            <>
                {navigating && <LinearDeterminate className={classes.loader} />}

                <div className={classes.root}>
                    <CssBaseline />

                    <nav className={classes.drawer}>
                        <Hidden smUp implementation="js">
                            <Sidebar
                                pageProps={pageProps}
                                PaperProps={{ style: { width: drawerWidth } }}
                                variant="temporary"
                                open={mobileOpen}
                                onClose={this.handleDrawerToggled}
                                locationPathname={location.pathname}
                                navigate={path => history.push(path)}
                            />
                        </Hidden>

                        <Hidden xsDown implementation="css">
                            <Sidebar
                                pageProps={pageProps}
                                PaperProps={{ style: { width: drawerWidth } }}
                                locationPathname={location.pathname}
                                navigate={path => history.push(path)}
                            />
                        </Hidden>
                    </nav>

                    <div className={classes.contentWrapper}>
                        <Header
                            parentProps={{
                                ...this.props,
                                ...this.state,
                                onDrawerToggle: this.handleDrawerToggled,
                                onNavLinkMenuToggle: this
                                    .handleNavLinkMenuToggled,
                            }}
                        />

                        <AppBar
                            component="div"
                            color="inherit"
                            position="static"
                            elevation={0}
                            className={classes.breadcrumbBar}
                            style={{
                                backgroundColor: nightMode
                                    ? '#303030'
                                    : '#FAFAFA',
                            }}
                        >
                            <div className={classes.breadcrumbWrapper}>
                                <Breadcrumbs arial-label="Breadcrumb">
                                    {segments.length > 0 ? (
                                        <Link
                                            color="inherit"
                                            component={linkProps => (
                                                <RouterLink
                                                    {...linkProps}
                                                    to={NavigationUtils._route(
                                                        'backoffice.home',
                                                    )}
                                                />
                                            )}
                                            className={classes.breadcrumbItem}
                                        >
                                            <HomeIcon
                                                className={
                                                    classes.breadcrumbItemIcon
                                                }
                                            />
                                        </Link>
                                    ) : (
                                        <HomeIcon
                                            className={
                                                classes.breadcrumbItemIcon
                                            }
                                        />
                                    )}

                                    {segments.map((segment, key) => {
                                        if (key + 1 === segments.length) {
                                            return (
                                                <Typography
                                                    key={key}
                                                    className={
                                                        classes.breadcrumbItem
                                                    }
                                                >
                                                    {StringUtils._uppercaseFirst(
                                                        segment,
                                                    )}
                                                </Typography>
                                            );
                                        }

                                        return (
                                            <Link
                                                key={key}
                                                color="inherit"
                                                component={linkProps => (
                                                    <RouterLink
                                                        {...linkProps}
                                                        to={
                                                            '/' +
                                                            segment
                                                                .split('/')
                                                                .join('.')
                                                        }
                                                    />
                                                )}
                                                className={
                                                    classes.breadcrumbItem
                                                }
                                            >
                                                {StringUtils._uppercaseFirst(
                                                    segment,
                                                )}
                                            </Link>
                                        );
                                    })}
                                </Breadcrumbs>
                            </div>
                        </AppBar>

                        <main className={classes.content}>
                            {loading || navigating ? (
                                renderLoading
                            ) : (
                                <Grid container>{children}</Grid>
                            )}
                        </main>

                        <footer className={classes.footer}>
                            <Typography>
                                {Lang.get('navigation.citation')}{' '}
                                <Link
                                    href="https://github.com/palonponjovertlota"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    @palonponjovertlota
                                </Link>
                            </Typography>
                        </footer>
                    </div>
                </div>

                {globalMessage && globalMessage.hasOwnProperty('type') > 0 && (
                    <Snackbar {...globalMessage} />
                )}

                {message && message.hasOwnProperty('type') > 0 && (
                    <Snackbar {...message} />
                )}

                {alert && alert.hasOwnProperty('type') > 0 && (
                    <Modal {...alert} />
                )}
            </>
        );
    }
}

Master.propTypes = {
    classes: PropTypes.object.isRequired,
    pageProps: PropTypes.object.isRequired,
    pageTitle: PropTypes.string.isRequired,
    primaryAction: PropTypes.object,
    tabs: PropTypes.array,
    message: PropTypes.object,
    alert: PropTypes.object,
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
    },

    breadcrumbBar: {
        zIndex: 0,
    },

    breadcrumbWrapper: {
        padding: theme.spacing.unit * 3,
    },

    breadcrumbItemIcon: {
        marginRight: theme.spacing.unit / 2,
        width: 20,
    },

    breadcrumbItem: {
        display: 'flex',
    },

    contentWrapper: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'scroll',
    },

    content: {
        flex: 1,
        padding: `0 ${theme.spacing.unit}px`,
        marginBottom: 75,
        [theme.breakpoints.up('sm')]: {
            marginBottom: 50,
            padding: `${theme.spacing.unit}px ${theme.spacing.unit * 3}px`,
        },
    },

    loadingContainer: {
        minHeight: '100%',
    },

    footer: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        left: 0,
        padding: theme.spacing.unit * 4,
        textAlign: 'center',
    },
});

export default withStyles(styles)(Master);
