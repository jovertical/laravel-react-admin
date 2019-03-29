import React, { Component } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { withWidth, CssBaseline, MuiThemeProvider } from '@material-ui/core';

import { Navigator } from './core';
import { ROUTES } from './config';
import { dark as darkTheme, light as lightTheme } from './themes/backoffice';
import { Loading } from './views';

class Backoffice extends Component {
    state = {
        loading: true,
        retrying: false,
        navigating: true,
        authenticated: false,
        nightMode: false,
        token: {},
        user: {},
        username: '',

        errorResponse: {},
        successfulResponse: {},
        responseInterceptor: null,
    };

    /**
     * Refresh the user's session.
     *
     * @return {undefined}
     */
    refresh = async () => {
        this.setState({ navigating: true });

        try {
            const response = await axios.post('/api/auth/refresh');
            const token = response.data;

            this.setToken(token, true);

            this.setState(prevState => {
                return {
                    navigating: false,
                    token,

                    // Update the user's auth_token after refreshing it in the API
                    user: {
                        ...prevState.user,
                        auth_token: token.auth_token,
                    },
                };
            });
        } catch (error) {}
    };

    /**
     * Authenticate the user.
     *
     * @param {string} tokenString
     *
     * @return {undefined}
     */
    authenticate = async tokenString => {
        const token = JSON.parse(tokenString);

        if (token) {
            this.setToken(token);

            await this.fetchUser();
        }
    };

    /**
     * Sign out user.
     *
     * @return {undefined}
     */
    signout = async () => {
        this.setState({ loading: true });

        try {
            const response = await axios.post('/api/auth/signout');

            if (response.status === 200) {
                // remove token data stored in localStorage.
                await localStorage.removeItem('token');

                this.setState({
                    loading: false,
                    authenticated: false,
                    user: {},
                });
            }
        } catch (error) {}
    };

    /**
     * Handle nightmode toggle.
     * Store boolean value in persistent storage.
     *
     * @return {undefined}
     */
    handleNightmodeToggled = () => {
        this.setState(prevState => {
            return {
                nightMode: !prevState.nightMode,
            };
        });

        if (!this.state.nightMode) {
            window.localStorage.setItem('nightMode', true);
        } else {
            window.localStorage.removeItem('nightMode');
        }
    };

    /**
     * Sign out the user, but retain the username.
     *
     * @param {string} username
     *
     * @return {undefined}
     */
    handleLock = async username => {
        await this.setState({
            username,
        });

        await this.signout();
    };

    /**
     * Sign out user completely.
     *
     * @return {undefined}
     */
    handleSignout = async () => {
        await this.signout();
    };

    /**
     * Set nightmode based on stored value in persistent storage.
     *
     * @return {undefined}
     */
    setNightMode = () => {
        const nightMode = window.localStorage.getItem('nightMode');

        this.setState({
            nightMode: nightMode ? true : false,
        });
    };

    /**
     * Get the Authentication Data from the persistent storage.
     *
     * @return {object}
     */
    token = () => {
        const tokenString = window.localStorage.getItem('token');

        if (!tokenString) {
            return {};
        }

        const token = JSON.parse(tokenString);

        this.setState({ token });

        return token;
    };

    /**
     * Store the authentication object as string into a persistent storage.
     *
     * @param {object} token
     * @param {boolean} updateExpiry
     *
     * @return {undefined}
     */
    setToken = (token, updateExpiry = false) => {
        // We will set a default Authorization header, this will
        // eliminate the need to include the Authorization header
        // for almost every AJAX requests.
        window.axios.defaults.headers.common['Authorization'] = `Bearer ${
            token.auth_token
        }`;

        if (updateExpiry) {
            // Add an expired_at timestamp based in the expired_in property in the token.
            // A client defined expiry time makes sense here since a server time is
            // not what we should depend on.
            token.expired_at = moment()
                .add(token.expires_in, 'seconds')
                .format('YYYY-MM-DD hh:mm:ss');
        }

        // Store it locally for the authentication token to persist.
        window.localStorage.setItem('token', JSON.stringify(token));
    };

    /**
     * Fetch the authenticated user.
     *
     * @return {undefined}
     */
    fetchUser = async () => {
        this.setState({ loading: true });

        try {
            const response = await axios.post('/api/auth/user');

            if (response.status === 200) {
                this.setState({
                    loading: false,
                    authenticated: true,
                    user: response.data,
                });
            }
        } catch (error) {}
    };

    /**
     * Remove the response interceptor.
     *
     * @param {any} interceptor
     *
     * @param {undefined}
     */
    removeResponseInterceptor = interceptor => {
        axios.interceptors.response.eject(interceptor);
    };

    /**
     * Record API responses & do something.
     *
     * @param {any} interceptor
     *
     * @param {undefined}
     */
    addResponseInterceptor = () => {
        const responseInterceptor = axios.interceptors.response.use(
            response => {
                return response;
            },

            async error => {
                // In occasions of Unauthorized requests (401),
                // Retry (if authenticated earlier).
                if (error.response.status === 401 && this.state.authenticated) {
                    this.setState({
                        retrying: true,
                    });

                    // Request options
                    const {
                        url,
                        method,
                        headers,
                        params: data,
                    } = error.response.config;

                    const response = await axios({
                        url,
                        method,
                        headers: {
                            ...headers,

                            // This is an override of the Authorization header
                            // to fix the 401 errors when we retry.
                            Authorization:
                                window.axios.defaults.headers.common[
                                    'Authorization'
                                ],
                        },
                        data,
                    });

                    // If the request returns 200 or 201 (Resource created),
                    // Treat it as successful response.
                    if ([200, 201].indexOf(response.status) > -1) {
                        this.setState({
                            retrying: false,
                            successfulResponse: response,
                        });
                    }
                }

                return Promise.reject(error);
            },
        );

        this.setState({
            responseInterceptor,
        });
    };

    async componentDidMount() {
        // Listen for all API responses.
        this.addResponseInterceptor();

        // Setup Night Mode via Persistent Storage.
        this.setNightMode();

        // Authenticate via Persistent Storage.
        const token = this.token();
        let expired = true;

        if (token.hasOwnProperty('expired_at')) {
            expired = token.expired_at < moment().format('YYYY-MM-DD hh:mm:ss');
        }

        if (!expired) {
            await this.authenticate(JSON.stringify(token));
        }

        this.setState({ loading: false, navigating: false });
    }

    componentWillUnmount() {
        const { responseInterceptor } = this.state;

        this.removeResponseInterceptor(responseInterceptor);
    }

    render() {
        const { width } = this.props;
        const { loading, nightMode } = this.state;

        return (
            <MuiThemeProvider theme={nightMode ? darkTheme : lightTheme}>
                <CssBaseline />

                {loading ? (
                    <Loading
                        pageProps={{
                            ...this.state,
                        }}
                    />
                ) : (
                    <Router>
                        <Navigator
                            pageProps={{
                                ...this.state,
                                width,
                                environment: 'backoffice',
                                routes: ROUTES,
                                handleNightmodeToggled: this
                                    .handleNightmodeToggled,
                                refresh: this.refresh,
                                authenticate: this.authenticate,
                                handleLock: this.handleLock,
                                handleSignout: this.handleSignout,
                            }}
                        />
                    </Router>
                )}
            </MuiThemeProvider>
        );
    }
}

export default withWidth()(Backoffice);
