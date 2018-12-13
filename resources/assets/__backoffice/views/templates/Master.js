import React from 'react';
import PropTypes from 'prop-types';
import { NavigationDrawer } from 'react-md';

import { APP } from '../../../config';
import { Loading, NavItemLink } from '../../ui';
import './Master.scss';

const Master = props => {
    const navItems = [
        {
            label: 'Dashboard',
            to: '/',
            icon: 'dashboard',
        },

        {
            label: 'Users',
            to: '/users',
            icon: 'group',
        },
    ];

    const { pageTitle, pageProps } = props;

    return (
        <NavigationDrawer
            drawerTitle={APP.name}
            toolbarTitle={pageTitle}
            mobileDrawerType={NavigationDrawer.DrawerTypes.TEMPORARY_MINI}
            tabletDrawerType={NavigationDrawer.DrawerTypes.PERSISTENT_MINI}
            desktopDrawerType={NavigationDrawer.DrawerTypes.FULL_HEIGHT}
            contentId="MT-Content"
            contentClassName="MT-Content md-grid"
            navItems={navItems.map(navItem => (
                <NavItemLink {...navItem} key={navItem.to} />
            ))}
        >
            {pageProps.loading ? <Loading /> : <div>{props.children}</div>}
        </NavigationDrawer>
    );
};

Master.propTypes = {
    pageProps: PropTypes.object.isRequired,
    pageTitle: PropTypes.string.isRequired,
};

export default Master;
