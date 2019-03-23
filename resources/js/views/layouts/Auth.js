import React from 'react';
import PropTypes from 'prop-types';
import {
    Grid,
    Card,
    Typography,
    Button,
    LinearProgress,
    withStyles,
} from '@material-ui/core';

import logo from '../../../img/logos/1/512.png';

const Auth = props => (
    <Grid
        container
        justify="center"
        alignItems="center"
        className={props.classes.container}
    >
        <Grid item className={props.classes.content}>
            <>
                {props.loading && (
                    <span>
                        <LinearProgress className={props.classes.progress} />
                    </span>
                )}

                <Card className={props.classes.form}>
                    <Grid
                        container
                        className={props.classes.logoContainer}
                        justify="center"
                    >
                        <img
                            src={logo}
                            alt="company-logo"
                            className={props.classes.logo}
                        />
                    </Grid>

                    <Grid container direction="column" justify="space-between">
                        <Grid item className={props.classes.heading}>
                            <Typography variant="h5" component="h3">
                                {props.message.hasOwnProperty('title')
                                    ? props.message.title
                                    : props.title}
                            </Typography>

                            <Typography
                                variant="h6"
                                component="h4"
                                color="textSecondary"
                            >
                                {props.message.hasOwnProperty('body')
                                    ? props.message.body
                                    : props.subTitle}
                            </Typography>
                        </Grid>

                        {props.message.hasOwnProperty('type') ? (
                            <Grid container justify="space-between">
                                <Grid item />

                                <Grid item className={props.classes.formGroup}>
                                    <Button
                                        type="button"
                                        variant="contained"
                                        color="primary"
                                        onClick={props.message.action}
                                    >
                                        Next
                                    </Button>
                                </Grid>
                            </Grid>
                        ) : (
                            <Grid item>{props.children}</Grid>
                        )}
                    </Grid>
                </Card>
            </>
        </Grid>
    </Grid>
);

Auth.propTypes = {
    loading: PropTypes.bool,
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
        .isRequired,
    message: PropTypes.object,
};

const styles = theme => ({
    container: {
        [theme.breakpoints.up('sm')]: {
            minHeight: '100vh',
        },
    },

    content: {
        width: '32rem',
    },

    form: {
        padding: '1rem',
        [theme.breakpoints.up('sm')]: {
            padding: '2rem',
            minHeight: '75vh',
        },
    },

    progress: {
        margin: '0 0.5rem',
        minHeight: '0.5rem',
        borderTopRightRadius: '100%',
        borderTopLeftRadius: '100%',
    },

    logoContainer: {
        textAlign: 'center',
    },

    logo: {
        width: '5rem',
        height: '5rem',
    },

    heading: {
        margin: '2.5rem 0rem',
        textAlign: 'center',
    },

    formGroup: {
        padding: theme.spacing.unit * 2,
        paddingTop: 0,
    },
});

export default withStyles(styles)(Auth);
