import React, { Component } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Formik, Form, withFormik } from 'formik';
import * as Yup from 'yup';

import {
    Button,
    Grid,
    IconButton,
    InputAdornment,
    Link,
    TextField,
    withStyles,
} from '@material-ui/core';

import {
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
} from '@material-ui/icons';

import * as NavigationUtils from '../../../utils/Navigation';
import * as UrlUtils from '../../../utils/URL';
import { Auth as AuthLayout } from '../../layouts';

class PasswordReset extends Component {
    state = {
        loading: false,
        message: {},
        showPassword: false,
        showPasswordConfirmation: false,
    };

    /**
     * Handle password visibility toggle.
     *
     * @param {string} name The name of the password field flag.
     *
     * @return {undefined}
     */
    handlePasswordVisibilityToggle = name => {
        this.setState(prevState => {
            return {
                [name]: !prevState[name],
            };
        });
    };

    /**
     * Handle Password Reset submission.
     *
     * @param {object} event
     *
     * @return {undefined}
     */
    handleSubmit = async (values, { setSubmitting }) => {
        setSubmitting(false);
    };

    render() {
        const { classes, location } = this.props;
        const email = UrlUtils._queryParams(location.search).hasOwnProperty(
            'email',
        )
            ? UrlUtils._queryParams(location.search).email
            : '';

        const {
            loading,
            message,
            showPassword,
            showPasswordConfirmation,
        } = this.state;

        return (
            <AuthLayout
                {...this.props}
                title={Lang.get('navigation.password_reset_title')}
                subTitle={Lang.get('navigation.password_reset_subtitle')}
                loading={loading}
                message={message}
            >
                <Formik
                    initialValues={{
                        password: '',
                        password_confirmation: '',
                    }}
                    onSubmit={this.handleSubmit}
                    validationSchema={Yup.object().shape({
                        password: Yup.string()
                            .required(
                                Lang.get('validation.required', {
                                    attribute: 'password',
                                }),
                            )
                            .min(
                                8,
                                Lang.get('validation.min.string', {
                                    attribute: 'password',
                                    min: 8,
                                }),
                            )
                            .oneOf(
                                [Yup.ref('password_confirmation'), null],
                                Lang.get('validation.confirmed', {
                                    attribute: 'password',
                                }),
                            ),
                        password_confirmation: Yup.string()
                            .required(
                                Lang.get('validation.required', {
                                    attribute: 'password confirmation',
                                }),
                            )
                            .min(
                                8,
                                Lang.get('validation.min.string', {
                                    attribute: 'password confirmation',
                                    min: 8,
                                }),
                            ),
                    })}
                >
                    {({ values, handleChange, errors, isSubmitting }) => (
                        <Form>
                            <Grid container direction="column">
                                <Grid item className={classes.formGroup}>
                                    <TextField
                                        id="password"
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        label="Password"
                                        value={values.password}
                                        onChange={handleChange}
                                        variant="outlined"
                                        fullWidth
                                        error={errors.hasOwnProperty(
                                            'password',
                                        )}
                                        helperText={
                                            errors.hasOwnProperty('password') &&
                                            errors.password
                                        }
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="Toggle password visibility"
                                                        onClick={() =>
                                                            this.handlePasswordVisibilityToggle(
                                                                'showPassword',
                                                            )
                                                        }
                                                    >
                                                        {showPassword ? (
                                                            <VisibilityOffIcon />
                                                        ) : (
                                                            <VisibilityIcon />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>

                                <Grid item className={classes.formGroup}>
                                    <TextField
                                        id="password_confirmation"
                                        type={
                                            showPasswordConfirmation
                                                ? 'text'
                                                : 'password'
                                        }
                                        label="Password Confirmation"
                                        value={values.password_confirmation}
                                        onChange={handleChange}
                                        variant="outlined"
                                        fullWidth
                                        error={errors.hasOwnProperty(
                                            'password_confirmation',
                                        )}
                                        helperText={
                                            errors.hasOwnProperty(
                                                'password_confirmation',
                                            ) && errors.password_confirmation
                                        }
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="Toggle password visibility"
                                                        onClick={() =>
                                                            this.handlePasswordVisibilityToggle(
                                                                'showPasswordConfirmation',
                                                            )
                                                        }
                                                    >
                                                        {showPasswordConfirmation ? (
                                                            <VisibilityOffIcon />
                                                        ) : (
                                                            <VisibilityIcon />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>

                                <Grid item className={classes.formGroup}>
                                    <Link
                                        component={props => (
                                            <RouterLink
                                                {...props}
                                                to={{
                                                    search: UrlUtils._queryString(
                                                        {
                                                            username: email,
                                                        },
                                                    ),
                                                    pathname: NavigationUtils._route(
                                                        'auth.signin',
                                                    ),
                                                }}
                                            />
                                        )}
                                    >
                                        {Lang.get('navigation.signin')}
                                    </Link>
                                </Grid>
                            </Grid>

                            <Grid container justify="space-between">
                                <Grid item />

                                <Grid item className={classes.formGroup}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={
                                            (errors &&
                                                Object.keys(errors).length >
                                                    0) ||
                                            isSubmitting
                                        }
                                    >
                                        {Lang.get('navigation.reset')}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </AuthLayout>
        );
    }
}

const styles = theme => ({
    formGroup: {
        padding: theme.spacing.unit * 2,
        paddingTop: 0,
    },
});

export default withStyles(styles)(withFormik({})(PasswordReset));
