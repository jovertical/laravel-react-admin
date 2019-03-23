import React from 'react';
import PropTypes from 'prop-types';

import { Confirmation } from './Modals';

const Modal = props => {
    const { type, ...other } = props;

    switch (type) {
        case 'confirmation':
            return <Confirmation {...props} />;
            break;
    }
};

Modal.propTypes = {
    type: PropTypes.oneOf(['confirmation']),
    title: PropTypes.string.isRequired,
    body: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
};

export default Modal;
