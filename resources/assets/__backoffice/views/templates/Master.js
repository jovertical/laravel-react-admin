import React from 'react';
import PropTypes from 'prop-types';
import { NavigationDrawer, MenuButton, Button } from 'react-md';

import { _toNavItem } from '../../../utils/Navigation';
import { APP } from '../../../config';
import { Loading, NavItemLink } from '../../ui';
import './Master.scss';

const navigationRoutes = [
    {
        label: 'Dashboard',
        to: '/',
        icon: 'home',
    },

    {
        label: 'Resources',
        to: 'resources',
        icon: 'widgets',
        routes: [
            {
                key: 'users',
                label: 'Users',
                to: '/resources/users',
            },
        ],
    },
];

const navItems = navigationRoutes.map(route => _toNavItem(route));

const Master = props => {
    const { pageTitle, pageProps } = props;

    return (
        <NavigationDrawer
            drawerTitle={APP.name}
            mobileDrawerType={NavigationDrawer.DrawerTypes.TEMPORARY}
            tabletDrawerType={NavigationDrawer.DrawerTypes.PERSISTENT}
            desktopDrawerType={NavigationDrawer.DrawerTypes.FULL_HEIGHT}
            contentId="MT-Content"
            contentClassName="MT-Content md-grid"
            navItems={navItems.map(({ divider, subheader, ...route }) => {
                if (divider || subheader) {
                    return { divider, subheader, ...route };
                }

                return <NavItemLink {...route} />;
            })}
            toolbarTitle={pageTitle}
            toolbarActions={
                <div>
                    <Button id="TA-Notifications" icon>
                        notifications
                    </Button>

                    <MenuButton
                        id="TA-Account"
                        icon
                        menuItems={['Profile', 'Sign out']}
                    >
                        more_vert
                    </MenuButton>
                </div>
            }
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
