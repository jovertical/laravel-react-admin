import React, { Component } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Formik, Form, withFormik } from 'formik';
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

import * as UrlUtils from '../../utils/URL';
import * as NavigationUtils from '../../utils/Navigation';
import { Auth as AuthLayout } from '../layouts';

class SignIn extends Component {
    state = {
        loading: false,
        identified: false,
        showPassword: false,
        username: '',
        message: {},
    };

    /**
     * Event listener that is called on usernameChip clicked.
     *
     * @return {undefined}
     */
    handleUsernameChipClicked = () => {
        this.setState({ username: '', identified: false });

        const { history, location } = this.props;

        history.push(`${location.pathname}`);
    };

    /**
     * Event listener that is called on password visibility toggle.
     *
     * @return {undefined}
     */
    handleShowPasswordClick = () => {
        this.setState(prevState => {
            return {
                showPassword: !prevState.showPassword,
            };
        });
    };

    /**
     * This should send an API request to identify the user.
     *
     * @param {string} username
     *
     * @return {undefined}
     */
    identify = async (username = null) => {
        this.setState({ loading: true });

        try {
            const response = await axios.post('/api/auth/identify', {
                username,
            });

            if (response.status === 200) {
                const { history, location } = this.props;

                this.setState({
                    loading: false,
                    identified: true,
                    username: response.data,
                });

                const queryString = UrlUtils._queryString({
                    username: response.data,
                });

                history.push(`${location.pathname}${queryString}`);
            }
        } catch (error) {
            if (!error.response) {
                throw new Error('Unknown error');
            }

            const { errors } = error.response.data;
            const { setErrors } = this.props;

            setErrors(errors);

            this.setState({ loading: false });
        }
    };

    /**
     * This should send an API request to request for authentication.
     * Reload if authenticated.
     *
     * @param {object} values
     *
     * @return {undefined}
     */
    signin = async values => {
        this.setState({ loading: true });

        try {
            const { pageProps } = this.props;
            const { username } = this.state;
            const { password } = values;

            const response = await axios.post('/api/auth/signin', {
                username,
                password,
            });

            if (response.status !== 200) {
                return;
            }

            pageProps.authenticate(JSON.stringify(response.data));

            this.setState({ loading: false });
        } catch (error) {
            if (!error.response) {
                throw new Error('Unknown error');
            }

            const { errors } = error.response.data;
            const { setErrors } = this.props;

            setErrors(errors);

            this.setState({ loading: false });
        }
    };

    /**
     * Event listener that is triggered when the sign in form is submitted.
     *
     * @return {undefined}
     */
    handleSigninSubmit = async (values, { setSubmitting }) => {
        setSubmitting(false);

        try {
            const { identified } = this.state;

            if (!identified) {
                await this.identify(values.username);

                return;
            }

            await this.signin(values);
        } catch (error) {
            this.setState({
                loading: false,
                message: {
                    type: 'error',
                    title: 'Something went wrong',
                    body: (
                        <h4>
                            Oops? Something went wrong here.
                            <br /> Please try again.
                        </h4>
                    ),
                    action: () => window.location.reload(),
                },
            });
        }
    };

    async componentDidMount() {
        const { location } = this.props;

        const queryParams = UrlUtils._queryParams(location.search);

        if (
            queryParams.hasOwnProperty('username') &&
            queryParams.username !== ''
        ) {
            await this.identify(queryParams.username);
        }
    }

    render() {
        const { classes, setErrors, errors: formErrors } = this.props;

        const {
            loading,
            identified,
            showPassword,
            username,
            message,
        } = this.state;

        return (
            <AuthLayout
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
                            onDelete={this.handleUsernameChipClicked}
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
                    onSubmit={this.handleSigninSubmit}
                    validate={values => {
                        setErrors({});
                    }}
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
                    {({ values, handleChange, errors, isSubmitting }) => {
                        if (formErrors && Object.keys(formErrors).length > 0) {
                            errors = formErrors;
                        }

                        return (
                            <Form>
                                <Grid container direction="column">
                                    {!identified ? (
                                        <>
                                            <Grid
                                                item
                                                className={classes.formGroup}
                                            >
                                                <TextField
                                                    id="username"
                                                    name="username"
                                                    label="Username"
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

                                            <Grid
                                                item
                                                className={classes.formGroup}
                                            >
                                                <Link to="#">
                                                    {Lang.get(
                                                        'navigation.forgot_email',
                                                    )}
                                                </Link>
                                            </Grid>
                                        </>
                                    ) : (
                                        <>
                                            <Grid
                                                item
                                                className={classes.formGroup}
                                            >
                                                <TextField
                                                    type={
                                                        showPassword
                                                            ? 'text'
                                                            : 'password'
                                                    }
                                                    id="password"
                                                    name="password"
                                                    label="Password"
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
                                                                        this
                                                                            .handleShowPasswordClick
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

                                            <Grid
                                                item
                                                className={classes.formGroup}
                                            >
                                                <Link
                                                    component={props => (
                                                        <RouterLink
                                                            {...props}
                                                            to={{
                                                                search: UrlUtils._queryString(
                                                                    {
                                                                        username,
                                                                    },
                                                                ),
                                                                pathname: NavigationUtils._route(
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
                                                    Object.keys(errors).length >
                                                        0) ||
                                                isSubmitting
                                            }
                                        >
                                            {Lang.get('navigation.next')}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Form>
                        );
                    }}
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

const Styled = withStyles(styles)(SignIn);

export default withFormik({})(Styled);
