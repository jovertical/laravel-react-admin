import './bootstrap';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import './style.scss';

document.getElementById('initial-content').outerHTML = '';

if (document.getElementById('root')) {
    ReactDOM.render(<App />, document.getElementById('root'));
}
