import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Cell, Button, Card, CardTitle, LinearProgress } from 'react-md';

import './Auth.scss';
import logo from '../../../assets/img/logos/2/960x540.png';

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
                        <img src={logo} alt="company-logo" className="--Logo" />
                    </div>

                    {_.isEmpty(props.message) ? (
                        <div className="--Content-Wrapper">
                            <CardTitle
                                className="--Title"
                                title={props.title}
                                subtitle={props.subTitle}
                            />

                            <div className="--Content">{props.children}</div>
                        </div>
                    ) : (
                        <div className="--Content-Wrapper">
                            <CardTitle
                                className="--Title"
                                title={props.message.title}
                            />

                            <div className="--Content">
                                <div className="text-center">
                                    {props.message.body}
                                </div>

                                <Grid className="--Footer --With-Error">
                                    <Cell />

                                    <Cell className="--Item">
                                        <Button
                                            type="button"
                                            flat
                                            primary
                                            swapTheming
                                            onClick={() =>
                                                window.location.reload()
                                            }
                                        >
                                            Next
                                        </Button>
                                    </Cell>
                                </Grid>
                            </div>
                        </div>
                    )}
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
