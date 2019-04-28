/**
 * Generate a query param object from a URL query string.
 *
 * @param {string} queryString
 *
 * @return {object}
 */
export function queryParams(queryString) {
    let pairs = queryString
        .substring(1)
        .replace(/&$/, '')
        .split('&');

    let queryParams = {};

    pairs.forEach(param => {
        param = param.split('=');

        queryParams[param[0]] = decodeURIComponent(param[1] || '');
    });

    return queryParams;
}

/**
 * Generate a URL query string.
 *
 * @param {object} params
 *
 * @return {string}
 */
export function queryString(queryParams) {
    var paramString = '?';

    for (let param in queryParams) {
        if (queryParams && queryParams.hasOwnProperty(param)) {
            let value = !queryParams[param] ? '' : queryParams[param];

            paramString += `${param}=${value}&`;
        }
    }

    return paramString;
}
