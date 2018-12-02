import React from 'react';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';

const Navigator = props => {
    const { authenticated } = props;

    return (
        <Switch>
            {props.routes.map((route, i) => {
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
                                            to={h.route(
                                                props.routes,
                                                'backoffice.auth.signin',
                                            )}
                                        />
                                    );
                                }
                            }

                            if (!route.auth) {
                                if (authenticated) {
                                    return (
                                        <Redirect
                                            to={h.route(
                                                props.routes,
                                                'backoffice.dashboard',
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
