import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import {
    colors,
    Divider,
    Drawer,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Tooltip,
    Typography,
    withStyles,
} from '@material-ui/core';

import {
    ChevronLeft as ChevronLeftIcon,
    Dashboard as DashboardIcon,
    People as PeopleIcon,
} from '@material-ui/icons';

import { APP } from '../../../config';
import * as NavigationUtils from '../../../utils/Navigation';
import { Skeleton } from '../../../ui';

import brandLogoLight from '../../../../img/logos/short-light.svg';
import brandLogoDark from '../../../../img/logos/short-dark.svg';

function Sidebar(props) {
    const {
        classes,
        location,
        pageProps,
        pageTitle, // Never used here.
        primaryAction, // Never used here.
        staticContext, // Never used here.
        loading,
        navigate,
        ...other
    } = props;
    const { variant, onClose } = props;
    const { nightMode } = pageProps;

    const homeLink = {
        name: Lang.get('navigation.dashboard'),
        icon: <DashboardIcon />,
        path: NavigationUtils._route('backoffice.home'),
    };

    const linkGroups = [
        {
            name: Lang.get('navigation.resources'),
            links: [
                {
                    name: Lang.get('navigation.users'),
                    icon: <PeopleIcon />,
                    path: NavigationUtils._route('backoffice.users.index'),
                },
            ],
        },
    ];

    const renderNavigating = (
        <List disablePadding className={classes.links}>
            <ListItem
                className={classNames(
                    classes.brand,
                    classes.link,
                    classes.linkGroup,
                    classes.brandLoading,
                )}
                style={{ paddingTop: 25 }}
            >
                <Skeleton
                    width={175}
                    color={nightMode && colors.grey['A700']}
                    highlightColor={nightMode && colors.grey['A400']}
                />

                <div className={classes.grow} />

                {variant === 'persistent' && (
                    <Skeleton
                        circle
                        width={30}
                        height={30}
                        color={nightMode && colors.grey['A700']}
                        highlightColor={nightMode && colors.grey['A400']}
                    />
                )}
            </ListItem>

            <Divider className={classes.topDivider} />

            <ListItem
                className={classNames(
                    classes.link,
                    classes.linkGroup,
                    classes.linkLoading,
                )}
            >
                <span className={classes.linkIconLoading}>
                    <Skeleton
                        circle
                        width={25}
                        height={25}
                        color={nightMode && colors.grey['A700']}
                        highlightColor={nightMode && colors.grey['A400']}
                    />
                </span>

                <span className={classes.linkTextLoading}>
                    <Skeleton
                        width={100}
                        color={nightMode && colors.grey['A700']}
                        highlightColor={nightMode && colors.grey['A400']}
                    />
                </span>
            </ListItem>

            {linkGroups.map(({ name, links }) => (
                <React.Fragment key={name}>
                    <ListItem
                        className={classNames(
                            classes.linkGroupHeader,
                            classes.linkLoading,
                        )}
                    >
                        <Skeleton
                            width={100}
                            color={nightMode && colors.grey['A700']}
                            highlightColor={nightMode && colors.grey['A400']}
                        />
                    </ListItem>

                    {links.map(({ name }) => (
                        <ListItem
                            key={name}
                            className={classNames(
                                classes.link,
                                classes.linkLoading,
                            )}
                        >
                            <span className={classes.linkIconLoading}>
                                <Skeleton
                                    circle
                                    width={25}
                                    height={25}
                                    color={nightMode && colors.grey['A700']}
                                    highlightColor={
                                        nightMode && colors.grey['A400']
                                    }
                                />
                            </span>

                            <span className={classes.linkTextLoading}>
                                <Skeleton
                                    width={100}
                                    color={nightMode && colors.grey['A700']}
                                    highlightColor={
                                        nightMode && colors.grey['A400']
                                    }
                                />
                            </span>
                        </ListItem>
                    ))}

                    <Divider className={classes.divider} />
                </React.Fragment>
            ))}
        </List>
    );

    const renderNavigated = (
        <List className={classes.links}>
            <ListItem
                className={classNames(
                    classes.brand,
                    classes.link,
                    classes.linkGroup,
                )}
            >
                <img
                    src={nightMode ? brandLogoDark : brandLogoLight}
                    alt="company-logo"
                    className={classes.brandLogo}
                />

                <Typography color="inherit" variant="h6">
                    {APP.name}
                </Typography>

                <div className={classes.grow} />

                {variant === 'persistent' && (
                    <Tooltip title={Lang.get('navigation.close_drawer')}>
                        <IconButton onClick={onClose}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </ListItem>

            <Divider className={classes.topDivider} />

            <ListItem
                button
                dense
                className={classNames(
                    classes.link,
                    classes.linkGroup,
                    location.pathname === homeLink.path && classes.linkActive,
                )}
                onClick={() => navigate(homeLink.path)}
            >
                <ListItemIcon>{homeLink.icon}</ListItemIcon>

                <ListItemText
                    classes={{
                        primary: classes.linkText,
                    }}
                >
                    {homeLink.name}
                </ListItemText>
            </ListItem>

            {linkGroups.map(({ name, links }) => (
                <React.Fragment key={name}>
                    <ListItem className={classes.linkGroupHeader}>
                        <ListItemText
                            classes={{
                                primary: classes.linkGroupHeaderPrimary,
                            }}
                        >
                            {name}
                        </ListItemText>
                    </ListItem>

                    {links.map(({ name, icon, path }) => (
                        <ListItem
                            button
                            dense
                            key={name}
                            className={classNames(
                                classes.link,
                                location.pathname === path &&
                                    classes.linkActive,
                            )}
                            onClick={() => navigate(path)}
                        >
                            <ListItemIcon>{icon}</ListItemIcon>

                            <ListItemText
                                classes={{
                                    primary: classes.linkText,
                                    textDense: classes.textDense,
                                }}
                            >
                                {name}
                            </ListItemText>
                        </ListItem>
                    ))}

                    <Divider className={classes.divider} />
                </React.Fragment>
            ))}

            <div style={{ height: 700 }} />
        </List>
    );

    return (
        <Drawer variant="permanent" {...other}>
            <Grid container>
                {loading ? renderNavigating : renderNavigated}
            </Grid>
        </Drawer>
    );
}

Sidebar.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    PaperProps: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    pageProps: PropTypes.object.isRequired,
};

const drawerWidth = 255;

const styles = theme => ({
    links: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
        },
    },

    brand: {
        display: 'flex',
        fontSize: 24,
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.common.white,
    },

    brandLogo: {
        width: 25,
        marginRight: 10,
    },

    linkGroupHeader: {
        paddingTop: 16,
        paddingBottom: 16,
    },

    linkGroupHeaderPrimary: {
        color:
            theme.palette.type === 'dark'
                ? theme.palette.text.primary
                : theme.palette.text.secondary,
    },

    link: {
        paddingTop: 4,
        paddingBottom: 4,
        color: theme.palette.text.secondary,
    },

    linkGroup: {
        backgroundColor:
            theme.palette.type === 'dark'
                ? theme.palette.grey[800]
                : theme.palette.common.white,
        paddingTop: 16,
        paddingBottom: 16,
    },

    linkText: {
        color: 'inherit',
        fontSize: theme.typography.fontSize,
        '&$textDense': {
            fontSize: theme.typography.fontSize,
        },
    },

    linkActive: {
        color: theme.palette.primary.main,
    },

    grow: {
        flexGrow: 1,
    },

    textDense: {},

    divider: {
        marginTop: theme.spacing.unit * 2,
        backgroundColor:
            theme.palette.type === 'dark'
                ? theme.palette.grey['700']
                : theme.palette.grey['200'],
    },

    topDivider: {
        backgroundColor:
            theme.palette.type === 'dark'
                ? theme.palette.grey['700']
                : theme.palette.grey['200'],
    },

    footer: {
        position: 'relative',
    },

    brandLoading: {
        padding: '16px 12px',
    },

    linkLoading: {
        padding: 12,
        display: 'flex',
        flexDirection: 'row',
    },

    linkIconLoading: {
        marginRight: theme.spacing.unit * 2,
    },

    linkTextLoading: {
        marginTop: theme.spacing.unit / 2,
    },
});

export default withStyles(styles)(Sidebar);
