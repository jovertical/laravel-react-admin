import React from 'react';
import PropTypes from 'prop-types';
import { DialogContainer } from 'react-md';

const ModalDialog = props => {
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

ModalDialog.propTypes = {
    visible: PropTypes.bool,
    title: PropTypes.string,
    actions: PropTypes.array,
    children: PropTypes.any,
};

export default ModalDialog;
