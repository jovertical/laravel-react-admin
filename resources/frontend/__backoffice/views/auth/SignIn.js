import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Cell, TextField, Button } from 'react-md';

import { Templates } from '../';

class SignIn extends Component {
    state = {
        loading: false,
        username: '',
        password: '',
        errors: {},
        message: {},
    };

    /**
     * Event listener that is triggered when an input has changed.
     * This may clear existing errors that is previously attached to the input.
     *
     * @param {string} value
     * @param {string} input
     *
     * @return {undefined}
     */
    inputChangeHandler = (value, input) => {
        this.setState(prevState => {
            const filteredErrors = _.pick(
                prevState.errors,
                _.keys(prevState.errors).filter(field => field !== input),
            );

            return {
                [input]: value,
                errors: filteredErrors,
            };
        });
    };

    /**
     * Event listener that is triggered when the sign in form is submitted.
     * This should send an API request to request for authentication.
     * Reload if authenticated.
     *
     * @param {object} event
     *
     * @return {undefined}
     */
    signinSubmitHandler = async event => {
        event.preventDefault();

        this.setState({ loading: true });

        try {
            const { username, password } = this.state;

            const response = await axios.post('/api/auth/signin', {
                username,
                password,
            });

            if (response.status === 200) {
                window.localStorage.setItem('uid', response.data);

                this.setState({ loading: false, errors: {} });

                window.location.reload();
            }
        } catch (error) {
            if (error.response) {
                const { errors } = error.response.data;

                this.setState({ loading: false, errors });
            } else {
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
                    },
                });
            }
        }
    };

    render() {
        const { loading, username, password, errors, message } = this.state;

        return (
            <div>
                <Templates.Auth
                    title="Sign in"
                    subTitle="with your Account"
                    loading={loading}
                    message={message}
                >
                    <form
                        onSubmit={this.signinSubmitHandler}
                        className="--Form"
                    >
                        <Grid className="--Form-Group">
                            <Cell className="--Item">
                                <TextField
                                    id="username"
                                    label="Username or Email"
                                    lineDirection="center"
                                    value={username}
                                    onChange={value =>
                                        this.inputChangeHandler(
                                            value,
                                            'username',
                                        )
                                    }
                                    error={_.has(errors, 'username')}
                                    errorText={
                                        _.has(errors, 'username')
                                            ? errors.username[0]
                                            : ''
                                    }
                                />
                            </Cell>
                        </Grid>

                        <Grid className="--Form-Group">
                            <Cell className="--Item">
                                <TextField
                                    id="password"
                                    type="password"
                                    label="Password"
                                    lineDirection="center"
                                    value={password}
                                    onChange={value =>
                                        this.inputChangeHandler(
                                            value,
                                            'password',
                                        )
                                    }
                                    error={_.has(errors, 'password')}
                                    errorText={
                                        _.has(errors, 'password')
                                            ? errors.password[0]
                                            : ''
                                    }
                                />
                            </Cell>

                            <Cell className="--Item">
                                <Link to="#">Forgot Password?</Link>
                            </Cell>
                        </Grid>

                        <Grid className="--Footer">
                            <Cell />

                            <Cell className="--Item">
                                <Button type="submit" flat primary swapTheming>
                                    Sign In
                                </Button>
                            </Cell>
                        </Grid>
                    </form>
                </Templates.Auth>
            </div>
        );
    }
}

export default SignIn;
