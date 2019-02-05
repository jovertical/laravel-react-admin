import React, { Component } from 'react';
import { HashRouter as Router } from 'react-router-dom';

import { Navigator } from '../core';
import { BACKOFFICE_ROUTES } from '../config/routes';
import { _route } from '../utils/Navigation';
import { _queryString } from '../utils/URL';
import { Loading } from '../ui';
import './App.scss';

class App extends Component {
    state = {
        loading: false,
        authToken: null,
        authenticated: false,
        username: '',
        user: {},
        searchTerm: '',
        searchData: [],
    };

    /**
     * Event listener that is triggered when the value of the search box
     * has been changed
     *
     * @param {string} value
     *
     * @return {undefined}
     */
    searchChangedHandler = value => {
        const searchData = [].filter(item => {
            return (
                item.primaryText.toLowerCase().indexOf(value.toLowerCase()) > -1
            );
        });

        this.setState({ searchTerm: value, searchData });
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
                // remove uid stored in localStorage.
                await localStorage.removeItem('uid');

                this.setState({
                    loading: false,
                    authenticated: false,
                    user: {},
                });
            }
        } catch (error) {}
    };

    /**
     * Sign out the user, but retain the username.
     *
     * @param {string} username
     *
     * @return {undefined}
     */
    lockHandler = async username => {
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
    signoutHandler = async () => {
        await this.signout();
    };

    /**
     * Fetch the Authentication Token.
     *
     * @return {undefined}
     */
    fetchAuthToken = async () => {
        try {
            const response = await axios.post('/api/auth/token', {
                uid: window.localStorage.getItem('uid'),
            });

            if (response.status === 200) {
                // We will set a default Authorization header, this will
                // eliminate the need to include the Authorization header
                // for almost every AJAX requests.
                window.axios.defaults.headers.common[
                    'Authorization'
                ] = `Bearer ${response.data}`;

                this.setState({ authToken: response.data });
            }
        } catch (error) {}
    };

    /**
     * Fetch the authenticated user.
     *
     * @return {undefined}
     */
    fetchAuthUser = async () => {
        try {
            const response = await axios.post('/api/auth/user');

            if (response.status === 200) {
                this.setState({
                    authenticated: true,
                    user: response.data,
                });
            }
        } catch (error) {}
    };

    async componentWillMount() {
        this.setState({ loading: true });

        await this.fetchAuthToken();

        await this.fetchAuthUser();

        this.setState({ loading: false });
    }

    render() {
        const { loading } = this.state;

        if (loading) {
            return (
                <div className="App-Wrapper">
                    <Loading />
                </div>
            );
        }

        return (
            <Router>
                <Navigator
                    pageProps={{
                        ...this.state,
                        environment: 'backoffice',
                        routes: BACKOFFICE_ROUTES,
                        searchChangedHandler: this.searchChangedHandler,
                        lockHandler: this.lockHandler,
                        signoutHandler: this.signoutHandler,
                    }}
                />
            </Router>
        );
    }
}

export default App;
