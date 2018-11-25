import React, { Component } from 'react';
import { HashRouter as Router } from 'react-router-dom';

import Navigator from '../core/Navigator';
import routes from './config/routes';

class App extends Component {
    state = {
        loading: false,
        authenticated: false,
        user: {},
    };

    /**
     * Fetch the Authentication Token.
     */
    async fetchAuthToken() {
        this.setState({ loading: true });

        try {
            const response = await axios.post('/api/auth/token', {
                uid: window.localStorage.getItem('uid'),
            });

            this.setState({ loading: false });

            if (!_.isEmpty(response.data)) {
                this.fetchAuthUser(response.data);
            }
        } catch (error) {}
    }

    /**
     * Fetch the authenticated user.
     *
     * @param {string} token
     */
    async fetchAuthUser(token) {
        this.setState({ loading: true });

        try {
            const response = await axios.post(
                '/api/auth/user',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            this.setState({
                loading: false,
                authenticated: true,
                user: response.data,
            });
        } catch (error) {}
    }

    componentWillMount() {
        this.fetchAuthToken();
    }

    render() {
        if (this.state.loading) {
            return '...';
        }

        return (
            <Router>
                <Navigator {...this.state} routes={routes} />
            </Router>
        );
    }
}

export default App;
