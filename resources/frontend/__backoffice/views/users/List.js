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
        sorting: {
            by: 'Name',
            order: 'asc',
        },
    };

    /**
     * Event listener that is triggered when a sortable TableCell is clicked.
     * This should re-fetch the resource & also update the queryString.
     *
     * @param {string} column
     *
     * @return {undefined}
     */
    handleSorting = async (sortBy, sortType) => {
        await this.fetchUsers({
            sortBy,
            sortType,
        });

        // update query string here.
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
            const { sortBy, sortType } = params;

            const response = await axios.get('/api/users', {
                params,
            });

            if (response.status !== 200) {
                return;
            }

            this.setState(prevState => {
                return {
                    loading: false,
                    pagination: response.data,
                    sorting: {
                        by: sortBy ? sortBy : prevState.sorting.by,
                        type: sortType ? sortType : prevState.sorting.type,
                    },
                };
            });
        } catch (error) {}
    };

    async componentDidMount() {
        await this.fetchUsers();
    }

    render() {
        const { loading, pagination, sorting } = this.state;
        const { data: rawData } = pagination;

        const columns = [
            { name: 'Type' },
            { name: 'Name', sort: true },
            { name: 'Email', sort: true },
        ];

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
                {!loading && data && (
                    <Table
                        data={data}
                        columns={columns}
                        sortBy={sorting.by}
                        sortType={sorting.type}
                        headerCellClicked={cellName =>
                            this.handleSorting(
                                cellName,
                                sorting.type === 'asc' ? 'desc' : 'asc',
                            )
                        }
                    />
                )}
            </MasterTemplate>
        );
    }
}

export { List };
