import React from 'react';
import PropTypes from 'prop-types';
import {
    Grid,
    Card,
    Typography,
    Button,
    LinearProgress,
} from '@material-ui/core';

import './Auth.scss';
import logo from '../../../assets/img/logos/2/960x540.png';

export const Auth = props => (
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

                    {Object.keys(props.message).length > 0 ? (
                        <div className="--Content-Wrapper">
                            <div className="--Title">
                                <Typography variant="h4" component="h2">
                                    {props.message.title}
                                </Typography>
                            </div>

                            <div className="--Content">
                                <div className="text-center">
                                    {props.message.body}
                                </div>

                                <Grid
                                    container
                                    spacing={24}
                                    className="--Footer --With-Error"
                                >
                                    <Grid item />

                                    <Grid item className="--Item">
                                        <Button
                                            type="button"
                                            variant="contained"
                                            color="primary"
                                            onClick={props.message.action}
                                        >
                                            Next
                                        </Button>
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                    ) : (
                        <div className="--Content-Wrapper">
                            <div className="--Title">
                                <Typography variant="h4" component="h2">
                                    {props.title}
                                </Typography>

                                <Typography
                                    variant="h6"
                                    component="h3"
                                    color="textSecondary"
                                >
                                    {props.subTitle}
                                </Typography>
                            </div>

                            <div className="--Content">{props.children}</div>
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
    subTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};
