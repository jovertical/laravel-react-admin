import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardTitle, LinearProgress } from 'react-md';

import './AuthTemplate.scss';

const AuthTemplate = props => (
    <div className="AT-Container">
        <div className="AT-Content">
            <div className="AT-Content-Wrapper">
                <span>
                    {props.loading ? (
                        <LinearProgress
                            id="AT-Progress"
                            className="AT-Progress"
                        />
                    ) : (
                        ''
                    )}
                </span>

                <Card className="AT-Form">
                    <CardTitle
                        className="AT-Form-Title"
                        title={props.title}
                        subtitle={props.subTitle}
                    />

                    {props.children}
                </Card>
            </div>
        </div>
    </div>
);

AuthTemplate.propTypes = {
    loading: PropTypes.bool,
    title: PropTypes.string,
    subTitle: PropTypes.string,
};

export default AuthTemplate;
