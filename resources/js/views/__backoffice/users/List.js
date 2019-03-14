import moment from 'moment';
import React, { Component } from 'react';

import { _route } from '../../../utils/Navigation';
import { _color } from '../../../utils/Random';
import { _queryParams, _queryString } from '../../../utils/URL';
import { Table } from '../../../ui';
import { MasterLayout } from '../';
import { User } from '../../../models/User';

class List extends Component {
    state = {
        loading: false,
        pagination: {},
        sorting: {
            by: 'name',
            type: 'asc',
        },
        filters: {},
        message: null,
    };

    handleFilterRemove = async key => {
        const { filters: prevFilters } = this.state;

        const filters = { ...prevFilters };
        delete filters[key];

        await this.fetchUsers({
            ...this.defaultQueryString(),
            filters,
        });

        this.updateQueryString();
    };

    /**
     * Event listener that is triggered when the filter form is submitted.
     * This should re-fetch the resource & also update the queryString.
     *
     * @param {object} values
     * @param {object} form
     *
     * @return {undefined}
     */
    handleFiltering = async (values, { setSubmitting }) => {
        setSubmitting(false);

        const { filters: prevFilters } = this.state;

        const filters = {
            ...prevFilters,
            [`${values.filterBy}[${values.filterType}]`]: values.filterValue,
        };

        await this.fetchUsers({
            ...this.defaultQueryString(),
            filters,
        });

        this.updateQueryString();
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
        await this.fetchUsers({
            ...this.defaultQueryString(),
            page,
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
        await this.fetchUsers({
            ...this.defaultQueryString(),
            perPage,
            page,
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
            ...this.defaultQueryString(),
            sortBy,
            sortType,
        });

        this.updateQueryString();
    };

    /**
     * This will provide the default sorting, pagination & filters from state.
     *
     * @return {object}
     */
    defaultQueryString() {
        const { sortBy, sortType } = this.state.sorting;
        const { current_page: page, per_page: perPage } = this.state.pagination;
        const { filters } = this.state;

        return {
            sortBy,
            sortType,
            perPage,
            page,
            filters,
        };
    }

    /**
     * This will update the URL query string via history API.
     *
     * @return {undefined}
     */
    updateQueryString() {
        const { history, location } = this.props;
        const { pagination, sorting, filters } = this.state;
        const { current_page: page, per_page: perPage } = pagination;
        const { by: sortBy, type: sortType } = sorting;

        const queryString = _queryString({
            page,
            perPage,
            sortBy,
            sortType,
            ...filters,
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
            const { page, perPage, sortBy, sortType, filters } = params;

            const queryParams = {
                page,
                perPage,
                sortBy,
                sortType,
                ...filters,
            };

            const pagination = await User.paginated(queryParams);

            this.setState(prevState => {
                return {
                    loading: false,
                    pagination,
                    sorting: {
                        by: sortBy ? sortBy : prevState.sorting.by,
                        type: sortType ? sortType : prevState.sorting.type,
                    },
                    filters: filters ? filters : prevState.filters,
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

        const filters = {};
        const queryParamValues = Object.values(queryParams);

        Object.keys(queryParams).forEach((param, key) => {
            if (param.search(/\[*]/) > -1) {
                filters[param] = queryParamValues[key];
            }
        });

        await this.fetchUsers({
            ...queryParams,
            filters,
        });
    }

    render() {
        const { loading, pagination, sorting, filters, message } = this.state;
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
            <MasterLayout
                {...this.props}
                pageTitle={Lang.get('navigation.users')}
                loading={loading}
                message={message}
            >
                {!loading && data && (
                    <Table
                        title={Lang.get('navigation.users')}
                        data={data}
                        total={total}
                        columns={columns}
                        filters={filters}
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
                        onFilter={this.handleFiltering}
                        onFilterRemove={this.handleFilterRemove}
                    />
                )}
            </MasterLayout>
        );
    }
}

export { List };
