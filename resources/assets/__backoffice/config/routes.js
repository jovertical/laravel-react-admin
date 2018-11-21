import Dashboard from '../views/Dashboard';
import Superusers from '../views/superusers/Superusers';
import NotFound from '../views/errors/NotFound';

export default [
    {
        path: '/',
        component: Dashboard,
    },

    {
        path: '/superusers',
        component: Superusers.Index,
    },

    {
        component: NotFound,
    },
];
