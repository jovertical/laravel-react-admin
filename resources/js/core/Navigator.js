import React, { useContext } from 'react';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';

import * as NavigationUtils from '../utils/Navigation';
import * as UrlUtils from '../utils/URL';
import { AppContext } from '../AppContext';

const Navigator = props => {
    const { environment, routes, authenticated, username } = useContext(
        AppContext,
    );

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
                                                search: UrlUtils.queryString({
                                                    username,
                                                }),
                                                pathname: NavigationUtils.route(
                                                    'auth.signin',
                                                ),
                                            }}
                                        />
                                    );
                                }
                            }

                            if (!route.auth && route.hasOwnProperty('path')) {
                                if (authenticated) {
                                    return (
                                        <Redirect
                                            to={NavigationUtils.route(
                                                `${environment}.home`,
                                            )}
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

export default withRouter(Navigator);
