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
    const i = ROUTES.findIndex(route => route.name === name);

    if (i < 0) {
        throw new Error('Cannot find route.');
    }

    let routePath = ROUTES[i].path;

    // We will modify the route path if there are parameters provided.
    if (segmentParams && Object.values(segmentParams).length > 0) {
        Object.values(segmentParams).forEach((value, i) => {
            const param = Object.keys(segmentParams)[i];

            // Check if the param is a segment. Replace it with the provided value.
            if (routePath.indexOf(param) > -1) {
                routePath = routePath.replace(`:${param}`, value);
            }
        });
    }

    // We will append a query string if there are query parameters provided.
    if (segmentParams && Object.values(segmentParams).length > 0) {
        routePath = `${routePath}${_queryString(queryParams)}`;
    }

    return routePath;
}
