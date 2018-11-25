import React from 'react';
import { Card, CardTitle, LinearProgress } from 'react-md';

import './AuthTemplate.scss';

const AuthTemplate = props => (
    <div className="AT-Container">
        <div className="AT-Content">
            <div className="AT-Content-Wrapper">
                <span>
                    {props.loading ? (
                        <LinearProgress className="AT-Progress" />
                    ) : (
                        ''
                    )}
                </span>

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
    </div>
);

export default AuthTemplate;
