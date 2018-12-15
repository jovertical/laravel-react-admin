import _ from 'lodash';

/**
 * ? Generate a query param object from a URL query string.
 * @param {string} queryString
 * @return {object}
 */
export function _queryParams(queryString) {
    return _.chain(queryString)
        .replace('?', '')
        .split('&')
        .map(_.partial(_.split, _, '=', 2))
        .fromPairs()
        .value();
}

/**
 * ? Generate a URL query string.
 * @param {object} params
 * @return {string}
 */
export function _queryString(queryParams) {
    var paramString = '?';

    for (let param in queryParams) {
        if (_.has(queryParams, param)) {
            let value = _.isUndefined(queryParams[param])
                ? ''
                : queryParams[param];

            paramString += `${param}=${value}&`;
        }
    }

    return paramString;
}
