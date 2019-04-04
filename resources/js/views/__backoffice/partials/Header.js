import React from 'react';
import PropTypes from 'prop-types';

import {
    AppBar,
    Avatar,
    Badge,
    Button,
    ClickAwayListener,
    colors,
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

import * as RandomUtils from '../../../utils/Random';
import {
    LightbulbOff as LightbulbOffIcon,
    LightbulbOn as LightbulbOnIcon,
} from '../../../icons/1x1';
import { Ph as PhIcon, Us as UsIcon } from '../../../icons/flags/4x3';
import { Skeleton } from '../../../ui';

const LocaleMenu = props => {
    const { classes, localeMenuOpen, localeMenuEl } = props;

    return (
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
                                props.onNavLinkMenuToggle('localeMenuOpen')
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
};

const AccountMenu = props => {
    const { classes, accountMenuOpen, accountMenuEl, pageProps } = props;
    const { user, handleLock, handleSignout } = pageProps;

    return (
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
                                props.onNavLinkMenuToggle('accountMenuOpen')
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
};

const Header = props => {
    const {
        classes,
        loading,
        onDrawerToggle,
        pageProps,
        pageTitle,
        primaryAction,
        tabs,
        localeMenuOpen,
        accountMenuOpen,
    } = props;

    const { user, nightMode, handleNightmodeToggled } = pageProps;

    const skeletonProps = {
        color: colors.grey[400],
        highlightColor: colors.grey[200],
    };

    const renderNavigating = (
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
                                    className={classes.menuButton}
                                >
                                    <Skeleton
                                        {...skeletonProps}
                                        height={25}
                                        width={25}
                                    />
                                </IconButton>
                            </Grid>
                        </Hidden>

                        <Grid item xs />

                        <Grid item>
                            <Skeleton
                                {...skeletonProps}
                                height={20}
                                width={70}
                                className={classes.link}
                            />
                        </Grid>

                        <Grid item>
                            <IconButton color="inherit">
                                <Skeleton
                                    {...skeletonProps}
                                    circle
                                    height={30}
                                    width={30}
                                />
                            </IconButton>
                        </Grid>

                        <Grid item>
                            <IconButton color="inherit">
                                <Skeleton
                                    {...skeletonProps}
                                    circle
                                    height={30}
                                    width={30}
                                />
                            </IconButton>
                        </Grid>

                        <Grid item>
                            <IconButton color="inherit">
                                <Skeleton
                                    {...skeletonProps}
                                    circle
                                    height={30}
                                    width={30}
                                />
                            </IconButton>
                        </Grid>

                        <Grid item>
                            <IconButton color="inherit">
                                <Skeleton
                                    {...skeletonProps}
                                    circle
                                    height={30}
                                    width={30}
                                />
                            </IconButton>
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
                            <Skeleton
                                height={30}
                                width={100 + pageTitle.length * 2}
                                {...skeletonProps}
                                className={classes.button}
                            />
                        </Grid>

                        {primaryAction && (
                            <Grid item>
                                <Skeleton
                                    {...skeletonProps}
                                    height={30}
                                    width={50 + primaryAction.text.length * 2}
                                    className={classes.button}
                                />
                            </Grid>
                        )}

                        <Grid item>
                            <IconButton color="inherit">
                                <Skeleton
                                    {...skeletonProps}
                                    circle
                                    height={25}
                                    width={25}
                                />
                            </IconButton>
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
                        <Tab
                            key={key}
                            textColor="inherit"
                            label={
                                <Skeleton
                                    {...skeletonProps}
                                    height={20}
                                    width={30 + tab.name.length * 2}
                                />
                            }
                        />
                    ))}
                </Tabs>
            </AppBar>
        </>
    );

    const renderNavigated = (
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
                                <Tooltip
                                    title={Lang.get('navigation.open_drawer')}
                                >
                                    <IconButton
                                        color="inherit"
                                        aria-label="Open drawer"
                                        onClick={onDrawerToggle}
                                        className={classes.menuButton}
                                    >
                                        <MenuIcon />
                                    </IconButton>
                                </Tooltip>
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
                                            props.onNavLinkMenuToggle(
                                                'localeMenuOpen',
                                            )
                                        }
                                        color="inherit"
                                    >
                                        <LanguageIcon />
                                    </IconButton>

                                    <LocaleMenu {...props} />
                                </div>
                            </Tooltip>
                        </Grid>

                        <Grid item>
                            <Tooltip
                                title={
                                    nightMode
                                        ? Lang.get('navigation.nightmode_off')
                                        : Lang.get('navigation.nightmode_on')
                                }
                            >
                                <IconButton
                                    color="inherit"
                                    onClick={handleNightmodeToggled}
                                >
                                    {nightMode ? (
                                        <LightbulbOnIcon />
                                    ) : (
                                        <LightbulbOffIcon />
                                    )}
                                </IconButton>
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
                                            props.onNavLinkMenuToggle(
                                                'accountMenuOpen',
                                            )
                                        }
                                        color="inherit"
                                    >
                                        {user.hasOwnProperty('thumbnail_url') &&
                                        user.thumbnail_url !== null ? (
                                            <Avatar
                                                alt={user.name}
                                                src={user.thumbnail_url}
                                            />
                                        ) : (
                                            <Avatar
                                                style={{
                                                    fontSize: 17,
                                                    backgroundColor: RandomUtils._color(
                                                        user.firstname.length -
                                                            user.created_at.charAt(
                                                                user.created_at
                                                                    .length - 2,
                                                            ),
                                                    ),
                                                }}
                                            >
                                                <Typography>
                                                    {`${user.firstname.charAt(
                                                        0,
                                                    )}${user.lastname.charAt(
                                                        0,
                                                    )}`}
                                                </Typography>
                                            </Avatar>
                                        )}
                                    </IconButton>

                                    <AccountMenu {...props} />
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
                            <Tooltip title={Lang.get('navigation.help')}>
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

    return <>{loading ? renderNavigating : renderNavigated}</>;
};

Header.propTypes = {
    classes: PropTypes.object.isRequired,
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

export default withStyles(styles)(Header);
