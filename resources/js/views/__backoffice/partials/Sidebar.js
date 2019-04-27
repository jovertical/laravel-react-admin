import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import {
    Divider,
    Drawer,
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
    ExpandLess as ExpandLessIcon,
    People as PeopleIcon,
    Security as SecurityIcon,
    ShowChart as ShowChartIcon,
} from '@material-ui/icons';

import { APP } from '../../../config';
import * as NavigationUtils from '../../../utils/Navigation';
import * as StringUtils from '../../../utils/String';

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

    const [activeLinkGroup, setActiveLinkGroup] = useState(-1);

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

                {
                    name: 'Roles',
                    icon: <SecurityIcon />,
                    path: null,
                },
            ],
        },

        {
            name: 'Analytics',
            links: [
                {
                    name: 'Traffic',
                    icon: <ShowChartIcon />,
                    path: null,
                },
            ],
        },
    ];

    const renderNavigating = 'Loading...';

    const renderNavigated = (
        <List className={classes.links}>
            <ListItem className={classNames(classes.brand, classes.link)}>
                <img
                    src={nightMode ? brandLogoDark : brandLogoLight}
                    alt="company-logo"
                    className={classes.brandLogo}
                />

                <Typography className={classes.text} variant="h6">
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

            <Divider className={classes.divider} />

            <ListItem
                button
                dense
                className={classNames(classes.link, {
                    [classes.active]: location.pathname === homeLink.path,
                })}
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

            <Divider className={classes.divider} />

            <List disablePadding className={classes.linkGroups}>
                {linkGroups
                    .filter(linkGroup => linkGroup.links.length > 0)
                    .map(({ name, links }, key) => (
                        <React.Fragment key={key}>
                            <div
                                className={classNames(classes.linkGroup, {
                                    [classes.opened]: key === activeLinkGroup,
                                    [classes.closed]: key !== activeLinkGroup,
                                })}
                                onClick={() =>
                                    key !== activeLinkGroup &&
                                    setActiveLinkGroup(key)
                                }
                            >
                                <ListItem
                                    onClick={() => setActiveLinkGroup(-1)}
                                    className={classNames(
                                        classes.linkGroupHeader,
                                        {
                                            [classes.opened]:
                                                key === activeLinkGroup,
                                        },
                                    )}
                                >
                                    <ListItemText
                                        classes={{
                                            primary: classes.text,
                                        }}
                                    >
                                        {name}
                                    </ListItemText>

                                    {key === activeLinkGroup && (
                                        <ListItemIcon className={classes.text}>
                                            <ExpandLessIcon />
                                        </ListItemIcon>
                                    )}
                                </ListItem>

                                {key === activeLinkGroup ? (
                                    <>
                                        {links.map(({ name, icon, path }) => (
                                            <ListItem
                                                button
                                                dense
                                                key={name}
                                                className={classNames(
                                                    classes.link,
                                                    classes.grouped,
                                                    {
                                                        [classes.active]:
                                                            location.pathname ===
                                                            path,
                                                    },
                                                )}
                                                onClick={() => navigate(path)}
                                            >
                                                <ListItemIcon>
                                                    {icon}
                                                </ListItemIcon>

                                                <ListItemText
                                                    classes={{
                                                        primary:
                                                            classes.linkText,
                                                        textDense:
                                                            classes.textDense,
                                                    }}
                                                >
                                                    {name}
                                                </ListItemText>
                                            </ListItem>
                                        ))}
                                    </>
                                ) : (
                                    <ListItem>
                                        <Typography
                                            noWrap
                                            color="textSecondary"
                                        >
                                            {StringUtils._limit(
                                                links
                                                    .map(link => link.name)
                                                    .join(', '),
                                                30,
                                            )}
                                        </Typography>
                                    </ListItem>
                                )}

                                <div className={classes.linkGroupSpacer} />
                            </div>

                            <Divider className={classes.divider} />
                        </React.Fragment>
                    ))}
            </List>
        </List>
    );

    return (
        <Drawer variant="permanent" {...other}>
            {loading ? renderNavigating : renderNavigated}
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

const styles = theme => {
    const primaryAccent =
        theme.palette.type === 'dark'
            ? theme.palette.grey[700]
            : theme.palette.grey[200];

    const activeAccent =
        theme.palette.type === 'dark'
            ? theme.palette.grey['A400']
            : theme.palette.grey['A100'];

    return {
        links: {
            width: drawerWidth,
        },

        link: {
            backgroundColor:
                theme.palette.type === 'dark'
                    ? theme.palette.grey[800]
                    : theme.palette.common.white,
            color: theme.palette.text.secondary,
            paddingBottom: 16,
            paddingTop: 16,
            '&$active': {
                color: theme.palette.primary.main,
            },
            '&$grouped': {
                backgroundColor: activeAccent,
                paddingBottom: 4,
                paddingTop: 4,
                '&:hover': {
                    backgroundColor: primaryAccent,
                },
            },
        },

        active: {},
        grouped: {},

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

        linkGroups: {},

        linkGroup: {
            '&$closed': {
                '&:hover': {
                    cursor: 'pointer',
                    backgroundColor: primaryAccent,
                },
            },
            '&$opened': {
                backgroundColor: activeAccent,
            },
        },

        closed: {},
        opened: {},

        linkGroupHeader: {
            paddingTop: 16,
            paddingBottom: 0,
            '&$opened': {
                paddingBottom: 16,
            },
            '&:hover': {
                cursor: 'pointer',
            },
        },

        linkGroupSpacer: {
            paddingBottom: theme.spacing.unit * 2,
        },

        text: {
            color:
                theme.palette.type === 'dark'
                    ? theme.palette.text.primary
                    : theme.palette.text.secondary,
        },

        linkText: {
            color: 'inherit',
            fontSize: theme.typography.fontSize,
            '&$textDense': {
                fontSize: theme.typography.fontSize,
            },
        },

        textDense: {},

        grow: {
            flexGrow: 1,
        },

        divider: {
            backgroundColor: primaryAccent,
        },
    };
};

export default withStyles(styles)(Sidebar);
