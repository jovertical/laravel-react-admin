import React, { useState, useEffect, useContext } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import {
    Divider,
    Drawer,
    IconButton,
    Hidden,
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
    ChevronRight as ChevronRightIcon,
    Dashboard as DashboardIcon,
    ExpandLess as ExpandLessIcon,
    People as PeopleIcon,
    Security as SecurityIcon,
    ShowChart as ShowChartIcon,
} from '@material-ui/icons';

import { APP } from '../../../config';
import * as NavigationUtils from '../../../helpers/Navigation';
import * as StringUtils from '../../../helpers/String';

import brandLogoLight from '../../../../img/logos/short-light.svg';
import brandLogoDark from '../../../../img/logos/short-dark.svg';
import { AppContext } from '../../../AppContext';

function Sidebar(props) {
    const { nightMode } = useContext(AppContext);
    const {
        classes,
        location,
        pageTitle, // Never used here.
        primaryAction, // Never used here.
        staticContext, // Never used here.

        loading,
        navigate,
        minimized,
        setMinimized,

        ...other
    } = props;

    const { variant, onClose } = props;

    const [activeLinkGroup, setActiveLinkGroup] = useState(-1);
    const [initialized, setInitialized] = useState(false);

    const homeLink = {
        name: Lang.get('navigation.dashboard'),
        icon: (
            <Tooltip title={minimized ? Lang.get('navigation.dashboard') : ''}>
                <DashboardIcon />
            </Tooltip>
        ),
        path: NavigationUtils.route('backoffice.home'),
    };

    const linkGroups = [
        {
            name: Lang.get('navigation.resources'),
            id: 'resources',
            links: [
                {
                    name: Lang.get('navigation.users'),
                    icon: (
                        <Tooltip
                            title={
                                minimized ? Lang.get('navigation.users') : ''
                            }
                        >
                            <PeopleIcon />
                        </Tooltip>
                    ),
                    path: NavigationUtils.route(
                        'backoffice.resources.users.index',
                    ),
                },

                {
                    name: Lang.get('navigation.roles'),
                    icon: (
                        <Tooltip
                            title={
                                minimized ? Lang.get('navigation.roles') : ''
                            }
                        >
                            <SecurityIcon />
                        </Tooltip>
                    ),
                    path: null,
                },
            ],
        },

        {
            name: 'Analytics',
            id: 'analytics',
            links: [
                {
                    name: 'Traffic',
                    icon: <ShowChartIcon />,
                    path: null,
                },
            ],
        },
    ];

    useEffect(() => {
        if (initialized) {
            return;
        }

        const groupId = location.pathname.split('/')[1];
        const groupIndex = linkGroups.findIndex(lg => lg.id === groupId);

        if (groupId === '') {
            return;
        }

        if (groupIndex === activeLinkGroup) {
            return;
        }

        setActiveLinkGroup(groupIndex);

        setInitialized(true);
    });

    const renderHeader = (
        <ListItem className={classNames(classes.header, classes.link)}>
            <img
                src={nightMode ? brandLogoDark : brandLogoLight}
                alt="company-logo"
                className={classNames(classes.logo, {
                    [classes.center]: minimized,
                })}
            />

            {!minimized && (
                <>
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
                </>
            )}
        </ListItem>
    );

    const renderLinkGroups = (
        <List disablePadding className={classes.linkGroups}>
            {linkGroups
                .filter(linkGroup => linkGroup.links.length > 0)
                .filter((linkGroup, i) =>
                    !minimized ? linkGroup : i === activeLinkGroup,
                )
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
                            {!minimized ? (
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
                            ) : (
                                <div className={classes.linkGroupHeader} />
                            )}

                            {key === activeLinkGroup || minimized ? (
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
                                                    [classes.center]: minimized,
                                                },
                                            )}
                                            onClick={() => navigate(path)}
                                        >
                                            <ListItemIcon>{icon}</ListItemIcon>

                                            {!minimized && (
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
                                            )}
                                        </ListItem>
                                    ))}
                                </>
                            ) : (
                                <ListItem>
                                    <Typography noWrap color="textSecondary">
                                        {StringUtils.limit(
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
    );

    const renderLinks = (
        <List
            className={classNames(classes.links, {
                [classes.minimized]: minimized,
            })}
            disablePadding
        >
            <ListItem
                button
                dense
                className={classNames(classes.link, {
                    [classes.active]: location.pathname === homeLink.path,
                    [classes.center]: minimized,
                })}
                onClick={() => navigate(homeLink.path)}
            >
                <ListItemIcon>{homeLink.icon}</ListItemIcon>

                {!minimized && (
                    <ListItemText
                        classes={{
                            primary: classes.linkText,
                        }}
                    >
                        {homeLink.name}
                    </ListItemText>
                )}
            </ListItem>

            <Divider className={classes.divider} />

            {renderLinkGroups}
        </List>
    );

    const renderFooter = (
        <ListItem className={classes.footer}>
            {!minimized && <div className={classes.grow} />}

            <ListItemIcon
                color="inherit"
                onClick={() => setMinimized(!minimized)}
            >
                <Tooltip
                    title={
                        minimized
                            ? Lang.get('navigation.maximize_drawer')
                            : Lang.get('navigation.minimize_drawer')
                    }
                >
                    <IconButton>
                        {!minimized ? (
                            <ChevronLeftIcon />
                        ) : (
                            <ChevronRightIcon />
                        )}
                    </IconButton>
                </Tooltip>
            </ListItemIcon>
        </ListItem>
    );

    return (
        <Drawer variant="permanent" {...other}>
            <div
                className={classNames(classes.nav, {
                    [classes.minimized]: minimized,
                })}
            >
                {renderHeader}

                <Divider className={classes.divider} />

                <div className={classes.linksWrapper}>{renderLinks}</div>

                <Hidden xsDown>
                    {variant !== 'persistent' && (
                        <>
                            {!minimized && (
                                <Divider className={classes.divider} />
                            )}

                            {renderFooter}
                        </>
                    )}
                </Hidden>
            </div>
        </Drawer>
    );
}

Sidebar.propTypes = {
    PaperProps: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,

    open: PropTypes.bool,
    onClose: PropTypes.func,
    minimized: PropTypes.bool,
    setMinimized: PropTypes.func,
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

    const defaultAccent =
        theme.palette.type === 'dark'
            ? theme.palette.grey[800]
            : theme.palette.common.white;

    return {
        nav: {
            [theme.breakpoints.up('sm')]: {
                width: drawerWidth,
                overflow: 'hidden',
            },

            '&$minimized': {
                [theme.breakpoints.up('sm')]: {
                    width: 69,
                },
            },
        },

        minimized: {},

        header: {
            height: '10vh',
            fontSize: 24,
            fontFamily: theme.typography.fontFamily,
            color: theme.palette.common.white,
        },

        logo: {
            width: 25,
            marginRight: 15,
            '&$center': {
                marginLeft: 7,
            },
        },

        linksWrapper: {
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
                backgroundColor: defaultAccent,
                width: 8,
            },

            '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#8a9bb2',
                borderRadius: 8,
                border: `2px solid ${defaultAccent}`,
            },
        },

        links: {
            height: '80vh',
            '&$minimized': {
                height: '100%',
            },
        },

        link: {
            backgroundColor: defaultAccent,
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

        center: {
            display: 'flex',
            justifyContent: 'center',
        },

        grow: {
            flexGrow: 1,
        },

        divider: {
            backgroundColor: primaryAccent,
        },

        footer: {
            display: 'flex',
            justifyContent: 'center',
            height: '10vh',
        },
    };
};

export default withStyles(styles)(Sidebar);
