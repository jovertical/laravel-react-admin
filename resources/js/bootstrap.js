import axios from 'axios';
import moment from 'moment';
import Lang from 'lang.js';

import { LOCALE } from './config';

/**
 * We registered axios so that we don't have to import it all the time.
 */
window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

/**
 * Next we will register the CSRF Token as a common header with Axios so that
 * all outgoing HTTP requests automatically have it attached. This is just
 * a simple convenience so we don't have to attach every token manually.
 */
let token = document.head.querySelector('meta[name="csrf-token"]');

if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
}

/**
 * Here, we will initialize our localization for the first time.
 */
window.Lang = new Lang({ messages: LOCALE });

/**
 * We registered moment.js so that we don't have to import it all the time.
 */
window.moment = moment;
