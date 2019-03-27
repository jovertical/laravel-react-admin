import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
    Button,
    colors,
    IconButton,
    Snackbar as MuiSnackbar,
    SnackbarContent,
    Typography,
    withStyles,
} from '@material-ui/core';

import {
    CheckCircle as CheckCircleIcon,
    Close as CloseIcon,
    Warning as WarningIcon,
    Error as ErrorIcon,
    Info as InfoIcon,
} from '@material-ui/icons';

const icons = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};

const Snackbar = props => {
    const {
        classes,
        className,
        type,
        body,
        closed,
        action,
        actionText,
        ...other
    } = props;
    const Icon = icons[type];

    let primaryAction = null;

    if (action && actionText) {
        primaryAction = (
            <Button key="undo" color="inherit" size="small" onClick={action}>
                <Typography className={classes.text}>{actionText}</Typography>
            </Button>
        );
    }

    let actions = [
        <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            className={classes.close}
            onClick={closed}
        >
            <CloseIcon className={classes.icon} />
        </IconButton>,
    ];

    if (primaryAction) {
        actions.push(primaryAction);
    }

    return (
        <MuiSnackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            open
            autoHideDuration={5000}
            onClose={closed}
        >
            <SnackbarContent
                className={classNames(classes[type], className)}
                aria-describedby="client-snackbar"
                message={
                    <span id="client-snackbar" className={classes.message}>
                        <Icon
                            className={classNames(
                                classes.icon,
                                classes.iconVariant,
                            )}
                        />

                        <Typography className={classes.text}>{body}</Typography>
                    </span>
                }
                action={actions.reverse()}
                {...other}
            />
        </MuiSnackbar>
    );
};

Snackbar.propTypes = {
    type: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
    body: PropTypes.string.isRequired,
    closed: PropTypes.func.isRequired,
    actionText: PropTypes.string,
    action: PropTypes.func,
};

const styles = theme => ({
    success: {
        backgroundColor: colors.green[600],
    },

    error: {
        backgroundColor: theme.palette.error.dark,
    },

    info: {
        backgroundColor: theme.palette.primary.dark,
    },

    warning: {
        backgroundColor: colors.amber[700],
    },

    icon: {
        fontSize: 20,
        color: theme.palette.common['white'],
    },

    text: {
        color: theme.palette.common['white'],
    },

    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing.unit,
    },

    message: {
        display: 'flex',
        alignItems: 'center',
    },
});

export default withStyles(styles)(Snackbar);
