import React from 'react';
import { Card, CardTitle } from 'react-md';

import './AuthTemplate.scss';

const AuthTemplate = props => (
    <div className="AT-Container">
        <div className="AT-Content">
            <Card className="AT-Form">
                <CardTitle
                    className="AT-Form-Title"
                    title={props.title}
                    subtitle={props.subtitle}
                />

                {props.children}
            </Card>
        </div>
    </div>
);

export default AuthTemplate;
