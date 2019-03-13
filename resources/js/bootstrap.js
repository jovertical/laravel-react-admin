import axios from 'axios';
import moment from 'moment';

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
 * Here, we will just register the language files in the form of a
 * JSON string and parse it so that it can be accessed as a global object.
 *
 */
const lang = document.head.querySelector('meta[name="lang"]');

if (lang) {
    window.lang = JSON.parse(lang.content);
}

/**
 * We registered moment.js so that we don't have to import it all the time.
 */
window.moment = moment;
