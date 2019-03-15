import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import {
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

import { APP } from '../../../config';
import * as NavigationUtils from '../../../utils/Navigation';

const Sidebar = props => {
    const { classes, locationPathname, navigate, ...other } = props;

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

    return (
        <Drawer variant="permanent" {...other}>
            <List disablePadding>
                <ListItem
                    className={classNames(
                        classes.title,
                        classes.link,
                        classes.linkGroup,
                    )}
                >
                    {APP.name}
                </ListItem>

                <ListItem
                    button
                    dense
                    className={classNames(
                        classes.link,
                        classes.linkGroup,
                        classes.linkActionable,
                        locationPathname === homeLink.path &&
                            classes.itemActive,
                    )}
                    onClick={() => navigate(homeLink.path)}
                >
                    <ListItemIcon>{homeLink.icon}</ListItemIcon>

                    <ListItemText
                        classes={{
                            primary: classes.linkPrimary,
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
                                    locationPathname === path &&
                                        classes.itemActive,
                                )}
                                onClick={() => navigate(path)}
                            >
                                <ListItemIcon>{icon}</ListItemIcon>

                                <ListItemText
                                    classes={{
                                        primary: classes.linkPrimary,
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
        </Drawer>
    );
};

Sidebar.propTypes = {
    classes: PropTypes.object.isRequired,
    locationPathname: PropTypes.string,
};

const styles = theme => ({
    linkGroupHeader: {
        paddingTop: 16,
        paddingBottom: 16,
    },

    linkGroupHeaderPrimary: {
        color: theme.palette.common.white,
    },

    link: {
        paddingTop: 4,
        paddingBottom: 4,
        color: 'rgba(255, 255, 255, 0.7)',
    },

    linkGroup: {
        backgroundColor: '#232f3e',
        boxShadow: '0 -1px 0 #404854 inset',
        paddingTop: 16,
        paddingBottom: 16,
    },

    title: {
        fontSize: 24,
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.common.white,
    },

    linkActionable: {
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
        },
    },

    itemActive: {
        color: '#4fc3f7',
    },

    linkPrimary: {
        color: 'inherit',
        fontSize: theme.typography.fontSize,
        '&$textDense': {
            fontSize: theme.typography.fontSize,
        },
    },

    textDense: {},

    divider: {
        marginTop: theme.spacing.unit * 2,
    },
});

const Styled = withStyles(styles)(Sidebar);

export { Styled as Sidebar };
