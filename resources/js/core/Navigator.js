import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';

import * as NavigationUtils from '../utils/Navigation';
import * as UrlUtils from '../utils/URL';

const Navigator = props => {
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
                                                search: UrlUtils._queryString({
                                                    username,
                                                }),
                                                pathname: NavigationUtils._route(
                                                    'auth.signin',
                                                ),
                                            }}
                                        />
                                    );
                                }
                            }

                            if (!route.auth) {
                                if (authenticated) {
                                    return (
                                        <Redirect
                                            to={NavigationUtils._route(
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

Navigator.propTypes = {
    pageProps: PropTypes.object,
};

export default withRouter(Navigator);
