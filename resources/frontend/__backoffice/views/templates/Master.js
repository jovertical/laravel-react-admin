import React from 'react';
import PropTypes from 'prop-types';
import {
    Avatar,
    Button,
    FontIcon,
    MenuButton,
    NavigationDrawer,
    Autocomplete,
} from 'react-md';

import { _color } from '../../../utils/Random';
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
        to: 'r',
        icon: 'widgets',
        routes: [
            {
                key: 'users',
                label: 'Users',
                to: '/r/users',
            },
        ],
    },
];

const navItems = navigationRoutes.map(route => _toNavItem(route));

const Master = props => {
    const { pageProps } = props;
    const { user, signoutHandler } = pageProps;

    return (
        <NavigationDrawer
            drawerTitle={APP.name}
            mobileDrawerType={NavigationDrawer.DrawerTypes.TEMPORARY}
            tabletDrawerType={NavigationDrawer.DrawerTypes.PERSISTENT}
            desktopDrawerType={NavigationDrawer.DrawerTypes.FULL_HEIGHT}
            className="MT"
            contentId="--Content"
            contentClassName="--Content md-grid"
            navItems={navItems.map(({ divider, subheader, ...route }) => {
                if (divider || subheader) {
                    return { divider, subheader, ...route };
                }

                return <NavItemLink {...route} />;
            })}
            toolbarClassName="--Toolbar"
            toolbarActions={
                <div className="--Actions">
                    <Button id="--Notifications" className="--Action" icon>
                        notifications
                    </Button>

                    <MenuButton
                        id="--Account"
                        className="--Action"
                        icon
                        adjusted="false"
                        simplifiedMenu={false}
                        anchor={{ x: 'left', y: 'overlap' }}
                        menuItems={[
                            {
                                leftIcon: (
                                    <Avatar
                                        suffix={_color(
                                            user.id.toString().slice(1),
                                        )}
                                        className="--Avatar-Circle"
                                    >
                                        {user.firstname.substring(0, 1)}
                                    </Avatar>
                                ),
                                primaryText: `${user.firstname} ${
                                    user.lastname
                                }`,
                                secondaryText: user.email,
                                className: '--Profile',
                                onClick: () =>
                                    alert(`Hello ${user.firstname}!`),
                            },
                            {
                                leftIcon: <FontIcon>exit_to_app</FontIcon>,
                                primaryText: 'Sign out',
                                onClick: signoutHandler,
                            },
                        ]}
                        listClassName="--Account-Menu-Items"
                    >
                        more_vert
                    </MenuButton>
                </div>
            }
            toolbarTitle={
                <Autocomplete
                    id="search"
                    className=" --Search"
                    placeholder="Search"
                    block
                    leftIcon={<FontIcon>search</FontIcon>}
                    dataLabel="primaryText"
                    dataValue="value"
                    data={props.pageProps.searchData}
                    filter={null}
                    onChange={pageProps.searchChangedHandler}
                    onAutocomplete={value => console.log(value)}
                />
            }
            toolbarTitleClassName="--Title"
        >
            {pageProps.loading ? (
                <Loading />
            ) : (
                <div className="--Wrapper">{props.children}</div>
            )}
        </NavigationDrawer>
    );
};

Master.propTypes = {
    pageProps: PropTypes.object.isRequired,
    pageTitle: PropTypes.string.isRequired,
};

export default Master;
