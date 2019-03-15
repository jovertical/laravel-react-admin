import React from 'react';
import PropTypes from 'prop-types';

import {
    AppBar,
    Avatar,
    Badge,
    Button,
    ClickAwayListener,
    Divider,
    Grid,
    Grow,
    Hidden,
    IconButton,
    ListItemIcon,
    MenuList,
    MenuItem,
    Paper,
    Popper,
    Tab,
    Tabs,
    Toolbar,
    Tooltip,
    Typography,
    withStyles,
} from '@material-ui/core';

import {
    AccountCircle as AccountCircleIcon,
    ExitToApp as ExitToAppIcon,
    Help as HelpIcon,
    Language as LanguageIcon,
    Lock as LockIcon,
    Menu as MenuIcon,
    Notifications as NotificationsIcon,
    Settings as SettingsIcon,
} from '@material-ui/icons';

import { Ph as PhIcon } from '../../../icons/flags/4x3/Ph';
import { Us as UsIcon } from '../../../icons/flags/4x3/Us';

const Header = props => {
    const { classes, parentProps } = props;
    const {
        onDrawerToggle,
        pageProps,
        pageTitle,
        primaryAction,
        tabs,
        localeMenuOpen,
        localeMenuEl,
        accountMenuOpen,
        accountMenuEl,
    } = parentProps;

    const { user, handleLock, handleSignout } = pageProps;

    const renderLocaleMenu = (
        <Popper
            open={localeMenuOpen}
            anchorEl={localeMenuEl}
            className={classes.navLinkMenu}
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
                                props.parentProps.onNavLinkMenuToggle(
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
                                    <ListItemIcon
                                        className={classes.navLinkMenuItemIcon}
                                    >
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
                                    <ListItemIcon
                                        className={classes.navLinkMenuItemIcon}
                                    >
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
            className={classes.navLinkMenu}
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
                                props.parentProps.onNavLinkMenuToggle(
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
                                    <ListItemIcon
                                        className={classes.navLinkMenuItemIcon}
                                    >
                                        <AccountCircleIcon />
                                    </ListItemIcon>

                                    <Typography>
                                        {Lang.get('navigation.profile')}
                                    </Typography>
                                </MenuItem>

                                <MenuItem>
                                    <ListItemIcon
                                        className={classes.navLinkMenuItemIcon}
                                    >
                                        <SettingsIcon />
                                    </ListItemIcon>

                                    <Typography>
                                        {Lang.get('navigation.settings')}
                                    </Typography>
                                </MenuItem>

                                <Divider />

                                <MenuItem
                                    onClick={() => handleLock(user.username)}
                                >
                                    <ListItemIcon
                                        className={classes.navLinkMenuItemIcon}
                                    >
                                        <LockIcon />
                                    </ListItemIcon>

                                    <Typography>
                                        {Lang.get('navigation.lock')}
                                    </Typography>
                                </MenuItem>

                                <MenuItem onClick={handleSignout}>
                                    <ListItemIcon
                                        className={classes.navLinkMenuItemIcon}
                                    >
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

    return (
        <>
            <AppBar
                color="primary"
                position="sticky"
                elevation={0}
                className={classes.primaryBar}
            >
                <Toolbar>
                    <Grid container spacing={8} alignItems="center">
                        <Hidden smUp>
                            <Grid item>
                                <IconButton
                                    color="inherit"
                                    aria-label="Open drawer"
                                    onClick={onDrawerToggle}
                                    className={classes.menuButton}
                                >
                                    <MenuIcon />
                                </IconButton>
                            </Grid>
                        </Hidden>

                        <Grid item xs />

                        <Grid item>
                            <Typography
                                className={classes.link}
                                component="a"
                                href="https://github.com/palonponjovertlota/lra"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Github Link
                            </Typography>
                        </Grid>

                        <Grid item>
                            <Tooltip
                                title={Lang.get('navigation.notifications')}
                            >
                                <IconButton color="inherit">
                                    <Badge
                                        badgeContent={
                                            new Date().getMinutes() + user.id
                                        }
                                        color="secondary"
                                    >
                                        <NotificationsIcon />
                                    </Badge>
                                </IconButton>
                            </Tooltip>
                        </Grid>

                        <Grid item>
                            <Tooltip title={Lang.get('navigation.locale')}>
                                <div className={classes.navLinkMenuWrapper}>
                                    <IconButton
                                        aria-owns={
                                            localeMenuOpen && 'material-appbar'
                                        }
                                        aria-haspopup="true"
                                        onClick={() =>
                                            props.parentProps.onNavLinkMenuToggle(
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
                        </Grid>

                        <Grid item>
                            <Tooltip title={Lang.get('navigation.account')}>
                                <div className={classes.navLinkMenuWrapper}>
                                    <IconButton
                                        aria-owns={
                                            accountMenuOpen && 'material-appbar'
                                        }
                                        aria-haspopup="true"
                                        onClick={() =>
                                            props.parentProps.onNavLinkMenuToggle(
                                                'accountMenuOpen',
                                            )
                                        }
                                        color="inherit"
                                    >
                                        <Avatar className={classes.avatar}>
                                            {`${user.firstname.charAt(
                                                0,
                                            )}${user.lastname.charAt(0)}`}
                                        </Avatar>
                                    </IconButton>

                                    {renderAccountMenu}
                                </div>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>

            <AppBar
                component="div"
                className={classes.secondaryBar}
                color="primary"
                position="static"
                elevation={0}
            >
                <Toolbar>
                    <Grid container alignItems="center" spacing={8}>
                        <Grid item xs>
                            <Typography color="inherit" variant="h5">
                                {pageTitle}
                            </Typography>
                        </Grid>

                        {primaryAction && (
                            <Grid item>
                                <Button
                                    className={classes.button}
                                    variant="outlined"
                                    color="inherit"
                                    size="small"
                                    onClick={primaryAction.clicked}
                                >
                                    {primaryAction.text}
                                </Button>
                            </Grid>
                        )}

                        <Grid item>
                            <Tooltip title="Help">
                                <IconButton color="inherit">
                                    <HelpIcon />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>

            <AppBar
                component="div"
                className={classes.secondaryBar}
                color="primary"
                position="static"
                elevation={0}
            >
                <Tabs value={0} textColor="inherit">
                    {tabs.map((tab, key) => (
                        <Tab key={key} textColor="inherit" label={tab.name} />
                    ))}
                </Tabs>
            </AppBar>
        </>
    );
};

Header.propTypes = {
    classes: PropTypes.object.isRequired,
    parentProps: PropTypes.object.isRequired,
};

const lightColor = 'rgba(255, 255, 255, 0.7)';

const styles = theme => ({
    primaryBar: {
        paddingTop: '0.25rem',
    },

    navLinkMenuWrapper: {
        position: 'relative',
        display: 'inline-block',
    },

    navLinkMenu: {
        position: 'absolute',
        padding: '0.5rem 1.25rem',
        right: 0,
        zIndex: 9999,
    },

    navLinkMenuItemIcon: {
        marginRight: '1rem',
    },

    secondaryBar: {
        zIndex: 0,
    },

    menuButton: {
        marginLeft: -theme.spacing.unit,
    },

    iconButtonAvatar: {
        padding: 4,
    },

    link: {
        textDecoration: 'none',
        color: lightColor,
        '&:hover': {
            color: theme.palette.common.white,
        },
    },

    button: {
        borderColor: lightColor,
    },
});

const Styled = withStyles(styles)(Header);

export { Styled as Header };
