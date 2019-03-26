import { Home } from '../views/__backoffice';
import * as Users from '../views/__backoffice/users';

export default [
    {
        name: 'home',
        path: '/',
        component: Home,
    },

    {
        name: 'users.index',
        path: '/users',
        component: Users.List,
    },

    {
        name: 'users.create',
        path: '/users/create',
        component: Users.Create,
    },

    {
        name: 'users.edit',
        path: '/users/:id/edit',
        component: Users.Edit,
    },
].map(route => {
    route.name = `backoffice.${route.name}`;
    route.auth = true;

    return route;
});
