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
    Language as LanguageIcon,
    Lock as LockIcon,
    Menu as MenuIcon,
    MoreVert as MoreVertIcon,
    Notifications as NotificationsIcon,
    Search as SearchIcon,
    Settings as SettingsIcon,
} from '@material-ui/icons';

import { fade } from '@material-ui/core/styles/colorManipulator';

import { _route } from '../../utils/Navigation';

import { Us as UsIcon } from '../../icons/flags/4x3/Us';
import { Ph as PhIcon } from '../../icons/flags/4x3/Ph';

class Backoffice extends Component {
    state = {
        drawerOpened: this.props.pageProps.width === 'lg' ? true : false,
        localeMenuOpen: false,
        localeMenuEl: null,
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
     * Event listener that is triggered when the a nav item menu link is clicked.
     *
     * @param {string} statusIndicator
     *
     * @return {undefined}
     */
    handleNavItemMenuToggled = statusIndicator => {
        this.setState(prevState => {
            return {
                [statusIndicator]: !prevState[statusIndicator],
                mobileMenuOpen: false,
            };
        });
    };

    /**
     * Event listener that is triggered when the the mobile menu link is clicked.
     *
     * @return {undefined}
     */
    handleMobileMenuToggled = () => {
        this.setState(prevState => {
            return {
                mobileMenuOpen: !prevState.mobileMenuOpen,
                localeMenuOpen: false,
                accountMenuOpen: false,
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
            localeMenuOpen,
            localeMenuEl,
            accountMenuOpen,
            accountMenuEl,
            mobileMenuOpen,
            mobileMenuEl,
        } = this.state;

        const renderLocaleMenu = (
            <Popper
                open={localeMenuOpen}
                anchorEl={localeMenuEl}
                className={classes.navItemMenu}
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
                                onClickAway={() =>
                                    this.handleNavItemMenuToggled(
                                        'localeMenuOpen',
                                    )
                                }
                            >
                                <MenuList>
                                    <MenuItem
                                        onClick={() => {
                                            if (
                                                window.location.pathname.indexOf(
                                                    '/en',
                                                ) === -1
                                            ) {
                                                window.location.href = '/en';
                                            }
                                        }}
                                    >
                                        <ListItemIcon>
                                            <UsIcon />
                                        </ListItemIcon>

                                        <Typography>
                                            {Lang.get('navigation.english')}
                                        </Typography>
                                    </MenuItem>

                                    <MenuItem
                                        onClick={() => {
                                            if (
                                                window.location.pathname.indexOf(
                                                    '/fil',
                                                ) === -1
                                            ) {
                                                window.location.href = '/fil';
                                            }
                                        }}
                                    >
                                        <ListItemIcon>
                                            <PhIcon />
                                        </ListItemIcon>

                                        <Typography>
                                            {Lang.get('navigation.filipino')}
                                        </Typography>
                                    </MenuItem>
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        );

        const renderAccountMenu = (
            <Popper
                open={accountMenuOpen}
                anchorEl={accountMenuEl}
                className={classes.navItemMenu}
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
                                onClickAway={() =>
                                    this.handleNavItemMenuToggled(
                                        'accountMenuOpen',
                                    )
                                }
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

                                        <Typography>
                                            {Lang.get('navigation.profile')}
                                        </Typography>
                                    </MenuItem>

                                    <MenuItem>
                                        <ListItemIcon>
                                            <SettingsIcon />
                                        </ListItemIcon>

                                        <Typography>
                                            {Lang.get('navigation.settings')}
                                        </Typography>
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

                                        <Typography>
                                            {Lang.get('navigation.lock')}
                                        </Typography>
                                    </MenuItem>

                                    <MenuItem onClick={handleSignout}>
                                        <ListItemIcon>
                                            <ExitToAppIcon />
                                        </ListItemIcon>

                                        <Typography>
                                            {Lang.get('navigation.signout')}
                                        </Typography>
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
                className={classes.navItemMenu}
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

                                        <p>
                                            {Lang.get(
                                                'navigation.notifications',
                                            )}
                                        </p>
                                    </MenuItem>

                                    <MenuItem
                                        onClick={() =>
                                            this.handleNavItemMenuToggled(
                                                'localeMenuOpen',
                                            )
                                        }
                                    >
                                        <IconButton color="inherit">
                                            <LanguageIcon />
                                        </IconButton>

                                        <p>{Lang.get('navigation.locale')}</p>
                                    </MenuItem>

                                    <MenuItem
                                        onClick={() =>
                                            this.handleNavItemMenuToggled(
                                                'accountMenuOpen',
                                            )
                                        }
                                    >
                                        <IconButton color="inherit">
                                            <AccountCircleIcon />
                                        </IconButton>

                                        <p>{Lang.get('navigation.account')}</p>
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
                        size="mdall"
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
                                <Tooltip
                                    title={Lang.get('navigation.open_drawer')}
                                >
                                    <IconButton
                                        color="inherit"
                                        aria-label={Lang.get(
                                            'navigation.open_drawer',
                                        )}
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
                                        placeholder={`${Lang.get(
                                            'navigation.search',
                                        )}...`}
                                        classes={{
                                            root: classes.inputRoot,
                                            input: classes.inputField,
                                        }}
                                    />
                                </div>

                                <div className={classes.grow} />

                                <div className={classes.toolbarActionsDesktop}>
                                    <Tooltip
                                        title={Lang.get(
                                            'navigation.notifications',
                                        )}
                                    >
                                        <IconButton color="inherit">
                                            <Badge
                                                badgeContent={4}
                                                color="secondary"
                                            >
                                                <NotificationsIcon />
                                            </Badge>
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip
                                        title={Lang.get('navigation.locale')}
                                    >
                                        <div
                                            className={
                                                classes.navItemMenuWrapper
                                            }
                                        >
                                            <IconButton
                                                aria-owns={
                                                    localeMenuOpen &&
                                                    'material-appbar'
                                                }
                                                aria-haspopup="true"
                                                onClick={() =>
                                                    this.handleNavItemMenuToggled(
                                                        'localeMenuOpen',
                                                    )
                                                }
                                                color="inherit"
                                            >
                                                <LanguageIcon />
                                            </IconButton>

                                            {renderLocaleMenu}
                                        </div>
                                    </Tooltip>

                                    <Tooltip
                                        title={Lang.get('navigation.account')}
                                    >
                                        <div
                                            className={
                                                classes.navItemMenuWrapper
                                            }
                                        >
                                            <IconButton
                                                aria-owns={
                                                    accountMenuOpen &&
                                                    'material-appbar'
                                                }
                                                aria-haspopup="true"
                                                onClick={() =>
                                                    this.handleNavItemMenuToggled(
                                                        'accountMenuOpen',
                                                    )
                                                }
                                                color="inherit"
                                            >
                                                <AccountCircleIcon />
                                            </IconButton>

                                            {renderAccountMenu}
                                        </div>
                                    </Tooltip>
                                </div>

                                <div className={classes.toolbarActionsMobile}>
                                    {['md', 'lg'].indexOf(width) < 0 && (
                                        <div
                                            className={
                                                classes.navItemMenuWrapper
                                            }
                                        >
                                            <IconButton
                                                aria-haspopup="true"
                                                className={
                                                    classes.mobileMenuButton
                                                }
                                                onClick={
                                                    this.handleMobileMenuToggled
                                                }
                                                color="inherit"
                                            >
                                                <MoreVertIcon />
                                            </IconButton>

                                            {renderLocaleMenu}
                                            {renderAccountMenu}
                                            {renderMobileMenu}
                                        </div>
                                    )}
                                </div>
                            </Toolbar>
                        </AppBar>
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
                            <Tooltip
                                title={Lang.get('navigation.close_drawer')}
                            >
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
                                    title={
                                        !drawerOpened
                                            ? Lang.get('navigation.dashboard')
                                            : ''
                                    }
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
                                            {Lang.get('navigation.dashboard')}
                                        </Typography>
                                    }
                                />
                            </ListItem>

                            {drawerOpened && (
                                <ListSubheader inset>
                                    {Lang.get('navigation.resources')}
                                </ListSubheader>
                            )}

                            <ListItem
                                button
                                onClick={() =>
                                    history.push(
                                        _route('backoffice.users.index'),
                                    )
                                }
                            >
                                <Tooltip
                                    title={
                                        !drawerOpened
                                            ? Lang.get('navigation.users')
                                            : ''
                                    }
                                >
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
                                            {Lang.get('navigation.users')}
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
                            {Lang.get('navigation.citation')}{' '}
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
        paddingRight: 0,
        [theme.breakpoints.up('md')]: {
            paddingRight: '1.2rem',
        },
    },

    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 0.8rem',
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
        marginLeft: '1.2rem',
        marginRight: '1.2rem',
    },

    menuButtonHidden: {
        display: 'none',
    },

    toolbarTitle: {
        marginRight: '1.2rem',
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
        [theme.breakpoints.up('md')]: {
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
        [theme.breakpoints.up('md')]: {
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

    inputField: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 10,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 120,
            '&:focus': {
                width: 200,
            },
        },
    },

    mobileMenuButton: {
        marginLeft: '1.2rem',
        marginRight: '1.2rem',
    },

    appBarSpacer: theme.mixins.toolbar,

    root: {
        minHeight: '100vh',
        maxWidth: '100%',
        position: 'relative',
    },

    content: {
        flexGrow: 1,
        overflowX: 'scroll',
        padding: theme.spacing.unit * 6,
        marginBottom: '5rem',
        backgroundColor: theme.palette.grey['200'],
        [theme.breakpoints.down('md')]: {
            padding: theme.spacing.unit * 2,
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

    navItemMenuWrapper: {
        position: 'relative',
        display: 'inline-block',
    },

    navItemMenu: {
        position: 'absolute',
        padding: '1rem',
        right: 0,
        zIndex: 9999,
    },
});

const Styled = withStyles(styles)(Backoffice);

export { Styled as Backoffice };
