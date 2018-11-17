import './bootstrap';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import './style.scss';

if (document.getElementById('root')) {
    ReactDOM.render(<App />, document.getElementById('root'));
}