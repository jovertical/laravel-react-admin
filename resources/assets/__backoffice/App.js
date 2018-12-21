import React, { Component } from 'react';
import { HashRouter as Router } from 'react-router-dom';

import { Navigator } from '../core';
import { Loading } from './ui';
import ROUTES from './routes';
import './App.scss';

class App extends Component {
    state = {
        loading: false,
        authToken: null,
        authenticated: false,
        user: {},
    };

    /**
     * Fetch the Authentication Token.
     */
    fetchAuthToken = async () => {
        try {
            const response = await axios.post('/api/auth/token', {
                uid: window.localStorage.getItem('uid'),
            });

            if (response.status === 200) {
                this.setState({ authToken: response.data });
            }
        } catch (error) {}
    };

    /**
     * Fetch the authenticated user.
     */
    fetchAuthUser = async () => {
        try {
            const response = await axios.post(
                '/api/auth/user',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${this.state.authToken}`,
                    },
                },
            );

            if (response.status === 200) {
                this.setState({
                    authenticated: true,
                    user: response.data,
                });
            }
        } catch (error) {}
    };

    /**
     * Sign out user.
     */
    signoutHandler = async () => {
        this.setState({ loading: true });

        try {
            const response = await axios.post(
                '/api/auth/signout',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${this.state.authToken}`,
                    },
                },
            );

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
                        routes: ROUTES,
                        signoutHandler: this.signoutHandler,
                    }}
                />
            </Router>
        );
    }
}

export default App;
