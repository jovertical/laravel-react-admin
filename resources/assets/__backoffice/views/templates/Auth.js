import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardTitle, LinearProgress } from 'react-md';

import './Auth.scss';
import logo from '../../../assets/img/logo-2.png';

const Auth = props => (
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
                    <div className="AT-Form-Logo-Wrapper">
                        <img src={logo} className="AT-Form-Logo" />
                    </div>

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

Auth.propTypes = {
    loading: PropTypes.bool,
    title: PropTypes.string,
    subTitle: PropTypes.string,
};

export default Auth;
