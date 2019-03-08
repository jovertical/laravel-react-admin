import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';

import { _route } from '../utils/Navigation';
import { _queryString } from '../utils/URL';

const WrappableNavigator = props => {
    const { authenticated, username, environment, routes } = props.pageProps;

    return (
        <Switch>
            {routes.map((route, i) => {
                const View = route.component;

                return (
                    <Route
                        key={i}
                        path={route.path}
                        exact
                        render={routeProps => {
                            if (route.auth) {
                                if (!authenticated) {
                                    return (
                                        <Redirect
                                            to={{
                                                search: _queryString({
                                                    username,
                                                }),
                                                pathname: _route('auth.signin'),
                                            }}
                                        />
                                    );
                                }
                            }

                            if (!route.auth) {
                                if (authenticated) {
                                    return (
                                        <Redirect
                                            to={_route(`${environment}.home`)}
                                        />
                                    );
                                }
                            }

                            return <View {...props} {...routeProps} />;
                        }}
                    />
                );
            })}
        </Switch>
    );
};

WrappableNavigator.propTypes = {
    pageProps: PropTypes.object,
};

export const Navigator = withRouter(WrappableNavigator);
