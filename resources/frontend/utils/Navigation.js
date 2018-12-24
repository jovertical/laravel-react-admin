import _ from 'lodash';
import { ROUTES } from '../config';

/**
 * @param {string} name
 */
export function _route(name) {
    const i = _.findIndex(ROUTES, { name });

    if (i < 0) {
        throw new Error('Cannot find route.');
    }

    return ROUTES[i].path;
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
