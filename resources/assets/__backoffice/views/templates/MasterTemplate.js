import React, { PureComponent } from 'react';
import { Link, Route } from 'react-router-dom';
import { NavigationDrawer, FontIcon, ListItem } from 'react-md';

import './MasterTemplate.scss';

const navItems = [
    {
        label: 'Dashboard',
        to: '/',
        icon: 'dashboard'
    },

    {
        label: 'Superusers',
        to: '/superusers',
        icon: 'group'
    }
];

const styles = {
    content: { minHeight: 'auto' },
};

class MasterTemplate extends PureComponent {
    constructor(props) {
        super(props);

        this.state = { title: this.getCurrentTitle(props) };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ title: this.getCurrentTitle(nextProps) });
    }

    getCurrentTitle = ({ location: { pathname } }) => {
        const i = _.findIndex(navItems, navItem => navItem.to === pathname);

        return navItems[i].label;
    };

    render() {
        const { title } = this.state;

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
                toolbarTitle={title}
                mobileDrawerType={NavigationDrawer.DrawerTypes.TEMPORARY_MINI}
                tabletDrawerType={NavigationDrawer.DrawerTypes.PERSISTENT_MINI}
                desktopDrawerType={NavigationDrawer.DrawerTypes.PERSISTENT_MINI}
                contentId="main-demo-content"
                contentStyle={styles.content}
                contentClassName="md-grid"
                navItems={navItems.map(navItem => <NavItemLink {...navItem} key={navItem.to} />)}
            >
                <div>
                    {this.props.children}
                </div>
            </NavigationDrawer>
        );
    }
}

export default MasterTemplate;