import './bootstrap';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import './style.scss';

if (document.getElementById('root')) {
    document.getElementById('initial-content').outerHTML = '';

    ReactDOM.render(<App />, document.getElementById('root'));
}
