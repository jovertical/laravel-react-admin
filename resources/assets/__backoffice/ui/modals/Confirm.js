import React from 'react';
import PropTypes from 'prop-types';
import { DialogContainer } from 'react-md';

const Confirm = props => {
    const { visible } = props;

    const actions = [
        {
            onClick: props.confirmAction,
            primary: true,
            children: 'Confirm',
        },
        {
            onClick: props.cancelAction,
            children: 'Cancel',
        },
    ];

    return (
        <DialogContainer
            id="Modal-Dialog"
            visible={visible}
            title={props.title}
            modal
            actions={actions}
        >
            {props.children}
        </DialogContainer>
    );
};

Confirm.propTypes = {
    visible: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    actions: PropTypes.array,
    children: PropTypes.any,
};

export default Confirm;
