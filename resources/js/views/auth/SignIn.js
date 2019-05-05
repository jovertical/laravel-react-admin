import React, { useState, useEffect, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import {
    Button,
    Chip,
    Grid,
    IconButton,
    InputAdornment,
    Link,
    TextField,
    withStyles,
} from '@material-ui/core';

import {
    AccountCircle as AccountCircleIcon,
    ExpandMore as ExpandMoreIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
} from '@material-ui/icons';

import * as UrlUtils from '../../helpers/URL';
import * as NavigationUtils from '../../helpers/Navigation';
import { Auth as AuthLayout } from '../layouts';
import { AppContext } from '../../AppContext';

function SignIn(props) {
    const { authenticate } = useContext(AppContext);

    const [loading, setLoading] = useState(false);
    const [identified, setIdentified] = useState(false);
    const [passwordVisible, setPasswordVisibility] = useState(false);
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState({});

    /**
     * Event listener that is called on usernameChip clicked.
     *
     * @return {undefined}
     */
    const handleUsernameChipClicked = () => {
        setUsername('');
        setIdentified(false);

        const { history, location } = props;

        history.push(`${location.pathname}`);
    };

    /**
     * Event listener that is called on password visibility toggle.
     *
     * @return {undefined}
     */
    const handlePasswordVisibilityToggle = () => {
        setPasswordVisibility(!passwordVisible);
    };

    /**
     * This should send an API request to identify the user.
     *
     * @param {string} username
     * @param {object} form
     *
     * @return {undefined}
     */
    const identify = async (username = null, { setErrors }) => {
        setLoading(true);

        try {
            const response = await axios.post('/api/v1/auth/identify', {
                username,
            });

            const { history, location } = props;

            setIdentified(true);
            setUsername(response.data);
            setLoading(false);

            const queryString = UrlUtils.queryString({
                username: response.data,
            });

            if (queryString === location.search) {
                return;
            }

            history.push(`${location.pathname}${queryString}`);
        } catch (error) {
            if (!error.response) {
                throw new Error('Unknown error');
            }

            const { errors } = error.response.data;

            if (errors) {
                setErrors(errors);
            }

            setLoading(false);
        }
    };

    /**
     * This should send an API request to request for authentication.
     * Reload if authenticated.
     *
     * @param {object} values
     * @param {object} form
     *
     * @return {undefined}
     */
    const signIn = async (values, form = {}) => {
        setLoading(true);

        try {
            const { password } = values;

            const response = await axios.post('/api/v1/auth/signin', {
                username,
                password,
            });

            authenticate(JSON.stringify(response.data));

            setLoading(false);
        } catch (error) {
            if (!error.response) {
                throw new Error('Unknown error');
            }

            const { errors } = error.response.data;

            if (errors) {
                form.setErrors(errors);
            }

            setLoading(false);
        }
    };

    /**
     * Event listener that is triggered when the sign in form is submitted.
     *
     * @param {object} event
     * @param {object} form
     *
     * @return {undefined}
     */
    const handleSignInSubmit = async (values, form) => {
        form.setSubmitting(false);

        try {
            if (!identified) {
                await identify(values.username, form);

                return;
            }

            await signIn(values, form);
        } catch (error) {
            setLoading(false);

            setMessage({
                type: 'error',
                title: 'Something went wrong',
                body: 'Oops? Something went wrong here. Please try again.',
                action: () => window.location.reload(),
            });
        }
    };

    /**
     * Identify here after component mounts.
     */
    useEffect(() => {
        if (identified) {
            return;
        }

        const { location } = props;

        const q = UrlUtils.queryParams(location.search);

        if (q.hasOwnProperty('username') && q.username !== '') {
            identify(q.username, {});
        }
    }, [identified]);

    const { classes, ...other } = props;

    return (
        <AuthLayout
            {...other}
            title={
                identified
                    ? Lang.get('navigation.signin_identified_title')
                    : Lang.get('navigation.signin_guest_title')
            }
            subTitle={
                identified ? (
                    <Chip
                        label={username}
                        variant="outlined"
                        icon={<AccountCircleIcon color="primary" />}
                        onDelete={handleUsernameChipClicked}
                        deleteIcon={<ExpandMoreIcon />}
                    />
                ) : (
                    Lang.get('navigation.signin_guest_subtitle')
                )
            }
            loading={loading}
            message={message}
        >
            <Formik
                initialValues={{
                    username,
                    password: '',
                }}
                onSubmit={handleSignInSubmit}
                validationSchema={Yup.object().shape({
                    [!identified
                        ? 'username'
                        : 'password']: Yup.string().required(
                        `The ${
                            !identified ? 'username' : 'password'
                        } field is required`,
                    ),
                })}
            >
                {({ values, handleChange, errors, isSubmitting }) => (
                    <Form autoComplete="off">
                        <Grid container direction="column">
                            {!identified ? (
                                <>
                                    <Grid item className={classes.formGroup}>
                                        <TextField
                                            id="username"
                                            name="username"
                                            label="Username"
                                            placeholder="jovert123"
                                            value={values.username}
                                            onChange={handleChange}
                                            variant="outlined"
                                            fullWidth
                                            error={errors.hasOwnProperty(
                                                'username',
                                            )}
                                            helperText={
                                                errors.hasOwnProperty(
                                                    'username',
                                                ) && errors.username
                                            }
                                        />
                                    </Grid>

                                    <Grid item className={classes.formGroup}>
                                        <Link to="#">
                                            {Lang.get(
                                                'navigation.forgot_email',
                                            )}
                                        </Link>
                                    </Grid>
                                </>
                            ) : (
                                <>
                                    <Grid item className={classes.formGroup}>
                                        <TextField
                                            type={
                                                passwordVisible
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            id="password"
                                            name="password"
                                            label="Password"
                                            placeholder="secret"
                                            value={values.password}
                                            onChange={handleChange}
                                            variant="outlined"
                                            fullWidth
                                            error={errors.hasOwnProperty(
                                                'password',
                                            )}
                                            helperText={
                                                errors.hasOwnProperty(
                                                    'password',
                                                ) && errors.password
                                            }
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="Toggle password visibility"
                                                            onClick={
                                                                handlePasswordVisibilityToggle
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
                                        <Link
                                            component={props => (
                                                <RouterLink
                                                    {...props}
                                                    to={{
                                                        search: UrlUtils.queryString(
                                                            {
                                                                username,
                                                            },
                                                        ),
                                                        pathname: NavigationUtils.route(
                                                            'auth.passwords.request',
                                                        ),
                                                    }}
                                                />
                                            )}
                                        >
                                            {Lang.get(
                                                'navigation.forgot_password',
                                            )}
                                        </Link>
                                    </Grid>
                                </>
                            )}
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
                                            Object.keys(errors).length > 0) ||
                                        isSubmitting
                                    }
                                >
                                    {Lang.get('navigation.next')}
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

export default withStyles(styles)(SignIn);
