import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { TextField, Button } from 'react-md';

import { Templates } from '../';

class SignIn extends Component {
    state = {
        loading: false,
        username: '',
        password: '',
        errors: {},
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
            const { errors } = error.response.data;

            this.setState({ loading: false, errors });
        }
    };

    render() {
        return (
            <Templates.Auth
                title="Sign in"
                subTitle="with your Account"
                loading={this.state.loading}
            >
                <form onSubmit={this.signinSubmitHandler} className="--Form">
                    <div className="--Form-Group md-grid">
                        <div className="--Item md-cell">
                            <TextField
                                id="username"
                                label="Username or Email"
                                lineDirection="center"
                                value={this.state.username}
                                onChange={value =>
                                    this.inputChangeHandler(value, 'username')
                                }
                                error={_.has(this.state.errors, 'username')}
                                errorText={
                                    _.has(this.state.errors, 'username')
                                        ? this.state.errors.username[0]
                                        : ''
                                }
                            />
                        </div>
                    </div>

                    <div className="--Form-Group md-grid">
                        <div className="--Item md-cell">
                            <TextField
                                id="password"
                                type="password"
                                label="Password"
                                lineDirection="center"
                                value={this.state.password}
                                onChange={value =>
                                    this.inputChangeHandler(value, 'password')
                                }
                                error={_.has(this.state.errors, 'password')}
                                errorText={
                                    _.has(this.state.errors, 'password')
                                        ? this.state.errors.password[0]
                                        : ''
                                }
                            />
                        </div>

                        <div className="--Item md-cell">
                            <Link to="#">Forgot Password?</Link>
                        </div>
                    </div>

                    <div className="--Footer md-grid">
                        <div />

                        <div className="--Item md-cell">
                            <Button type="submit" flat primary swapTheming>
                                Sign In
                            </Button>
                        </div>
                    </div>
                </form>
            </Templates.Auth>
        );
    }
}

export default SignIn;
