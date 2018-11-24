import Auth from '../views/auth/auth';
import Dashboard from '../views/Dashboard';
import Superusers from '../views/superusers/superusers';
import NotFound from '../views/errors/NotFound';

export default [
    {
        path: '/signin',
        component: Auth.SignIn,
        auth: false,
    },

    {
        path: '/',
        component: Dashboard,
        auth: true,
    },

    {
        path: '/superusers',
        component: Superusers.Index,
        auth: true,
    },

    {
        component: NotFound,
    },
];
