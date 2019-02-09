import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
    withStyles,
    Grid,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    Badge,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Menu,
    MenuItem,
} from '@material-ui/core';

import {
    ChevronLeft as ChevronLeftIcon,
    Menu as MenuIcon,
    Notifications as NotificationsIcon,
    Dashboard as DashboardIcon,
    Group as GroupIcon,
    AccountCircle as AccountCircleIcon,
} from '@material-ui/icons';

class Master extends Component {
    state = {
        drawerOpened: true,
        accountMenuOpen: false,
    };

    handleDrawerToggled = () => {
        this.setState(prevState => {
            return {
                drawerOpened: !prevState.drawerOpened,
            };
        });
    };

    handleAccountMenuToggled = () => {
        this.setState(prevState => {
            return {
                accountMenuOpen: !prevState.accountMenuOpen,
            };
        });
    };

    render() {
        const { classes, pageProps, pageTitle, children } = this.props;
        const { user, signoutHandler, lockHandler } = pageProps;
        const { drawerOpened, accountMenuOpen } = this.state;

        return (
            <Grid container>
                <AppBar
                    position="absolute"
                    className={classNames(
                        classes.appBar,
                        drawerOpened && classes.appBarShift,
                    )}
                >
                    <Toolbar
                        disableGutters={!drawerOpened}
                        className={classes.toolbar}
                    >
                        <IconButton
                            color="inherit"
                            aria-label="Open drawer"
                            onClick={this.handleDrawerToggled}
                            className={classNames(
                                classes.menuButton,
                                drawerOpened && classes.menuButtonHidden,
                            )}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            className={classes.title}
                        >
                            {pageTitle}
                        </Typography>

                        <div className={classes.grow} />

                        <div className={classes.toolbarActionsDesktop}>
                            <IconButton color="inherit">
                                <Badge badgeContent={4} color="secondary">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>

                            <IconButton
                                aria-owns={accountMenuOpen && 'material-appbar'}
                                aria-haspopup="true"
                                onClick={this.handleAccountMenuToggled}
                                color="inherit"
                            >
                                <AccountCircleIcon />
                            </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>

                <Drawer
                    variant="permanent"
                    classes={{
                        paper: classNames(
                            classes.drawerPaper,
                            !drawerOpened && classes.drawerPaperClose,
                        ),
                    }}
                    open={drawerOpened}
                >
                    <div className={classes.toolbarIcon}>
                        <IconButton onClick={this.handleDrawerToggled}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </div>

                    <Divider />

                    <List>
                        <ListItem button>
                            <ListItemIcon>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItem>

                        <ListSubheader inset>Resources</ListSubheader>

                        <ListItem button>
                            <ListItemIcon>
                                <GroupIcon />
                            </ListItemIcon>

                            <ListItemText primary="Users" />
                        </ListItem>
                    </List>
                </Drawer>

                <main className={classes.content}>
                    <div className={classes.appBarSpacer} />

                    <Grid container>{children}</Grid>
                </main>
            </Grid>
        );
    }
}

Master.propTypes = {
    pageProps: PropTypes.object.isRequired,
    pageTitle: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
};

const drawerWidth = 240;

const styles = theme => ({
    toolbar: {
        paddingRight: 24,
    },

    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },

    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },

    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },

    menuButton: {
        marginLeft: 12,
        marginRight: 36,
    },

    menuButtonHidden: {
        display: 'none',
    },

    title: {
        flexGrow: 1,
    },

    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },

    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing.unit * 7,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing.unit * 9,
        },
    },

    appBarSpacer: theme.mixins.toolbar,

    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
        height: '100vh',
        overflow: 'auto',
    },

    toolbarActionsDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },

    grow: {
        flex: 1,
    },
});

const Styled = withStyles(styles)(Master);

export { Styled as Master };
