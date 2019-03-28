import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';

import * as NavigationUtils from '../utils/Navigation';
import * as UrlUtils from '../utils/URL';

class Navigator extends Component {
    async componentDidUpdate(prevProps) {
        const { location, pageProps } = this.props;

        // notify the parent component that the user is navigating...
        if (location.pathname !== prevProps.location.pathname) {
            await pageProps.refresh();
        }
    }

    render() {
        const {
            authenticated,
            username,
            environment,
            routes,
        } = this.props.pageProps;

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
                                                    search: UrlUtils._queryString(
                                                        {
                                                            username,
                                                        },
                                                    ),
                                                    pathname: NavigationUtils._route(
                                                        'auth.signin',
                                                    ),
                                                }}
                                            />
                                        );
                                    }
                                }

                                if (
                                    !route.auth &&
                                    route.hasOwnProperty('path')
                                ) {
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

                                return <View {...this.props} {...routeProps} />;
                            }}
                        />
                    );
                })}
            </Switch>
        );
    }
}

Navigator.propTypes = {
    pageProps: PropTypes.object.isRequired,
};

export default withRouter(Navigator);
