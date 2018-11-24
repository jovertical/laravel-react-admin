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

    render() {
        return (
            <Router>
                <Navigator {...this.state} routes={routes} />
            </Router>
        );
    }
}

export default App;
