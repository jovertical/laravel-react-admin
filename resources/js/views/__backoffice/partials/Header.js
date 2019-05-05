import React, { useCallback, useContext } from 'react';
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
    ListItemAvatar,
    ListItemText,
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
    ExitToApp as ExitToAppIcon,
    Help as HelpIcon,
    Language as LanguageIcon,
    Lock as LockIcon,
    Menu as MenuIcon,
    Notifications as NotificationsIcon,
    Settings as SettingsIcon,
    Update as UpdateIcon,
} from '@material-ui/icons';

import * as NavigationUtils from '../../../helpers/Navigation';
import * as RandomUtils from '../../../helpers/Random';
import {
    GitHub as GitHubIcon,
    LightbulbOff as LightbulbOffIcon,
    LightbulbOn as LightbulbOnIcon,
} from '../../../icons/1x1';
import { Ph as PhIcon, Us as UsIcon } from '../../../icons/flags/4x3';
import { Skeleton } from '../../../ui';
import { AppContext } from '../../../AppContext';

const UserAvatar = props => {
    const { user } = props;

    return user.thumbnail_url !== null ? (
        <Avatar alt={user.name} src={user.thumbnail_url} />
    ) : (
        <Avatar
            style={{
                fontSize: 17,
                backgroundColor: RandomUtils.color(
                    user.firstname.length -
                        user.created_at.charAt(user.created_at.length - 2),
                ),
            }}
        >
            <Typography>
                {`${user.firstname.charAt(0)}${user.lastname.charAt(0)}`}
            </Typography>
        </Avatar>
    );
};

UserAvatar.propTypes = {
    user: PropTypes.object.isRequired,
};

const LocaleMenu = props => {
    const { classes, localeMenuOpen, onLocaleMenuToggle } = props;

    return (
        <Popper
            open={localeMenuOpen}
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
                        <ClickAwayListener onClickAway={onLocaleMenuToggle}>
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
    const { user, handleLock, handleSignOut } = useContext(AppContext);

    const {
        history,
        classes,

        accountMenuOpen,
        onAccountMenuToggle,
    } = props;

    const navigate = path => history.push(path);

    return (
        <Popper
            open={accountMenuOpen}
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
                    <Paper style={{ marginTop: -3 }}>
                        <ClickAwayListener onClickAway={onAccountMenuToggle}>
                            <MenuList>
                                <MenuItem style={{ height: 50 }}>
                                    <ListItemAvatar
                                        className={classes.navLinkMenuItemIcon}
                                    >
                                        <UserAvatar user={user} />
                                    </ListItemAvatar>

                                    <ListItemText>
                                        <Typography>{user.name}</Typography>

                                        <Typography color="textSecondary">
                                            {user.email}
                                        </Typography>
                                    </ListItemText>
                                </MenuItem>

                                <MenuItem
                                    onClick={() =>
                                        navigate(
                                            NavigationUtils.route(
                                                'backoffice.settings.profile',
                                            ),
                                        )
                                    }
                                >
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

                                <MenuItem onClick={handleSignOut}>
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

function Header(props) {
    const {
        classes,
        pageTitle,
        loading,

        variant,
        primaryAction,
        tabs,
        localeMenuOpen,
        accountMenuOpen,

        onDrawerToggle,
        onLocaleMenuToggle,
        onAccountMenuToggle,
    } = props;

    const {
        user,

        monitoringEnabled,
        nightMode,
        handleNightModeToggled,
    } = useContext(AppContext);

    const skeletonProps = {
        color: colors.grey[400],
        highlightColor: colors.grey[200],
    };

    const renderDrawerButtonNavigating = (
        <Grid item>
            <IconButton
                color="inherit"
                aria-label="Open drawer"
                className={classes.menuButton}
            >
                <Skeleton {...skeletonProps} height={25} width={25} />
            </IconButton>
        </Grid>
    );

    const renderNavigating = (
        <>
            <AppBar
                color="primary"
                position="sticky"
                elevation={0}
                className={
                    variant === 'slim'
                        ? classes.primaryBarSlim
                        : classes.primaryBar
                }
            >
                <Toolbar>
                    <Grid container spacing={8} alignItems="center">
                        {variant === 'slim' ? (
                            renderDrawerButtonNavigating
                        ) : (
                            <Hidden smUp>{renderDrawerButtonNavigating}</Hidden>
                        )}

                        <Hidden smDown>
                            {variant === 'slim' && (
                                <Grid item>
                                    <Skeleton
                                        {...skeletonProps}
                                        height={30}
                                        width={75 + pageTitle.length * 2}
                                    />
                                </Grid>
                            )}
                        </Hidden>

                        <Grid item xs />

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

            {variant === 'full' && (
                <>
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
                                        width={75 + pageTitle.length * 2}
                                        {...skeletonProps}
                                        className={classes.button}
                                    />
                                </Grid>

                                {Object.keys(primaryAction).length > 0 && (
                                    <Grid item>
                                        <Skeleton
                                            {...skeletonProps}
                                            height={25}
                                            width={
                                                50 +
                                                primaryAction.text.length * 2
                                            }
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

                    {tabs.length > 0 && (
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
                                                width={25 + tab.name.length * 2}
                                            />
                                        }
                                    />
                                ))}
                            </Tabs>
                        </AppBar>
                    )}
                </>
            )}
        </>
    );

    const renderDrawerButton = (
        <Grid item>
            <Tooltip title={Lang.get('navigation.open_drawer')}>
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
    );

    const renderNavigated = (
        <>
            <AppBar
                color="primary"
                position="sticky"
                elevation={0}
                className={
                    variant === 'slim'
                        ? classes.primaryBarSlim
                        : classes.primaryBar
                }
            >
                <Toolbar>
                    <Grid container spacing={8} alignItems="center">
                        {variant === 'slim' ? (
                            renderDrawerButton
                        ) : (
                            <Hidden smUp>{renderDrawerButton}</Hidden>
                        )}

                        <Hidden smDown>
                            {variant === 'slim' && (
                                <Grid item>
                                    <Typography color="inherit" variant="h5">
                                        {pageTitle}
                                    </Typography>
                                </Grid>
                            )}
                        </Hidden>

                        <Grid item xs />

                        <Grid item>
                            <Tooltip title={Lang.get('navigation.github')}>
                                <IconButton
                                    href="https://github.com/palonponjovertlota/lra"
                                    target="_blank"
                                    rel="noreferrer"
                                    color="inherit"
                                >
                                    <GitHubIcon />
                                </IconButton>
                            </Tooltip>
                        </Grid>

                        {monitoringEnabled && (
                            <Grid item>
                                <Tooltip
                                    title={Lang.get('navigation.monitoring')}
                                >
                                    <IconButton
                                        href="/telescope"
                                        target="_blank"
                                        rel="noreferrer"
                                        color="inherit"
                                    >
                                        <UpdateIcon />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        )}

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
                                        onClick={onLocaleMenuToggle}
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
                                    onClick={handleNightModeToggled}
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
                                        onClick={onAccountMenuToggle}
                                        color="inherit"
                                    >
                                        {user.hasOwnProperty(
                                            'thumbnail_url',
                                        ) && <UserAvatar user={user} />}
                                    </IconButton>

                                    <AccountMenu {...props} />
                                </div>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>

            {variant === 'full' && (
                <>
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

                                {Object.keys(primaryAction).length > 0 && (
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
                                    <Tooltip
                                        title={Lang.get('navigation.help')}
                                    >
                                        <IconButton color="inherit">
                                            <HelpIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        </Toolbar>
                    </AppBar>

                    {tabs.length > 0 && (
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
                                        label={tab.name}
                                    />
                                ))}
                            </Tabs>
                        </AppBar>
                    )}
                </>
            )}
        </>
    );

    return <>{loading ? renderNavigating : renderNavigated}</>;
}

Header.propTypes = {
    classes: PropTypes.object.isRequired,
    pageTitle: PropTypes.string.isRequired,
    loading: PropTypes.bool,

    variant: PropTypes.oneOf(['full', 'slim']),
    primaryAction: PropTypes.object,
    tabs: PropTypes.array,
    localeMenuOpen: PropTypes.bool,
    accountMenuOpen: PropTypes.bool,
    onDrawerToggle: PropTypes.func,
    onLocaleMenuToggle: PropTypes.func,
    onAccountMenuToggle: PropTypes.func,
};

Header.defaultProps = {
    loading: false,

    variant: 'full',
    primaryAction: {},
    tabs: [],
    localeMenuOpen: false,
    accountMenuOpen: false,
};

const lightColor = 'rgba(255, 255, 255, 0.7)';

const styles = theme => ({
    primaryBar: {
        paddingTop: 8,
    },

    primaryBarSlim: {
        paddingTop: 8,
        paddingBottom: 8,
    },

    navLinkMenuWrapper: {
        position: 'relative',
        display: 'inline-block',
    },

    navLinkMenu: {
        position: 'absolute',
        padding: '8px 20px',
        right: 0,
        zIndex: 9999,
    },

    navLinkMenuItemIcon: {
        marginRight: 16,
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

    button: {
        borderColor: lightColor,
    },
});

export default withStyles(styles)(Header);
