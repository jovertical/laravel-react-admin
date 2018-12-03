import Auth from './views/auth/Auth';
import Dashboard from './views/Dashboard';
import Superusers from './views/superusers/Superusers';
import NotFound from './views/errors/NotFound';

export default [
    {
        name: 'backoffice.auth.signin',
        path: '/signin',
        component: Auth.SignIn,
        auth: false,
    },

    {
        name: 'backoffice.dashboard',
        path: '/',
        component: Dashboard,
        auth: true,
    },

    {
        name: 'backoffice.superusers.index',
        path: '/superusers',
        component: Superusers.Index,
        auth: true,
    },

    {
        name: 'backoffice.errors.not-found',
        component: NotFound,
    },
];
