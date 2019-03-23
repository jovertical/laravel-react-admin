import * as BackofficeViews from '../views/__backoffice';

export default [
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
].map(route => {
    route.name = `backoffice.${route.name}`;

    return route;
});
