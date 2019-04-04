import axios from 'axios';

export default class User {
    /**
     * Fetch a paginated user list.
     *
     * @param {object} params
     *
     * @return {object}
     */
    static async paginated(params = {}) {
        const response = await axios.get('/api/v1/users', {
            params,
        });

        if (response.status !== 200) {
            return {};
        }

        return response.data;
    }

    /**
     * Store a new user.
     *
     * @param {object} attributes
     *
     * @return {object}
     */
    static async store(attributes) {
        const response = await axios.post('/api/v1/users', attributes);

        if (response.status !== 201) {
            return {};
        }

        return response.data;
    }

    /**
     * Show a user.
     *
     * @param {number} id
     *
     * @return {object}
     */
    static async show(id) {
        const response = await axios.get(`/api/v1/users/${id}`);

        if (response.status !== 200) {
            return {};
        }

        return response.data;
    }

    /**
     * Update a user.
     *
     * @param {number} id
     * @param {object} attributes
     *
     * @return {object}
     */
    static async update(id, attributes) {
        const response = await axios.patch(`/api/v1/users/${id}`, attributes);

        if (response.status !== 200) {
            return {};
        }

        return response.data;
    }

    /**
     * Delete a user.
     *
     * @param {number} id
     *
     * @return {object}
     */
    static async delete(id) {
        const response = await axios.delete(`/api/v1/users/${id}`);

        if (response.status !== 200) {
            return {};
        }

        return response.data;
    }

    /**
     * Restore a user.
     *
     * @param {number} id
     *
     * @return {object}
     */
    static async restore(id) {
        const response = await axios.patch(`/api/v1/users/${id}/restore`);

        if (response.status !== 200) {
            return {};
        }

        return response.data;
    }
}
