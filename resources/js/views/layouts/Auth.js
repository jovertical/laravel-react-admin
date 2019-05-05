import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Grid, Card, Typography, Button, withStyles } from '@material-ui/core';

import { LinearIndeterminate } from '../../ui/Loaders';
import logoLight from '../../../img/logos/short-light.svg';
import logoDark from '../../../img/logos/short-dark.svg';
import { AppContext } from '../../AppContext';

/**
 * Format a given title
 *
 * @param {string} title The data that may need transformation
 */
const formattedTitle = title => {
    if (typeof title === 'string') {
        return (
            <Typography variant="h5" component="h3">
                {title}
            </Typography>
        );
    }

    return title;
};

/**
 * Format a given subTitle
 *
 * @param {string} subTitle The data that may need transformation
 */
const formattedSubTitle = subTitle => {
    if (typeof subTitle === 'string') {
        return <Typography color="textSecondary">{subTitle}</Typography>;
    }

    return subTitle;
};

const Auth = props => {
    const { nightMode } = useContext(AppContext);

    return (
        <Grid
            container
            justify="center"
            alignItems="center"
            className={props.classes.container}
        >
            <Grid item className={props.classes.content}>
                <>
                    {props.loading && <LinearIndeterminate />}

                    <Card className={props.classes.form}>
                        <Grid
                            container
                            className={props.classes.logoContainer}
                            justify="center"
                        >
                            <img
                                src={nightMode ? logoDark : logoLight}
                                alt="company-logo"
                                className={props.classes.logo}
                            />
                        </Grid>

                        <Grid
                            container
                            direction="column"
                            justify="space-between"
                        >
                            <Grid item className={props.classes.heading}>
                                {props.message.hasOwnProperty('title')
                                    ? formattedTitle(props.message.title)
                                    : formattedTitle(props.title)}

                                {props.message.hasOwnProperty('body')
                                    ? formattedSubTitle(props.message.body)
                                    : formattedSubTitle(props.subTitle)}
                            </Grid>

                            {props.message.hasOwnProperty('type') ? (
                                <Grid container justify="space-between">
                                    <Grid item />

                                    <Grid
                                        item
                                        className={props.classes.formGroup}
                                    >
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
};

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
        width: 512,
    },

    form: {
        padding: 16,
        [theme.breakpoints.up('sm')]: {
            padding: 32,
            minHeight: '75vh',
        },
    },

    logoContainer: {
        textAlign: 'center',
    },

    logo: {
        width: 80,
        height: 80,
    },

    heading: {
        margin: '40px 0px',
        textAlign: 'center',
    },

    formGroup: {
        padding: theme.spacing.unit * 2,
        paddingTop: 0,
    },
});

export default withStyles(styles)(Auth);
