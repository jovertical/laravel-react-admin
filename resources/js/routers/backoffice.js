import { Home } from '../views/__backoffice';
import * as Users from '../views/__backoffice/users';

export default [
    {
        name: 'home',
        path: '/',
        component: Home,
        auth: true,
    },

    {
        name: 'users.index',
        path: '/r/users',
        component: Users.List,
        auth: true,
    },

    {
        name: 'users.create',
        path: '/r/users/create',
        component: Users.Create,
        auth: true,
    },

    {
        name: 'users.edit',
        path: '/r/users/:id/edit',
        component: Users.Edit,
        auth: true,
    },
].map(route => {
    route.name = `backoffice.${route.name}`;

    return route;
});
