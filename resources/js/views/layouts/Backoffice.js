import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
    AppBar,
    Badge,
    Button,
    CircularProgress,
    ClickAwayListener,
    Divider,
    Drawer,
    Grid,
    Grow,
    IconButton,
    InputBase,
    Link,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    MenuItem,
    MenuList,
    Paper,
    Popper,
    Snackbar,
    Toolbar,
    Tooltip,
    Typography,
    withStyles,
} from '@material-ui/core';

import {
    AccountCircle as AccountCircleIcon,
    ChevronLeft as ChevronLeftIcon,
    Close as CloseIcon,
    Dashboard as DashboardIcon,
    ExitToApp as ExitToAppIcon,
    Group as GroupIcon,
    Lock as LockIcon,
    Menu as MenuIcon,
    MoreVert as MoreVertIcon,
    Notifications as NotificationsIcon,
    Search as SearchIcon,
    Settings as SettingsIcon,
} from '@material-ui/icons';

import { fade } from '@material-ui/core/styles/colorManipulator';

import { _route } from '../../utils/Navigation';

class Backoffice extends Component {
    state = {
        drawerOpened: this.props.pageProps.width === 'lg' ? true : false,
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
                mobileMenuOpen: false,
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
        const {
            history,
            location,
            classes,
            pageProps,
            loading,
            pageTitle,
            children,
            message,
        } = this.props;
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

        const renderSnackbar = message && (
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open
                autoHideDuration={
                    message.hasOwnProperty('ttl') ? message.ttl : 5000
                }
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">{message.body}</span>}
                action={[
                    <Button
                        key="undo"
                        color="secondary"
                        size="small"
                        onClick={message.action}
                    >
                        {message.actionText}
                    </Button>,

                    <IconButton
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        onClick={message.close}
                    >
                        <CloseIcon />
                    </IconButton>,
                ]}
            />
        );

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
                <Grid container className={classes.root}>
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
                                <Tooltip title="Open Drawer">
                                    <IconButton
                                        color="inherit"
                                        aria-label="Open drawer"
                                        onClick={this.handleDrawerToggled}
                                        className={classNames(
                                            classes.menuButton,
                                            drawerOpened &&
                                                classes.menuButtonHidden,
                                        )}
                                    >
                                        <MenuIcon />
                                    </IconButton>
                                </Tooltip>

                                {width === 'lg' && !drawerOpened && (
                                    <Typography
                                        variant="h6"
                                        color="inherit"
                                        noWrap
                                        className={classes.toolbarTitle}
                                    >
                                        {pageTitle}
                                    </Typography>
                                )}

                                <div className={classes.search}>
                                    <div className={classes.searchIcon}>
                                        <SearchIcon />
                                    </div>

                                    <InputBase
                                        placeholder="Search…"
                                        classes={{
                                            root: classes.inputRoot,
                                            input: classes.inputInput,
                                        }}
                                    />
                                </div>

                                <div className={classes.grow} />

                                <div className={classes.toolbarActionsDesktop}>
                                    <Tooltip title="Notifications">
                                        <IconButton color="inherit">
                                            <Badge
                                                badgeContent={4}
                                                color="secondary"
                                            >
                                                <NotificationsIcon />
                                            </Badge>
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Account">
                                        <IconButton
                                            aria-owns={
                                                accountMenuOpen &&
                                                'material-appbar'
                                            }
                                            aria-haspopup="true"
                                            onClick={
                                                this.handleAccountMenuToggled
                                            }
                                            color="inherit"
                                        >
                                            <AccountCircleIcon />
                                        </IconButton>
                                    </Tooltip>
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
                            <Tooltip title="Close drawer">
                                <IconButton onClick={this.handleDrawerToggled}>
                                    <ChevronLeftIcon />
                                </IconButton>
                            </Tooltip>
                        </div>

                        <Divider />

                        <List>
                            <ListItem
                                button
                                onClick={() =>
                                    history.push(_route('backoffice.home'))
                                }
                            >
                                <Tooltip
                                    title={!drawerOpened ? 'Dashboard' : ''}
                                >
                                    <ListItemIcon>
                                        <DashboardIcon
                                            color={
                                                _route('backoffice.home') ===
                                                location.pathname
                                                    ? 'primary'
                                                    : 'inherit'
                                            }
                                        />
                                    </ListItemIcon>
                                </Tooltip>

                                <ListItemText
                                    primary={
                                        <Typography
                                            color={
                                                _route('backoffice.home') ===
                                                location.pathname
                                                    ? 'primary'
                                                    : 'textSecondary'
                                            }
                                            variant="h6"
                                        >
                                            Dashboard
                                        </Typography>
                                    }
                                />
                            </ListItem>

                            {drawerOpened && (
                                <ListSubheader inset>Resources</ListSubheader>
                            )}

                            <ListItem
                                button
                                onClick={() =>
                                    history.push(
                                        _route('backoffice.users.index'),
                                    )
                                }
                            >
                                <Tooltip title={!drawerOpened ? 'Users' : ''}>
                                    <ListItemIcon>
                                        <GroupIcon
                                            color={
                                                _route(
                                                    'backoffice.users.index',
                                                ) === location.pathname
                                                    ? 'primary'
                                                    : 'inherit'
                                            }
                                        />
                                    </ListItemIcon>
                                </Tooltip>

                                <ListItemText
                                    primary={
                                        <Typography
                                            color={
                                                _route(
                                                    'backoffice.users.index',
                                                ) === location.pathname
                                                    ? 'primary'
                                                    : 'textSecondary'
                                            }
                                            variant="h6"
                                        >
                                            Users
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        </List>
                    </Drawer>

                    <main className={classes.content}>
                        <div className={classes.appBarSpacer} />

                        {loading ? (
                            renderLoading
                        ) : (
                            <Grid container>{children}</Grid>
                        )}
                    </main>

                    <footer className={classes.footer}>
                        <p>
                            Built with{' '}
                            <span role="img" aria-label="Love">
                                ❤️
                            </span>{' '}
                            by{' '}
                            <Link
                                href="https://github.com/palonponjovertlota"
                                target="_blank"
                                rel="noreferrer"
                            >
                                @palonponjovertlota
                            </Link>
                        </p>
                    </footer>
                </Grid>

                {renderSnackbar}
            </>
        );
    }
}

Backoffice.propTypes = {
    pageProps: PropTypes.object.isRequired,
    pageTitle: PropTypes.string.isRequired,
    message: PropTypes.object,
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

    toolbarTitle: {
        marginRight: 12,
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

    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing.unit,
            width: 'auto',
        },
    },

    searchIcon: {
        width: theme.spacing.unit * 9,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    inputRoot: {
        color: 'inherit',
        width: '100%',
    },

    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 10,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: 120,
            '&:focus': {
                width: 200,
            },
        },
    },

    appBarSpacer: theme.mixins.toolbar,

    root: {
        minHeight: '100vh',
        maxWidth: '100%',
        position: 'relative',
    },

    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 6,
        marginBottom: '5rem',
        backgroundColor: theme.palette.grey['200'],
    },

    loadingContainer: {
        minHeight: '100%',
    },

    footer: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        left: 0,
        padding: '1rem',
        textAlign: 'center',
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
        zIndex: 9999,
        right: 35,
        top: 70,
        [theme.breakpoints.up('md')]: {
            right: 70,
            top: 10,
        },
    },

    mobileMenu: {
        position: 'fixed',
        zIndex: 9999,
        right: 70,
        top: 10,
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
});

const Styled = withStyles(styles)(Backoffice);

export { Styled as Backoffice };
