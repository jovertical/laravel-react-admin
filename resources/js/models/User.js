import axios from 'axios';

export class User {
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
}