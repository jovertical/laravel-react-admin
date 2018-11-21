import React from 'react';
import './ErrorTemplate.scss';

const ErrorTemplate = props => (
    <div className="ET-Container">
        <div className="ET-Content">{props.children}</div>
    </div>
);

export default ErrorTemplate;
