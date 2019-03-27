import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import {
    colors,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    withStyles,
} from '@material-ui/core';

import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
} from '@material-ui/icons';

import * as NavigationUtils from '../../../utils/Navigation';
import { Skeleton } from '../../../ui';

import brandLogoLight from '../../../../img/logos/full-light.svg';
import brandLogoDark from '../../../../img/logos/full-dark.svg';

const Sidebar = props => {
    const { classes, locationPathname, pageProps, navigate, ...other } = props;
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
        <div>
            <div
                className={classNames(
                    classes.brand,
                    classes.link,
                    classes.linkGroup,
                    classes.brandLoading,
                )}
            >
                <Skeleton
                    width={100}
                    color={nightMode && colors.grey['A700']}
                    highlightColor={nightMode && colors.grey['A400']}
                />
            </div>

            <Divider className={classes.topDivider} />

            <div
                className={classNames(
                    classes.link,
                    classes.linkGroup,
                    classes.linkActionable,
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
            </div>

            {linkGroups.map(({ name, links }) => (
                <React.Fragment key={name}>
                    <div
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
                    </div>

                    {links.map(({ name }) => (
                        <div
                            key={name}
                            className={classNames(
                                classes.link,
                                classes.linkActionable,
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
                        </div>
                    ))}

                    <Divider className={classes.divider} />
                </React.Fragment>
            ))}
        </div>
    );

    const renderNavigated = (
        <List disablePadding>
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
            </ListItem>

            <Divider className={classes.topDivider} />

            <ListItem
                button
                dense
                className={classNames(
                    classes.link,
                    classes.linkGroup,
                    classes.linkActionable,
                    locationPathname === homeLink.path && classes.linkActive,
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
                                classes.linkActionable,
                                locationPathname === path && classes.linkActive,
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
        </List>
    );

    return (
        <Drawer variant="permanent" {...other}>
            {pageProps.navigating ? renderNavigating : renderNavigated}
        </Drawer>
    );
};

Sidebar.propTypes = {
    classes: PropTypes.object.isRequired,
    pageProps: PropTypes.object.isRequired,
    locationPathname: PropTypes.string,
};

const styles = theme => ({
    brand: {
        fontSize: 24,
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.common.white,
    },

    brandLogo: {
        width: 230,
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

    linkActionable: {
        '&:hover': {
            color:
                theme.palette.type === 'dark'
                    ? theme.palette.text.primary
                    : theme.palette.text.secondary,
        },
    },

    linkActive: {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.primary.main,
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
        marginBottom: theme.spacing.unit * 2,
        backgroundColor:
            theme.palette.type === 'dark'
                ? theme.palette.grey['700']
                : theme.palette.grey['200'],
    },

    brandLoading: {
        padding: '1rem 0.75rem',
    },

    linkLoading: {
        padding: '0.75rem',
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
