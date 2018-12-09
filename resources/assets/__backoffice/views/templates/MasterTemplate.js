import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link, Route } from 'react-router-dom';
import { NavigationDrawer, FontIcon, ListItem } from 'react-md';

import APP from '../../../config/app';
import Loading from '../../ui/Loading';
import './MasterTemplate.scss';

class MasterTemplate extends PureComponent {
    constructor(props) {
        super(props);

        this.state = { pageTitle: this.getPageTitle(props) };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ pageTitle: this.getPageTitle(nextProps) });
    }

    getPageTitle = ({ location: { pathname } }) => {
        const i = _.findIndex(navItems, navItem => navItem.to === pathname);

        return navItems[i].label;
    };

    render() {
        const { pageTitle } = this.state;

        const NavItemLink = ({ label, to, icon = '', exact = true }) => (
            <Route path={to} exact={exact}>
                {({ match }) => {
                    let leftIcon;

                    if (icon) {
                        leftIcon = <FontIcon>{icon}</FontIcon>;
                    }

                    return (
                        <ListItem
                            component={Link}
                            active={!!match}
                            to={to}
                            primaryText={label}
                            leftIcon={leftIcon}
                        />
                    );
                }}
            </Route>
        );

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
                {this.props.pageProps.loading ? (
                    <Loading />
                ) : (
                    <div>{this.props.children}</div>
                )}
            </NavigationDrawer>
        );
    }
}

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

MasterTemplate.propTypes = {
    pageProps: PropTypes.object,
};

export default MasterTemplate;
