import _ from 'lodash';
import { ROUTES } from '../config';
import { _queryString } from '../utils/URL';

/**
 * Find the route by its name.
 *
 * @param {object} segmentParams
 * @param {object} queryParams
 * @param {string} name
 */
export function _route(name, segmentParams = {}, queryParams = {}) {
    const i = _.findIndex(ROUTES, { name });

    if (i < 0) {
        throw new Error('Cannot find route.');
    }

    let routePath = ROUTES[i].path;

    // We will modify the route path if there are parameters provided.
    if (!_.isEmpty(segmentParams)) {
        _.values(segmentParams).forEach((value, i) => {
            const param = _.keys(segmentParams)[i];

            // Check if the param is a segment. Replace it with the provided value.
            if (routePath.indexOf(param) > -1) {
                routePath = routePath.replace(`:${param}`, value);
            }
        });
    }

    // We will append a query string if there are query parameters provided.
    if (!_.isEmpty(queryParams)) {
        routePath = `${routePath}${_queryString(queryParams)}`;
    }

    return routePath;
}

export function _toNavItem(route, parents = []) {
    const prefix = `${parents.length ? '/' : ''}${parents.join('/')}/`;

    if (typeof route === 'string') {
        return {
            key: route,
            to: `${prefix}${route}`,
            label: route,
        };
    }

    const { divider, subheader, ...others } = route;

    if (divider) {
        return { divider, key: 'divider', ...others };
    } else if (subheader) {
        return { subheader, ...others, key: others.label };
    }

    let { to, label, routes } = others;

    if (to === '') {
        label = 'Home';
    } else {
        label = label || to;
    }

    const key = to || label;

    if (to || to === '') {
        to = `${prefix}${to}`;
    }

    return {
        ...others,
        key,
        to,
        label,
        routes,
    };
}
