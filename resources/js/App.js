import React, { useState, useEffect } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';

import { CssBaseline, MuiThemeProvider } from '@material-ui/core';

import { Navigator } from './core';
import { ROUTES } from './config';
import { Loading } from './views';
import { AppProvider } from './AppContext';

function App(props) {
    const [initialized, setInitialized] = useState(false);
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [nightMode, setNightMode] = useState(false);
    const [token, setToken] = useState({});
    const [user, setUser] = useState({});
    const [username, setUsername] = useState('');
    const [monitoringEnabled, setMonitoringEnabled] = useState(false);
    const [responseInterceptor, setResponseInterceptor] = useState(null);

    /**
     * Determine if monitoring is enabled.
     *
     * @return {undefined}
     */
    const monitor = () => {
        const configItem = document.querySelector(
            'meta[name=TELESCOPE_ENABLED]',
        );

        if (configItem) {
            setMonitoringEnabled(Boolean(configItem.content));
        }
    };

    /**
     * Remove the response interceptor.
     *
     * @param {any} interceptor
     *
     * @param {undefined}
     */
    const removeResponseInterceptor = interceptor => {
        axios.interceptors.response.eject(interceptor);
    };

    /**
     * Record API responses & do something.
     *
     * @param {any} interceptor
     *
     * @param {undefined}
     */
    const addResponseInterceptor = () => {
        const responseInterceptor = axios.interceptors.response.use(
            response => {
                return response;
            },

            error => {
                // In occasions of Unauthorized requests (401),
                // Remove the stored tokens.
                if (error.response.status === 401) {
                    removeToken();
                }

                return Promise.reject(error);
            },
        );

        setResponseInterceptor(responseInterceptor);
    };

    /**
     * Authenticate the user.
     *
     * @param {string} tokenString
     *
     * @return {undefined}
     */
    const authenticate = async tokenString => {
        const token = JSON.parse(tokenString);

        if (token === {}) {
            return;
        }

        storeToken(token);

        await fetchUser();
    };

    /**
     * Sign out user.
     *
     * @return {undefined}
     */
    const signOut = async () => {
        setLoading(true);

        try {
            await axios.post('/api/v1/auth/signout');

            removeToken();

            setLoading(false);
            setAuthenticated(false);
            setUser({});
        } catch (error) {
            //
        }
    };

    /**
     * Handle nightMode toggle.
     * Store boolean value in persistent storage.
     *
     * @return {undefined}
     */
    const handleNightModeToggled = () => {
        setNightMode(!nightMode);

        if (!nightMode) {
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
    const handleLock = username => {
        setUsername(username);

        signOut();
    };

    /**
     * Sign out user completely.
     *
     * @return {undefined}
     */
    const handleSignOut = () => {
        signOut();
    };

    /**
     * Set nightMode based on stored value in persistent storage.
     *
     * @return {undefined}
     */
    const night = () => {
        const nightMode = window.localStorage.getItem('nightMode');

        setNightMode(nightMode ? true : false);
    };

    /**
     * Get the Authentication Data from the persistent storage.
     *
     * @return {object}
     */
    const getToken = () => {
        const tokenString = window.localStorage.getItem('token');

        if (!tokenString) {
            return {};
        }

        const token = JSON.parse(tokenString);

        setToken(token);

        return token;
    };

    /**
     * Store the authentication object as string into a persistent storage.
     *
     * @param {object} token
     *
     * @return {undefined}
     */
    const storeToken = token => {
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
    const removeToken = () => {
        localStorage.removeItem('token');
    };

    /**
     * Fetch the authenticated user.
     *
     * @return {any}
     */
    const fetchUser = async () => {
        setLoading(true);

        try {
            const response = await axios.post('/api/v1/auth/user');

            setAuthenticated(true);
            setUser(response.data);
            setLoading(false);

            return response.data;
        } catch (error) {
            //
        }
    };

    useEffect(() => {
        if (initialized) {
            return;
        }

        monitor();

        addResponseInterceptor();

        night();

        const token = getToken();

        if (Object.keys(token).length > 0) {
            authenticate(JSON.stringify(token));
        } else {
            setLoading(false);
        }

        if (responseInterceptor !== null) {
            removeResponseInterceptor(responseInterceptor);
        }

        setInitialized(true);
    }, [initialized]);

    const { environment, darkTheme, lightTheme } = props;

    const pageProps = {
        // Props
        environment,
        routes: ROUTES,

        // State
        loading,
        authenticated,
        nightMode,
        user,
        token,
        username,
        monitoringEnabled,

        // Methods
        handleNightModeToggled,
        authenticate,
        handleLock,
        handleSignOut,
    };

    return (
        <MuiThemeProvider theme={nightMode ? darkTheme : lightTheme}>
            <CssBaseline />

            <AppProvider {...pageProps}>
                {loading ? (
                    <Loading />
                ) : (
                    <Router>
                        <Navigator />
                    </Router>
                )}
            </AppProvider>
        </MuiThemeProvider>
    );
}

App.propTypes = {
    environment: PropTypes.oneOf(['backoffice']).isRequired,
    darkTheme: PropTypes.object.isRequired,
    lightTheme: PropTypes.object.isRequired,
};

export default App;
