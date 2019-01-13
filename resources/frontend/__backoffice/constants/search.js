import { Link } from 'react-router-dom';

const navigations = [
    {
        component: Link,
        primaryText: 'Dashboard',
        to: '/',
    },

    {
        component: Link,
        primaryText: 'Users',
        to: '/r/users',
    },
];

export const SEARCH = [...navigations];
