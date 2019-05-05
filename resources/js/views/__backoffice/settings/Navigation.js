import React from 'react';
import PropTypes from 'prop-types';

import {
    Grid,
    Hidden,
    ListItemIcon,
    MenuList,
    MenuItem,
    Paper,
    Typography,
    withStyles,
} from '@material-ui/core';

import { ChevronRight as ChevronRightIcon } from '@material-ui/icons';

function Navigation(props) {
    const { classes, history, location } = props;

    const links = [
        {
            path: '/settings/profile',
            text: 'Profile',
        },

        {
            path: '/settings/account',
            text: 'Account',
        },
    ];

    return (
        <Grid item md={4} sm={12} xs={12}>
            <Paper>
                <MenuList>
                    {links.map(link => (
                        <div key={link.path}>
                            <Hidden mdUp>
                                <MenuItem
                                    onClick={() =>
                                        history.push(`${link.path}?visible`)
                                    }
                                >
                                    <Typography>{link.text}</Typography>

                                    <ListItemIcon className={classes.icon}>
                                        <ChevronRightIcon />
                                    </ListItemIcon>
                                </MenuItem>
                            </Hidden>

                            <Hidden smDown>
                                <MenuItem
                                    onClick={() => history.push(link.path)}
                                    className={
                                        location.pathname === link.path
                                            ? classes.active
                                            : ''
                                    }
                                >
                                    <Typography>{link.text}</Typography>

                                    <ListItemIcon className={classes.icon}>
                                        <ChevronRightIcon />
                                    </ListItemIcon>
                                </MenuItem>
                            </Hidden>
                        </div>
                    ))}
                </MenuList>
            </Paper>
        </Grid>
    );
}

Navigation.propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};

const styles = theme => ({
    icon: {
        marginLeft: 'auto',
    },

    active: {
        borderRight: `3px solid ${theme.palette.primary.main}`,
    },
});

export default withStyles(styles)(Navigation);
