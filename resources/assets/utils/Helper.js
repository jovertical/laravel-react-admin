import ROUTES from '../config/routes';

export default class Helper {
    /**
     * Make a time-based greeting message.
     * @param {string} time
     * @return {string}
     */
    static greet(time) {
        if (time >= '00:00:00' && time < '12:00:00') {
            return 'Goodmorning! Goodluck for the day ahead.';
        } else if (time >= '12:00:00' && time < '13:00:00') {
            return 'Hello! It is already lunch time.';
        } else if (time >= '13:00:00' && time < '17:00:00') {
            return 'Goodafternoon!';
        } else if (time >= '17:00:00' && time < '20:00:00') {
            return 'Hello! It is already dinner time.';
        } else if (time >= '17:00:00' && time < '24:00:00') {
            return 'Goodevening! Do not forget your sleep.';
        } else {
            return 'Hello!';
        }
    }

    /**
     * @param {string} name
     */
    static route(name) {
        const i = _.findIndex(ROUTES, { name });

        if (i < 0) {
            throw new Error('Cannot find route.');
        }

        return ROUTES[i].path;
    }

    /**
     * ? Generate a query param object from a URL query string.
     * @param {string} queryString
     * @return {object}
     */
    static generateQueryParams(queryString) {
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
    static generateQueryString(queryParams) {
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
}
