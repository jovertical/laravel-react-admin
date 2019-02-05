import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, withFormik } from 'formik';
import * as Yup from 'yup';
import { Grid, Cell, TextField, Button, Chip, FontIcon } from 'react-md';

import { _queryParams, _queryString } from '../../../utils/URL';
import { _route } from '../../../utils/Navigation';
import { AuthTemplate } from '../';
import './SignIn.scss';

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
        const { setErrors, errors: formErrors } = this.props;
        const { loading, identified, username, message } = this.state;

        return (
            <AuthTemplate
                title={identified ? 'Welcome' : 'Sign in'}
                subTitle={
                    identified ? (
                        <Chip
                            label={username}
                            removable
                            rotateIcon={false}
                            className="--Username-Chip"
                            avatar={<FontIcon>account_circle</FontIcon>}
                            onClick={this.handleUsernameChipClicked}
                        >
                            expand_more
                        </Chip>
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
                    {({ values, setFieldValue, errors, isSubmitting }) => {
                        if (Object.keys(formErrors).length > 0) {
                            errors = formErrors;
                        }

                        return (
                            <Form className="--Form">
                                {!identified ? (
                                    <Grid className="--Form-Group">
                                        <Cell className="--Item">
                                            <TextField
                                                id="username"
                                                name="username"
                                                label="Username or Email"
                                                lineDirection="center"
                                                value={values.username}
                                                onChange={field =>
                                                    setFieldValue(
                                                        'username',
                                                        field,
                                                    )
                                                }
                                                error={errors.hasOwnProperty(
                                                    'username',
                                                )}
                                                errorText={
                                                    errors.hasOwnProperty(
                                                        'username',
                                                    ) && errors.username
                                                }
                                            />
                                        </Cell>

                                        <Cell className="--Item">
                                            <Link to="#">Forgot Email?</Link>
                                        </Cell>
                                    </Grid>
                                ) : (
                                    <Grid className="--Form-Group">
                                        <Cell className="--Item">
                                            <TextField
                                                type="password"
                                                id="password"
                                                name="username"
                                                label="Password"
                                                lineDirection="center"
                                                value={values.password}
                                                onChange={field =>
                                                    setFieldValue(
                                                        'password',
                                                        field,
                                                    )
                                                }
                                                error={errors.hasOwnProperty(
                                                    'password',
                                                )}
                                                errorText={
                                                    errors.hasOwnProperty(
                                                        'password',
                                                    ) && errors.password
                                                }
                                            />
                                        </Cell>

                                        <Cell className="--Item">
                                            <Link
                                                to={{
                                                    search: _queryString({
                                                        username: username,
                                                    }),
                                                    pathname: _route(
                                                        'backoffice.auth.passwords.request',
                                                    ),
                                                }}
                                            >
                                                Forgot Password?
                                            </Link>
                                        </Cell>
                                    </Grid>
                                )}

                                <Grid className="--Footer">
                                    <Cell />

                                    <Cell className="--Item">
                                        <Button
                                            type="submit"
                                            flat
                                            primary
                                            swapTheming
                                            disabled={
                                                Object.keys(errors).length >
                                                    0 || isSubmitting
                                            }
                                        >
                                            Next
                                        </Button>
                                    </Cell>
                                </Grid>
                            </Form>
                        );
                    }}
                </Formik>
            </AuthTemplate>
        );
    }
}

const WrappedComponent = withFormik({})(SignIn);

export { WrappedComponent as SignIn };
