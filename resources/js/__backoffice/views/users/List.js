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
            by: 'name',
            type: 'asc',
        },
        message: null,
    };

    /**
     * Event listener that is triggered when a Table Component's Page is changed.
     * This should re-fetch the resource & also update the queryString.
     *
     * @param {number} page
     *
     * @return {undefined}
     */
    handlePageChange = async page => {
        const { per_page: perPage } = this.state.pagination;
        const { by: sortBy, type: sortType } = this.state.sorting;

        await this.fetchUsers({
            perPage,
            page,
            sortBy,
            sortType,
        });

        this.updateQueryString();
    };

    /**
     * Event listener that is triggered when a Table Component's Per Page is changed.
     * This should re-fetch the resource & also update the queryString.
     *
     * @param {number} perPage
     * @param {number} page
     *
     * @return {undefined}
     */
    handlePerPageChange = async (perPage, page) => {
        const { by: sortBy, type: sortType } = this.state.sorting;

        await this.fetchUsers({
            perPage,
            page,
            sortBy,
            sortType,
        });

        this.updateQueryString();
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

        this.updateQueryString();
    };

    /**
     * This will update the URL query string via history API.
     *
     * @return {undefined}
     */
    updateQueryString() {
        const { history, location } = this.props;
        const { pagination, sorting } = this.state;
        const { current_page: page, per_page: perPage } = pagination;
        const { by: sortBy, type: sortType } = sorting;

        const queryString = _queryString({
            page,
            perPage,
            sortBy,
            sortType,
        });

        history.push(`${location.pathname}${queryString}`);
    }

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
        } catch (error) {
            this.setState({
                loading: false,
                message: {
                    body: 'Error fetching users!',
                    actionText: 'Retry',
                    action: async () => await this.fetchUsers(),
                    close: () => this.setState({ message: null }),
                },
            });
        }
    };

    async componentDidMount() {
        const { location } = this.props;
        const queryParams = (location, 'search')
            ? _queryParams(location.search)
            : {};

        await this.fetchUsers(queryParams);
    }

    render() {
        const { loading, pagination, sorting, message } = this.state;
        const {
            data: rawData,
            total,
            per_page: perPage,
            current_page: page,
        } = pagination;

        const columns = [
            { name: 'Type', property: 'type' },
            { name: 'Name', property: 'name', sort: true },
            { name: 'Email', property: 'email', sort: true },
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
            <MasterTemplate
                {...this.props}
                pageTitle="Users"
                loading={loading}
                message={message}
            >
                {!loading && data && (
                    <Table
                        data={data}
                        total={total}
                        columns={columns}
                        sortBy={sorting.by}
                        sortType={sorting.type}
                        headerCellClicked={cellName =>
                            this.handleSorting(
                                cellName,
                                sorting.type === 'asc' ? 'desc' : 'asc',
                            )
                        }
                        page={parseInt(page)}
                        perPage={parseInt(perPage)}
                        onChangePage={this.handlePageChange}
                        onChangePerPage={this.handlePerPageChange}
                    />
                )}
            </MasterTemplate>
        );
    }
}

export { List };
