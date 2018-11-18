import React, { Component } from 'react';
import { HashRouter as Router } from 'react-router-dom';

import Navigator from './core/Navigator';

class App extends Component {
    state = {
        loading: false
    }

    render() {
        return (
            <Router>
                <Navigator {...this.state} />
            </Router>
        );
    }
}

export default App;