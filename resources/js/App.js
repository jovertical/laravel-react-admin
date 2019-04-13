import React, { Component } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';

import { withWidth, CssBaseline, MuiThemeProvider } from '@material-ui/core';

import { Navigator } from './core';
import { ROUTES } from './config';
import { Loading } from './views';

class App extends Component {
    state = {
        loading: true,
        authenticated: false,
        nightMode: false,
        token: {},
        user: {},
        username: '',

        monitoringEnabled: false,
        responseInterceptor: null,
    };

    /**
     * Determine if monitoring is enabled.
     *
     * @return {undefined}
     */
    monitoringEnabled = () => {
        const configItem = document.querySelector(
            'meta[name=TELESCOPE_ENABLED]',
        );

        if (configItem) {
            this.setState({
                monitoringEnabled: Boolean(configItem.content),
            });
        }
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

            error => {
                // In occasions of Unauthorized requests (401),
                // Remove the stored tokens.
                if (error.response.status === 401) {
                    this.removeToken();
                }

                return Promise.reject(error);
            },
        );

        this.setState({
            responseInterceptor,
        });
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

        if (token === {}) {
            return;
        }

        this.setToken(token);

        await this.fetchUser();
    };

    /**
     * Sign out user.
     *
     * @return {undefined}
     */
    signout = async () => {
        this.setState({ loading: true });

        try {
            const response = await axios.post('/api/v1/auth/signout');

            if (response.status === 200) {
                this.removeToken();

                this.setState({
                    loading: false,
                    authenticated: false,
                    user: {},
                });
            }
        } catch (error) {
            //
        }
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
     *
     * @return {undefined}
     */
    setToken = token => {
        // We will set a default Authorization header, this will
        // eliminate the need to include the Authorization header
        // for almost every AJAX requests.
        window.axios.defaults.headers.common['Authorization'] = `Bearer ${
            token.auth_token
        }`;

        // Store it locally for the authentication token to persist.
        window.localStorage.setItem('token', JSON.stringify(token));
    };

    /**
     * Remove token data stored in persistent storage.
     *
     * @return {undefined}
     */
    removeToken = () => {
        localStorage.removeItem('token');
    };

    /**
     * Fetch the authenticated user.
     *
     * @return {any}
     */
    fetchUser = async () => {
        this.setState({ loading: true });

        try {
            const response = await axios.post('/api/v1/auth/user');

            if (response.status !== 200) {
                return;
            }

            this.setState({
                loading: false,
                authenticated: true,
                user: response.data,
            });

            return response.data;
        } catch (error) {
            //
        }
    };

    async componentDidMount() {
        // Toggle monitoring.
        this.monitoringEnabled();

        // Listen for all API responses.
        this.addResponseInterceptor();

        // Setup Night Mode via Persistent Storage.
        this.setNightMode();

        // Authenticate via Persistent Storage.
        const token = this.token();

        if (Object.keys(token).length > 0) {
            await this.authenticate(JSON.stringify(token));
        }

        this.setState({ loading: false });
    }

    componentWillUnmount() {
        const { responseInterceptor } = this.state;

        this.removeResponseInterceptor(responseInterceptor);
    }

    render() {
        const { width, environment, darkTheme, lightTheme } = this.props;
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
                                environment: environment,
                                routes: ROUTES,
                                handleNightmodeToggled: this
                                    .handleNightmodeToggled,
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

App.propTypes = {
    environment: PropTypes.oneOf(['backoffice']).isRequired,
    darkTheme: PropTypes.object.isRequired,
    lightTheme: PropTypes.object.isRequired,
};

export default withWidth()(App);
