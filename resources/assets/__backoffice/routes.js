import { Auth, Home, Users, Errors } from './views';

export default [
    {
        name: 'backoffice.auth.signin',
        path: '/signin',
        component: Auth.SignIn,
        auth: false,
    },

    {
        name: 'backoffice.home',
        path: '/',
        component: Home,
        auth: true,
    },

    {
        name: 'backoffice.users.index',
        path: '/resources/users',
        component: Users.Index,
        auth: true,
    },

    {
        name: 'backoffice.errors.not-found',
        component: Errors.NotFound,
    },
];
