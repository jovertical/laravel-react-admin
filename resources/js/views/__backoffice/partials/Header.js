import React from 'react';
import PropTypes from 'prop-types';

import {
    AppBar,
    Avatar,
    Button,
    Grid,
    Hidden,
    IconButton,
    Tab,
    Tabs,
    Toolbar,
    Tooltip,
    Typography,
    withStyles,
} from '@material-ui/core';

import {
    Help as HelpIcon,
    Menu as MenuIcon,
    Notifications as NotificationsIcon,
} from '@material-ui/icons';

const Header = props => {
    const { classes, onDrawerToggle, pageTitle } = props;

    return (
        <>
            <AppBar color="primary" position="sticky" elevation={0}>
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
                                href="#"
                            >
                                Go to docs
                            </Typography>
                        </Grid>

                        <Grid item>
                            <Tooltip title="Alerts • No alters">
                                <IconButton color="inherit">
                                    <NotificationsIcon />
                                </IconButton>
                            </Tooltip>
                        </Grid>

                        <Grid item>
                            <IconButton
                                color="inherit"
                                className={classes.iconButtonAvatar}
                            >
                                <Avatar
                                    className={classes.avatar}
                                    src="/static/images/avatar/1.jpg"
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
                            <Typography color="inherit" variant="h5">
                                {pageTitle}
                            </Typography>
                        </Grid>

                        <Grid item>
                            <Button
                                className={classes.button}
                                variant="outlined"
                                color="inherit"
                                size="small"
                            >
                                Web setup
                            </Button>
                        </Grid>

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
                    <Tab textColor="inherit" label="List" />
                </Tabs>
            </AppBar>
        </>
    );
};

Header.propTypes = {
    classes: PropTypes.object.isRequired,
    pageTitle: PropTypes.string,
    onDrawerToggle: PropTypes.func.isRequired,
};

const lightColor = 'rgba(255, 255, 255, 0.7)';

const styles = theme => ({
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
