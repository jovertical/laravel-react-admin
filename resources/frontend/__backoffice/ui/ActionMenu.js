import React from 'react';
import PropTypes from 'prop-types';
import { MenuButtonColumn, FontIcon } from 'react-md';

import './ActionMenu.scss';

const ActionMenu = props => {
    const mappedActions = props.actions.map(action => {
        if (_.has(action, 'divider')) {
            return action;
        }

        return {
            ...action,
            leftIcon: (
                <FontIcon
                    className={`Action-Menu-Icon md-text--${action.type}`}
                >
                    {action.icon}
                </FontIcon>
            ),
            primaryText: (
                <span className={`md-text--${action.type}`}>
                    {action.label}
                </span>
            ),
            onClick: () => action.onClick(props.resourceId),
        };
    });

    return (
        <MenuButtonColumn
            style={{ ...props.style, maxWidth: '1rem' }}
            icon
            menuItems={mappedActions}
            listClassName="tables__with-menus__kebab-list"
        >
            <FontIcon>more_vert</FontIcon>
        </MenuButtonColumn>
    );
};

ActionMenu.propTypes = {
    actions: PropTypes.array.isRequired,
    style: PropTypes.object,
};

export default ActionMenu;
