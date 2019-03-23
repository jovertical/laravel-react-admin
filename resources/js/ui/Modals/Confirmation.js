import React from 'react';
import PropTypes from 'prop-types';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@material-ui/core';

const Confirmation = props => {
    const {
        title,
        body,
        confirmText,
        confirmed,
        cancelText,
        cancelled,
    } = props;

    return (
        <Dialog
            open
            onClose={cancelled}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>

            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {body}
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={cancelled} color="primary">
                    {cancelText ? cancelText : Lang.get('actions.cancel')}
                </Button>

                <Button onClick={confirmed} color="secondary" autoFocus>
                    {confirmText ? confirmText : Lang.get('actions.confirm')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

Confirmation.propTypes = {
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    confirmText: PropTypes.string,
    confirmed: PropTypes.func,
    cancelText: PropTypes.string,
    cancelled: PropTypes.func,
};

export default Confirmation;
