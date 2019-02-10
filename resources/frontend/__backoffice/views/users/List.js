import React, { Component } from 'react';

import { _route } from '../../../utils/Navigation';
import { _color } from '../../../utils/Random';
import { _queryParams, _queryString } from '../../../utils/URL';
import { Table } from '../../../ui';
import { MasterTemplate } from '../';

class List extends Component {
    state = {
        loading: false,
        pagination: {},
    };

    /**
     * This should send an API request to fetch all resource.
     *
     * @param {object} params
     * @return {undefined}
     */
    fetchUsers = async (params = {}) => {
        this.setState({ loading: true });

        try {
            const response = await axios.get('/api/users', {
                params: {},
            });

            if (response.status !== 200) {
                return;
            }

            this.setState({
                loading: false,
                pagination: response.data,
            });
        } catch (error) {}
    };

    async componentDidMount() {
        await this.fetchUsers();
    }

    render() {
        const { loading, pagination } = this.state;
        const { data: rawData } = pagination;

        const columns = ['Type', 'Name', 'Email'];
        const data =
            rawData &&
            rawData.map(user => {
                return {
                    type: user.type,
                    name: user.name,
                    email: user.email,
                };
            });

        return (
            <MasterTemplate {...this.props} pageTitle="Users" loading={loading}>
                {!loading && data && <Table data={data} columns={columns} />}
            </MasterTemplate>
        );
    }
}

export { List };
