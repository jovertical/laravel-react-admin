import Dashboard from '../views/Dashboard';
import Superusers from '../views/superusers/Superusers';

export default [
    {
        path: '/',
        component: Dashboard
    },

    {
        path: '/superusers',
        component: Superusers.Index
    }
];