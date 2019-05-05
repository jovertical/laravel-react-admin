import React, { useState, useEffect, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Formik, Form } from 'formik';
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

import * as NavigationUtils from '../../../helpers/Navigation';
import * as UrlUtils from '../../../helpers/URL';
import { Auth as AuthLayout } from '../../layouts';
import { AppContext } from '../../../AppContext';

function PasswordReset(props) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({});
    const [email, setEmail] = useState('');
    const [passwordVisible, setPasswordVisibility] = useState(false);
    const [
        passwordConfirmationVisible,
        setPasswordConfirmationVisibility,
    ] = useState(false);

    /**
     * Handle password visibility toggle.
     *
     * @return {undefined}
     */
    const handlePasswordVisibilityToggle = () => {
        setPasswordVisibility(!passwordVisible);
    };

    /**
     * Handle password confirmation visibility toggle.
     *
     * @return {undefined}
     */
    const handlePasswordConfirmationVisibilityToggle = () => {
        setPasswordConfirmationVisibility(!passwordConfirmationVisible);
    };

    /**
     * Handle Password Reset submission.
     *
     * @param {object} event
     * @param {object} form
     *
     * @return {undefined}
     */
    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        setSubmitting(false);

        setLoading(true);

        try {
            const { authenticate } = useContext(AppContext);
            const { match } = props;
            const { token } = match.params;

            const response = await axios.patch(
                `api/v1/auth/password/reset/${token}`,
                values,
            );

            await authenticate(JSON.stringify(response.data));

            setLoading(false);
        } catch (error) {
            if (!error.response) {
                setLoading(false);
                setMessage({
                    type: 'error',
                    title: 'Something went wrong',
                    body: 'Oops? Something went wrong here. Please try again.',
                    action: () => window.location.reload(),
                });

                return;
            }

            const { errors } = error.response.data;

            if (errors) {
                setErrors(errors);
            }

            setLoading(false);
        }
    };

    /**
     * Set email here based on search parameters.
     */
    useEffect(() => {
        if (email === '') {
            return;
        }

        const { location } = props;

        const queryParams = UrlUtils.queryParams(location.search);

        if (!queryParams.hasOwnProperty('email')) {
            return;
        }

        setEmail(queryParams.email);
    });

    const { classes, ...other } = props;

    return (
        <AuthLayout
            {...other}
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
                onSubmit={handleSubmit}
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
                {({
                    values,
                    handleChange,
                    errors,
                    submitCount,
                    isSubmitting,
                }) => (
                    <Form autoComplete="off">
                        <Grid container direction="column">
                            <Grid item className={classes.formGroup}>
                                <TextField
                                    id="password"
                                    type={passwordVisible ? 'text' : 'password'}
                                    label="Password"
                                    value={values.password}
                                    onChange={handleChange}
                                    variant="outlined"
                                    fullWidth
                                    error={
                                        submitCount > 0 &&
                                        errors.hasOwnProperty('password')
                                    }
                                    helperText={
                                        submitCount > 0 &&
                                        errors.hasOwnProperty('password') &&
                                        errors.password
                                    }
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="Toggle password visibility"
                                                    onClick={() =>
                                                        handlePasswordVisibilityToggle()
                                                    }
                                                >
                                                    {passwordVisible ? (
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
                                        passwordConfirmationVisible
                                            ? 'text'
                                            : 'password'
                                    }
                                    label="Password Confirmation"
                                    value={values.password_confirmation}
                                    onChange={handleChange}
                                    variant="outlined"
                                    fullWidth
                                    error={
                                        submitCount > 0 &&
                                        errors.hasOwnProperty(
                                            'password_confirmation',
                                        )
                                    }
                                    helperText={
                                        submitCount > 0 &&
                                        errors.hasOwnProperty(
                                            'password_confirmation',
                                        ) &&
                                        errors.password_confirmation
                                    }
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="Toggle password visibility"
                                                    onClick={() =>
                                                        handlePasswordConfirmationVisibilityToggle()
                                                    }
                                                >
                                                    {passwordConfirmationVisible ? (
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
                                                search: UrlUtils.queryString({
                                                    username: email,
                                                }),
                                                pathname: NavigationUtils.route(
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
                                            Object.keys(errors).length > 0 &&
                                            submitCount > 0) ||
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

const styles = theme => ({
    formGroup: {
        padding: theme.spacing.unit * 2,
        paddingTop: 0,
    },
});

export default withStyles(styles)(PasswordReset);
