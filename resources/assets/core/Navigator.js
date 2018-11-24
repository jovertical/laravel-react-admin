import React from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';

const Navigator = props => (
    <Switch>
        {props.routes.map((route, i) => {
            const View = route.component;

            return (
                <Route
                    key={i}
                    path={route.path}
                    exact
                    render={routeProps => {
                        return <View {...props} {...routeProps} />;
                    }}
                />
            );
        })}
    </Switch>
);

export default withRouter(Navigator);
