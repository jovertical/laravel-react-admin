import './bootstrap';

import React from 'react';
import ReactDOM from 'react-dom';

import { _register as registerServiceWorker } from '../utils/ServiceWorker';
import App from './App';
import './style.scss';

if (document.getElementById('initial-content')) {
    document.getElementById('initial-content').outerHTML = '';
}

if (document.getElementById('root')) {
    ReactDOM.render(<App />, document.getElementById('root'));
}

const swFilepath = document.querySelector('meta[name=sw-filepath]');

if (swFilepath) {
    registerServiceWorker(swFilepath.content);
}
