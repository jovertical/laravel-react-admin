import React, { Component } from 'react';
import { HashRouter as Router } from 'react-router-dom';

import Loading from './ui/Loading';
import Navigator from '../core/Navigator';
import routes from './config/routes';

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
    async fetchAuthToken() {
        try {
            const response = await axios.post('/api/auth/token', {
                uid: window.localStorage.getItem('uid'),
            });

            if (response.status === 200) {
                this.setState({ authToken: response.data });
            }
        } catch (error) {}
    }

    /**
     * Fetch the authenticated user.
     */
    async fetchAuthUser() {
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
    }

    async componentWillMount() {
        this.setState({ loading: true });

        await this.fetchAuthToken();

        if (!_.isEmpty(this.state.authToken)) {
            await this.fetchAuthUser();
        }

        this.setState({ loading: false });
    }

    render() {
        if (this.state.loading) {
            return <Loading />;
        }

        return (
            <Router>
                <Navigator pageProps={{ ...this.state, routes }} />
            </Router>
        );
    }
}

export default App;
