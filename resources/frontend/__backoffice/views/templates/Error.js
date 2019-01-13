import React from 'react';
import './Error.scss';

export const Error = props => (
    <div className="ET-Container">
        <div className="ET-Content">{props.children}</div>
    </div>
);
