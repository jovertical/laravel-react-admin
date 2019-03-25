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
        path: '/users',
        component: Users.List,
        auth: true,
    },

    {
        name: 'users.create',
        path: '/users/create',
        component: Users.Create,
        auth: true,
    },

    {
        name: 'users.edit',
        path: '/users/:id/edit',
        component: Users.Edit,
        auth: true,
    },
].map(route => {
    route.name = `backoffice.${route.name}`;

    return route;
});
