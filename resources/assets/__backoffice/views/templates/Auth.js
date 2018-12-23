import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardTitle, LinearProgress } from 'react-md';

import './Auth.scss';
import logo from '../../../assets/img/logo-2.png';

const Auth = props => (
    <div className="AT">
        <div className="--Content">
            <div className="--Wrapper">
                {props.loading ? (
                    <span className="--Progress-Wrapper">
                        <LinearProgress
                            id="--Progress"
                            className="--Progress"
                        />
                    </span>
                ) : (
                    ''
                )}

                <Card className="--Form-Wrapper">
                    <div className="--Logo-Wrapper">
                        <img src={logo} className="--Logo" />
                    </div>

                    <CardTitle
                        className="--Title"
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
