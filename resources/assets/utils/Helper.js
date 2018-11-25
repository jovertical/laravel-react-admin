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
     * @param {array} routes
     * @param {string} name
     */
    static route(routes, name) {
        const i = _.findIndex(routes, { name });

        if (i < 0) {
            throw new Error('Cannot find route.');
        }

        return routes[i].path;
    }
}
