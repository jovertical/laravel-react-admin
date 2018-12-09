import React from 'react';
import { Link, Route } from 'react-router-dom';
import { FontIcon, ListItem } from 'react-md';

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

export default NavItemLink;
