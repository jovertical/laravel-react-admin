import * as Views from '../views';

export const ROUTES = [
    {
        name: 'backoffice.auth.signin',
        path: '/signin',
        component: Views.AuthSignin,
        auth: false,
    },

    {
        name: 'backoffice.auth.passwords.request',
        path: '/password/request',
        component: Views.AuthPasswordRequest,
        auth: false,
    },

    {
        name: 'backoffice.auth.passwords.reset',
        path: '/password/reset/:token',
        component: Views.AuthPasswordReset,
        auth: false,
    },

    { name: 'backoffice.home', path: '/', component: Views.Home, auth: true },

    {
        name: 'backoffice.users.index',
        path: '/r/users',
        component: Views.UserIndex,
        auth: true,
    },

    {
        name: 'backoffice.users.create',
        path: '/r/users/create',
        component: Views.UserCreate,
        auth: true,
    },

    {
        name: 'backoffice.users.edit',
        path: '/r/users/:id/edit',
        component: Views.UserEdit,
        auth: true,
    },

    { name: 'backoffice.errors.not-found', component: Views.ErrorNotFound },
];
