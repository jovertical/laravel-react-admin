class Errors {
    constructor() {
        this.errors = {};
    }

    /**
     * Check if the field has an error
     *
     * @param {string} field
     *
     * @return {boolean}
     */
    has(field) {
        return this.errors.hasOwnProperty(field);
    }

    /**
     * Get a field error
     *
     * @param {string} field
     *
     * @return {undefined}
     */
    get(field) {
        if (this.errors[field]) {
            return this.errors[field][0];
        }
    }

    /**
     * Clear a field from errors list
     *
     * @param {string} field
     *
     * @return {undefined}
     */
    clear(field) {
        delete this.errors[field];
    }

    /**
     * Record errors
     *
     * @param {object} errors
     *
     * @return {undefined}
     */
    record(errors) {
        this.errors = errors;
    }

    /**
     * Check if there are any errors
     *
     * @return {boolean}
     */
    any() {
        return Object.keys(this.errors).length > 0;
    }
}

export { Errors };
