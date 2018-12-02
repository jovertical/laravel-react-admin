import React from 'react';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';

const Navigator = props => {
    const { authenticated, routes } = props.pageProps;

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
                                            to={h.route(
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
                                            to={h.route('backoffice.dashboard')}
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
