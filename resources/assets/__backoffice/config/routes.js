import Auth from '../views/auth/auth';
import Dashboard from '../views/Dashboard';
import Superusers from '../views/superusers/superusers';
import NotFound from '../views/errors/NotFound';

export default [
    {
        name: 'auth.signin',
        path: '/signin',
        component: Auth.SignIn,
        auth: false,
    },

    {
        name: 'dashboard',
        path: '/',
        component: Dashboard,
        auth: true,
    },

    {
        name: 'superusers.index',
        path: '/superusers',
        component: Superusers.Index,
        auth: true,
    },

    {
        name: 'errors.not-found',
        component: NotFound,
    },
];
