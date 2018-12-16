import React, { Component } from 'react';
import { HashRouter as Router } from 'react-router-dom';

import { Loading } from './ui';
import { Navigator } from './core';
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
        this.setState({ loading: true });

        try {
            const response = await axios.post('/api/auth/token', {
                uid: window.localStorage.getItem('uid'),
            });

            if (response.status === 200) {
                this.setState({
                    loading: false,
                    authToken: response.data,
                });
            }
        } catch (error) {
            this.setState({ loading: false });
        }
    };

    /**
     * Fetch the authenticated user.
     */
    fetchAuthUser = async () => {
        this.setState({ loading: true });

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
                    loading: false,
                    authenticated: true,
                    user: response.data,
                });
            }
        } catch (error) {
            this.setState({ loading: false });
        }
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
        await this.fetchAuthToken();

        if (!_.isEmpty(this.state.authToken)) {
            await this.fetchAuthUser();
        }
    }

    render() {
        if (this.state.loading) {
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
                        routes: ROUTES,
                        signoutHandler: this.signoutHandler,
                    }}
                />
            </Router>
        );
    }
}

export default App;
