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
        authenticated: false,
        nightMode: false,
        token: {},
        user: {},
        username: '',
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

        // Add an expired_at timestamp based in the expired_in property in the token.
        // A client defined expiry time makes sense here since a server time is
        // not what we should depend on.
        token.expired_at = moment()
            .add(token.expires_in, 'seconds')
            .format('YYYY-MM-DD hh:mm:ss');

        // Store it locally for the authentication token to persist.
        window.localStorage.setItem('token', JSON.stringify(token));
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
        } catch (error) {}
    };

    async componentDidMount() {
        // Setup Night Mode via Persistent Storage.
        this.setNightMode();

        // Authenticate via Persistent Storage.
        const token = this.token();
        let expired = true;

        if (token.hasOwnProperty('expired_at')) {
            expired = moment(token.expired_at).unix() > moment().unix();
        }

        // if (!expired) {
        await this.authenticate(JSON.stringify(token));
        // }

        this.setState({ loading: false });
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
