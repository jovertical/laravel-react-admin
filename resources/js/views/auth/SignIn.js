import React, { Component } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Formik, Form, withFormik } from 'formik';
import * as Yup from 'yup';
import {
    Grid,
    TextField,
    Button,
    Link,
    Chip,
    Avatar,
    withStyles,
} from '@material-ui/core';
import { AccountCircle, ExpandMore } from '@material-ui/icons';

import { _queryParams, _queryString } from '../../utils/URL';
import { _route } from '../../utils/Navigation';
import { AuthLayout } from '../';

class SignIn extends Component {
    state = {
        loading: false,
        identified: false,
        username: '',
        message: {},
    };

    /**
     * Event listener that is triggered when the usernameChip is clicked.
     *
     * @return {undefined}
     */
    handleUsernameChipClicked = () => {
        this.setState({ username: '', identified: false });

        const { history, location } = this.props;

        history.push(`${location.pathname}`);
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

                const queryString = _queryString({
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
            const { username } = this.state;
            const { password } = values;

            const response = await axios.post('/api/auth/signin', {
                username,
                password,
            });

            if (response.status === 200) {
                window.localStorage.setItem('uid', response.data);

                this.setState({ loading: false });

                window.location.reload();
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

        const queryParams = _queryParams(location.search);

        if (
            queryParams.hasOwnProperty('username') &&
            queryParams.username !== ''
        ) {
            await this.identify(queryParams.username);
        }
    }

    render() {
        const { classes, setErrors, errors: formErrors } = this.props;
        const { loading, identified, username, message } = this.state;

        return (
            <AuthLayout
                title={identified ? 'Welcome' : 'Sign in'}
                subTitle={
                    identified ? (
                        <Chip
                            label={username}
                            variant="outlined"
                            avatar={
                                <Avatar>
                                    <AccountCircle />
                                </Avatar>
                            }
                            onDelete={this.handleUsernameChipClicked}
                            deleteIcon={<ExpandMore />}
                        />
                    ) : (
                        'with your Account'
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
                                                    Forgot Email?
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
                                                    type="password"
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
                                                                search: _queryString(
                                                                    {
                                                                        username,
                                                                    },
                                                                ),
                                                                pathname: _route(
                                                                    'auth.passwords.request',
                                                                ),
                                                            }}
                                                        />
                                                    )}
                                                >
                                                    Forgot Password?
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
                                            Next
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
const WrappedForm = withFormik({})(Styled);

export { WrappedForm as SignIn };
