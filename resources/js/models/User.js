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
        const response = await axios.get('/api/users', {
            params,
        });

        if (response.status !== 200) {
            return;
        }

        return response.data;
    }

    /**
     * Delete a user
     *
     * @param {number}
     *
     * @return {object}
     */
    static async delete(id) {
        const response = await axios.delete(`/api/users/${id}`);

        if (response.status !== 200) {
            return;
        }

        return response.data;
    }
}
