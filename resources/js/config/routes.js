import { BACKOFFICE_ROUTES } from '../routers';
import * as Auth from '../views/auth';
import * as Errors from '../views/errors';

export default [
    {
        name: 'auth.signin',
        path: '/signin',
        component: Auth.SignIn,
        auth: false,
    },

    {
        name: 'auth.passwords.request',
        path: '/password/request',
        component: Auth.PasswordRequest,
        auth: false,
    },

    {
        name: 'auth.passwords.reset',
        path: '/password/reset/:token',
        component: Auth.PasswordReset,
        auth: false,
    },

    ...BACKOFFICE_ROUTES,

    {
        name: 'errors.not-found',
        component: Errors.NotFound,
    },
];
