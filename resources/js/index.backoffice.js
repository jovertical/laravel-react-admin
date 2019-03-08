import './bootstrap';

import React from 'react';
import ReactDOM from 'react-dom';

import { _register as registerServiceWorker } from './utils/ServiceWorker';
import Backoffice from './Backoffice';

if (document.querySelector('#initial-content')) {
    document.querySelector('#initial-content').outerHTML = '';
}

if (document.querySelector('#root')) {
    ReactDOM.render(<Backoffice />, document.querySelector('#root'));
}

const swFilepath = document.querySelector('meta[name=sw-filepath]');

if (swFilepath) {
    registerServiceWorker(swFilepath.content);
}
