import * as Views from '../views';
import { BACKOFFICE_ROUTES } from '../routers/backoffice';

export const ROUTES = [
    {
        name: 'auth.signin',
        path: '/signin',
        component: Views.AuthSignin,
        auth: false,
    },

    {
        name: 'auth.passwords.request',
        path: '/password/request',
        component: Views.AuthPasswordRequest,
        auth: false,
    },

    {
        name: 'auth.passwords.reset',
        path: '/password/reset/:token',
        component: Views.AuthPasswordReset,
        auth: false,
    },

    ...BACKOFFICE_ROUTES,

    {
        name: 'errors.not-found',
        component: Views.ErrorNotFound,
    },
];
