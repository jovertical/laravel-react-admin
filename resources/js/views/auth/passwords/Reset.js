import React, { Component } from 'react';
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

import * as NavigationUtils from '../../../utils/Navigation';
import * as UrlUtils from '../../../utils/URL';
import { Auth as AuthLayout } from '../../layouts';

class PasswordReset extends Component {
    state = {
        loading: false,
        message: {},
        email: '',
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
    handleSubmit = async (values, { setSubmitting, setErrors }) => {
        setSubmitting(false);

        this.setState({ loading: true });

        try {
            const { match, pageProps } = this.props;
            const { token } = match.params;

            const response = await axios.patch(
                `api/v1/auth/password/reset/${token}`,
                values,
            );

            await pageProps.authenticate(JSON.stringify(response.data));

            this.setState({ loading: false });
        } catch (error) {
            if (!error.response) {
                this.setState({
                    loading: false,
                    message: {
                        type: 'error',
                        title: 'Something went wrong',
                        body:
                            'Oops? Something went wrong here. Please try again.',
                        action: () => window.location.reload(),
                    },
                });

                return;
            }

            const { errors } = error.response.data;

            if (errors) {
                setErrors(errors);
            }

            this.setState({ loading: false });
        }
    };

    componentDidMount() {
        const { location } = this.props;

        const queryParams = UrlUtils._queryParams(location.search);

        if (!queryParams.hasOwnProperty('email')) {
            return;
        }

        this.setState({
            email: queryParams.email,
        });
    }

    render() {
        const { classes, ...other } = this.props;

        const {
            loading,
            message,
            email,
            showPassword,
            showPasswordConfirmation,
        } = this.state;

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
                    {({
                        values,
                        handleChange,
                        errors,
                        submitCount,
                        isSubmitting,
                    }) => (
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
                                                    0 &&
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
}

const styles = theme => ({
    formGroup: {
        padding: theme.spacing.unit * 2,
        paddingTop: 0,
    },
});

export default withStyles(styles)(PasswordReset);
