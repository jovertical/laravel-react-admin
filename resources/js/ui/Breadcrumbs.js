import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

import { Link, Typography, withStyles } from '@material-ui/core';

import { Breadcrumbs as MuiBreadcrumbs } from '@material-ui/lab';

import { Home as HomeIcon } from '@material-ui/icons';

import * as NavigationUtils from '../helpers/Navigation';
import * as StringUtils from '../helpers/String';

function Breadcrumbs(props) {
    const { classes, segments, blacklistedSegments, ...other } = props;

    return (
        <MuiBreadcrumbs arial-label="Breadcrumb" {...other}>
            {segments.length > 0 ? (
                <Link
                    color="inherit"
                    component={linkProps => (
                        <RouterLink
                            {...linkProps}
                            to={NavigationUtils.route('backoffice.home')}
                        />
                    )}
                    className={classes.breadcrumb}
                >
                    <HomeIcon className={classes.icon} />
                </Link>
            ) : (
                <HomeIcon className={classes.icon} />
            )}

            {segments.map((segment, key) => {
                const renderText = (
                    <Typography key={key} className={classes.breadcrumb}>
                        {StringUtils.uppercaseFirst(segment)}
                    </Typography>
                );

                // Make a blacklisted segment plain text
                if (blacklistedSegments.indexOf(segment) > -1) {
                    return renderText;
                }

                // The last segment should be plain text
                if (key + 1 === segments.length) {
                    return renderText;
                }

                // Make numeric segment hidden
                if (!isNaN(parseInt(segment))) {
                    return null;
                }

                return (
                    <Link
                        key={key}
                        color="inherit"
                        component={linkProps => (
                            <RouterLink
                                {...linkProps}
                                to={
                                    '/' +
                                    segments
                                        .filter(
                                            (s, i) =>
                                                i <= segments.indexOf(segment),
                                        )
                                        .join('/')
                                }
                            />
                        )}
                        className={classes.breadcrumb}
                    >
                        {StringUtils.uppercaseFirst(segment)}
                    </Link>
                );
            })}
        </MuiBreadcrumbs>
    );
}

Breadcrumbs.propTypes = {
    segments: PropTypes.array.isRequired,
    blacklistedSegments: PropTypes.array,
};

Breadcrumbs.defaultProps = {
    blacklistedSegments: [],
};

const styles = theme => ({
    breadcrumb: {
        display: 'flex',
    },

    icon: {
        marginRight: theme.spacing.unit / 2,
        width: 20,
    },
});

export default withStyles(styles)(Breadcrumbs);
