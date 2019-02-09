import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
    withStyles,
    ClickAwayListener,
    Grid,
    Grow,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    Badge,
    Paper,
    Popper,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Menu,
    MenuList,
    MenuItem,
} from '@material-ui/core';

import {
    ChevronLeft as ChevronLeftIcon,
    Menu as MenuIcon,
    Notifications as NotificationsIcon,
    Dashboard as DashboardIcon,
    Group as GroupIcon,
    AccountCircle as AccountCircleIcon,
    Settings as SettingsIcon,
    Lock as LockIcon,
    ExitToApp as ExitToAppIcon,
    MoreVert as MoreVertIcon,
} from '@material-ui/icons';

class Master extends Component {
    state = {
        drawerOpened: true,
        accountMenuOpen: false,
        accountMenuEl: null,
        mobileMenuOpen: false,
        mobileMenuEl: null,
    };

    /**
     * Event listener  that is triggered when the side drawer open / close
     * button is clicked.
     *
     * @return {undefined}
     */
    handleDrawerToggled = () => {
        this.setState(prevState => {
            return {
                drawerOpened: !prevState.drawerOpened,
            };
        });
    };

    /**
     * Event listener that is triggered when the account menu link is clicked.
     *
     * @param {object} event
     *
     * @return {undefined}
     */
    handleAccountMenuToggled = event => {
        this.setState(prevState => {
            return {
                accountMenuOpen: !prevState.accountMenuOpen,
            };
        });
    };

    /**
     * Event listener that is triggered when the mobile menu button is clicked.
     *
     * @param {object} event
     *
     * @return {undefined}
     */
    handleMobileMenuToggled = event => {
        this.setState(prevState => {
            return {
                mobileMenuOpen: !prevState.mobileMenuOpen,
            };
        });
    };

    render() {
        const { classes, pageProps, pageTitle, children } = this.props;
        const { width, user, handleSignout, handleLock } = pageProps;
        const {
            drawerOpened,
            accountMenuOpen,
            accountMenuEl,
            mobileMenuOpen,
            mobileMenuEl,
        } = this.state;

        const renderAccountMenu = (
            <Popper
                open={accountMenuOpen}
                anchorEl={accountMenuEl}
                className={classes.accountMenu}
                transition
                disablePortal
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin:
                                placement === 'bottom'
                                    ? 'center top'
                                    : 'center bottom',
                        }}
                    >
                        <Paper>
                            <ClickAwayListener
                                onClickAway={this.handleAccountMenuToggled}
                            >
                                <MenuList>
                                    <MenuItem
                                        onClick={() =>
                                            alert(`Hello ${user.firstname}!`)
                                        }
                                    >
                                        <ListItemIcon>
                                            <AccountCircleIcon />
                                        </ListItemIcon>

                                        <Typography>Profile</Typography>
                                    </MenuItem>

                                    <MenuItem>
                                        <ListItemIcon>
                                            <SettingsIcon />
                                        </ListItemIcon>

                                        <Typography>Settings</Typography>
                                    </MenuItem>

                                    <Divider />

                                    <MenuItem
                                        onClick={() =>
                                            handleLock(user.username)
                                        }
                                    >
                                        <ListItemIcon>
                                            <LockIcon />
                                        </ListItemIcon>

                                        <Typography>Lock</Typography>
                                    </MenuItem>

                                    <MenuItem onClick={handleSignout}>
                                        <ListItemIcon>
                                            <ExitToAppIcon />
                                        </ListItemIcon>

                                        <Typography>Signout</Typography>
                                    </MenuItem>
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        );

        const renderMobileMenu = (
            <Popper
                open={mobileMenuOpen}
                anchorEl={mobileMenuEl}
                className={classes.mobileMenu}
                transition
                disablePortal
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin:
                                placement === 'bottom'
                                    ? 'center top'
                                    : 'center bottom',
                        }}
                    >
                        <Paper>
                            <ClickAwayListener
                                onClickAway={this.handleMobileMenuToggled}
                            >
                                <MenuList>
                                    <MenuItem>
                                        <IconButton color="inherit">
                                            <Badge
                                                badgeContent={4}
                                                color="secondary"
                                            >
                                                <NotificationsIcon />
                                            </Badge>
                                        </IconButton>
                                        <p>Notifications</p>
                                    </MenuItem>

                                    <MenuItem
                                        onClick={this.handleAccountMenuToggled}
                                    >
                                        <IconButton color="inherit">
                                            <AccountCircleIcon />
                                        </IconButton>
                                        <p>Account</p>
                                    </MenuItem>
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        );

        return (
            <Grid container>
                <Grid item>
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
                                    aria-owns={
                                        accountMenuOpen && 'material-appbar'
                                    }
                                    aria-haspopup="true"
                                    onClick={this.handleAccountMenuToggled}
                                    color="inherit"
                                >
                                    <AccountCircleIcon />
                                </IconButton>
                            </div>

                            <div className={classes.toolbarActionsMobile}>
                                <IconButton
                                    aria-haspopup="true"
                                    onClick={this.handleMobileMenuToggled}
                                    color="inherit"
                                >
                                    <MoreVertIcon />
                                </IconButton>
                            </div>
                        </Toolbar>
                    </AppBar>

                    {renderAccountMenu}
                    {renderMobileMenu}
                </Grid>

                <Drawer
                    variant={width === 'lg' ? 'permanent' : 'temporary'}
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
        minHeight: '100vh',
    },

    toolbarActionsDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },

    toolbarActionsMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },

    grow: {
        flex: 1,
    },

    accountMenu: {
        position: 'fixed',
        right: 200,
        top: 125,
        [theme.breakpoints.up('md')]: {
            right: 35,
            top: 70,
        },
    },

    mobileMenu: {
        position: 'fixed',
        right: 35,
        top: 70,
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
});

const Styled = withStyles(styles)(Master);

export { Styled as Master };
