import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Cell, TextField, Button, Chip, FontIcon } from 'react-md';

import { _queryParams, _queryString } from '../../../utils/URL';
import { AuthTemplate } from '../';
import './SignIn.scss';
import { _route } from '../../../utils/Navigation';
export class SignIn extends Component {
    state = {
        loading: false,
        username: '',
        password: '',
        u: '',
        identified: false,
        errors: {},
        message: {},
    };

    /**
     * Event listener that is triggered when the usernameChip is clicked.
     *
     * @return {undefined}
     */
    usernameChipClickedHandler = () => {
        this.setState({ u: '', identified: false });
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
     * This should send an API request to identify the user.
     *
     * @param {string} username
     *
     * @return {undefined}
     */
    identify = async (username = null) => {
        this.setState({ loading: true });

        try {
            if (username === null) {
                username = this.state.username;
            }

            const response = await axios.post('/api/auth/identify', {
                username,
            });

            if (response.status === 200) {
                const { history, location } = this.props;

                this.setState({
                    loading: false,
                    identified: true,
                    u: response.data,
                });

                const queryString = _queryString({
                    u: response.data,
                });

                history.push(`${location.pathname}${queryString}`);
            }
        } catch (error) {
            if (error.response) {
                const { errors } = error.response.data;

                this.setState({ loading: false, errors });
            } else {
                throw new Error('Unknown error');
            }
        }
    };

    /**
     * This should send an API request to request for authentication.
     * Reload if authenticated.
     *
     * @return {undefined}
     */
    signin = async () => {
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
                throw new Error('Unknown error');
            }
        }
    };

    /**
     * Event listener that is triggered when the sign in form is submitted.
     *
     * @param {object} event
     *
     * @return {undefined}
     */
    signinSubmitHandler = async event => {
        event.preventDefault();

        try {
            const { identified } = this.state;

            if (!identified) {
                await this.identify();
            } else {
                await this.signin();
            }
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

        if (_.has(queryParams, 'u') && queryParams.u !== '') {
            this.setState({ username: queryParams.u });

            await this.identify(queryParams.u);
        }
    }

    render() {
        const {
            loading,
            username,
            password,
            u,
            identified,
            errors,
            message,
        } = this.state;

        return (
            <AuthTemplate
                title={identified ? 'Welcome' : 'Sign in'}
                subTitle={
                    identified ? (
                        <Chip
                            label={u}
                            removable
                            rotateIcon={false}
                            className="--Username-Chip"
                            avatar={<FontIcon>account_circle</FontIcon>}
                            onClick={this.usernameChipClickedHandler}
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
                <form onSubmit={this.signinSubmitHandler} className="--Form">
                    {!identified ? (
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

                            <Cell className="--Item">
                                <Link to="#">Forgot Email?</Link>
                            </Cell>
                        </Grid>
                    ) : (
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
                                <Link
                                    to={{
                                        search: _queryString({
                                            u,
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
                            <Button type="submit" flat primary swapTheming>
                                Next
                            </Button>
                        </Cell>
                    </Grid>
                </form>
            </AuthTemplate>
        );
    }
}
