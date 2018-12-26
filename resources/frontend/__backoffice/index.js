import './bootstrap';

import React from 'react';
import ReactDOM from 'react-dom';

import { _register as registerServiceWorker } from '../utils/ServiceWorker';
import App from './App';
import './style.scss';

if (document.querySelector('#initial-content')) {
    document.querySelector('#initial-content').outerHTML = '';
}

if (document.querySelector('#root')) {
    ReactDOM.render(<App />, document.querySelector('#root'));
}

const swFilepath = document.querySelector('meta[name=sw-filepath]');

if (swFilepath) {
    registerServiceWorker(swFilepath.content);
}
