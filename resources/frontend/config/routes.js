import * as BackofficeViews from '../__backoffice/views';

export const BACKOFFICE_ROUTES = [
    {
        name: 'auth.signin',
        path: '/signin',
        component: BackofficeViews.AuthSignin,
        auth: false,
    },

    {
        name: 'auth.passwords.request',
        path: '/password/request',
        component: BackofficeViews.AuthPasswordRequest,
        auth: false,
    },

    {
        name: 'auth.passwords.reset',
        path: '/password/reset/:token',
        component: BackofficeViews.AuthPasswordReset,
        auth: false,
    },

    {
        name: 'home',
        path: '/',
        component: BackofficeViews.Home,
        auth: true,
    },

    {
        name: 'users.index',
        path: '/r/users',
        component: BackofficeViews.UserList,
        auth: true,
    },

    {
        name: 'users.create',
        path: '/r/users/create',
        component: BackofficeViews.UserCreate,
        auth: true,
    },

    {
        name: 'users.edit',
        path: '/r/users/:id/edit',
        component: BackofficeViews.UserEdit,
        auth: true,
    },

    {
        name: 'errors.not-found',
        component: BackofficeViews.ErrorNotFound,
    },
].map(r => {
    r.name = `backoffice.${r.name}`;

    return r;
});

export const ROUTES = [...BACKOFFICE_ROUTES];
