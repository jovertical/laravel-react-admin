import React, { Component } from 'react';

import {
    Avatar,
    Grid,
    IconButton,
    Tooltip,
    withStyles,
} from '@material-ui/core';

import { Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons';

import * as RandomUtils from '../../../utils/Random';
import * as NavigationUtils from '../../../utils/Navigation';
import * as UrlUtils from '../../../utils/URL';
import { Table } from '../../../ui';
import { Master as MasterLayout } from '../layouts';
import { User } from '../../../models';

class List extends Component {
    state = {
        loading: false,
        pagination: {},
        sorting: {
            by: 'name',
            type: 'asc',
        },
        filters: {},
        selectedResources: [],
        message: {},
        alert: {},
    };

    /**
     * Event listener that is triggered when a resource delete button is clicked.
     * This should prompt for confirmation.
     *
     * @param {string} resourceId
     *
     * @return {undefined}
     */
    handleDeleteClick = resourceId => {
        this.setState({
            alert: {
                type: 'confirmation',
                title: Lang.get('resources.delete_confirmation_title', {
                    name: 'User',
                }),
                body: Lang.get('resources.delete_confirmation_body', {
                    name: 'User',
                }),
                confirmText: Lang.get('actions.continue'),
                confirmed: async () => await this.deleteUser(resourceId),
                cancelled: () => this.setState({ alert: {} }),
            },
        });
    };

    /**
     * Event listener that is triggered when a filter is removed.
     * This should re-fetch the resource & also update the queryString.
     *
     * @param {string} key
     *
     * @return {undefined}
     */
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

        const queryString = UrlUtils._queryString({
            page,
            perPage,
            sortBy,
            sortType,
            ...filters,
        });

        history.push(`${location.pathname}${queryString}`);
    }

    /**
     * This should send an API request to restore a deleted resource.
     *
     * @param {string} resourceId
     *
     * @return {undefined}
     */
    restoreUser = async resourceId => {
        this.setState({ loading: true });

        try {
            const pagination = await User.restore(resourceId);

            this.setState({
                loading: false,
                pagination,
                alert: {},
                message: {
                    type: 'success',
                    body: Lang.get('resources.restored', {
                        name: 'User',
                    }),
                    closed: () => this.setState({ message: {} }),
                },
            });
        } catch (error) {
            this.setState({
                loading: false,
                alert: {},
                message: {
                    type: 'error',
                    body: Lang.get('resources.not_restored', {
                        name: 'User',
                    }),
                    closed: () => this.setState({ message: {} }),
                    actionText: Lang.get('actions.retry'),
                    action: async () => await this.restoreUser(resourceId),
                },
            });
        }
    };

    /**
     * This should send an API request to delete a resource.
     *
     * @param {string} resourceId
     *
     * @return {undefined}
     */
    deleteUser = async resourceId => {
        this.setState({ loading: true });

        try {
            const pagination = await User.delete(resourceId);

            this.setState({
                loading: false,
                pagination,
                alert: {},
                message: {
                    type: 'success',
                    body: Lang.get('resources.deleted', {
                        name: 'User',
                    }),
                    closed: () => this.setState({ message: {} }),
                    actionText: Lang.get('actions.undo'),
                    action: async () => this.restoreUser(resourceId),
                },
            });
        } catch (error) {
            this.setState({
                loading: false,
                alert: {},
                message: {
                    type: 'error',
                    body: Lang.get('resources.not_deleted', {
                        name: 'User',
                    }),
                    closed: () => this.setState({ message: {} }),
                    actionText: Lang.get('actions.retry'),
                    action: async () => await this.deleteUser(resourceId),
                },
            });
        }
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
                    message: {},
                };
            });
        } catch (error) {
            this.setState({
                loading: false,
                message: {
                    type: 'error',
                    body: Lang.get('resources.not_fetched', {
                        name: 'User',
                    }),
                    closed: () => this.setState({ message: {} }),
                    actionText: Lang.get('actions.retry'),
                    action: async () => await this.fetchUsers(),
                },
            });
        }
    };

    async componentDidMount() {
        const { location } = this.props;
        const queryParams = (location, 'search')
            ? UrlUtils._queryParams(location.search)
            : {};

        const filters = {};
        const queryParamValues = Object.values(queryParams);

        Object.keys(queryParams).forEach((param, key) => {
            if (param.search(/\[*]/) > -1 && param.indexOf('_') < 0) {
                filters[param] = queryParamValues[key];
            }
        });

        await this.fetchUsers({
            ...queryParams,
            filters,
        });
    }

    render() {
        const {
            loading,
            pagination,
            sorting,
            filters,
            message,
            alert,
        } = this.state;

        const {
            data: rawData,
            total,
            per_page: perPage,
            current_page: page,
        } = pagination;

        const { pageProps, history } = this.props;
        const { user: authUser } = pageProps;

        const primaryAction = {
            text: Lang.get('resources.create', {
                name: 'User',
            }),
            clicked: () =>
                history.push(NavigationUtils._route('backoffice.users.create')),
        };

        const tabs = [
            {
                name: 'List',
                active: true,
            },
        ];

        const columns = [
            { name: 'Type', property: 'type' },
            { name: 'Name', property: 'name', sort: true },
            { name: 'Email', property: 'email', sort: true },
            {
                name: 'Actions',
                property: 'actions',
                filter: false,
                sort: false,
            },
        ];

        const data =
            rawData &&
            rawData.map(user => {
                return {
                    type: user.type,
                    name: (
                        <Grid
                            container
                            direction="row"
                            alignItems="center"
                            wrap="nowrap"
                        >
                            <Grid item style={{ marginRight: 10 }}>
                                <Avatar
                                    style={{
                                        fontSize: 17,
                                        backgroundColor: RandomUtils._color(
                                            user.firstname.length -
                                                user.created_at.charAt(
                                                    user.created_at.length - 2,
                                                ),
                                        ),
                                    }}
                                >
                                    {`${user.firstname.charAt(
                                        0,
                                    )}${user.lastname.charAt(0)}`}
                                </Avatar>
                            </Grid>

                            <Grid item>{user.name}</Grid>
                        </Grid>
                    ),
                    email: user.email,
                    actions: (
                        <div style={{ width: '5rem' }}>
                            <Tooltip
                                title={Lang.get('resources.edit', {
                                    name: 'User',
                                })}
                            >
                                <IconButton
                                    onClick={() =>
                                        history.push(
                                            NavigationUtils._route(
                                                'backoffice.users.edit',
                                                {
                                                    id: user.id,
                                                },
                                            ),
                                        )
                                    }
                                >
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>

                            {authUser.id !== user.id && (
                                <Tooltip
                                    title={Lang.get('resources.delete', {
                                        name: 'User',
                                    })}
                                >
                                    <IconButton
                                        color="secondary"
                                        onClick={() =>
                                            this.handleDeleteClick(user.id)
                                        }
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </div>
                    ),
                };
            });

        return (
            <MasterLayout
                {...this.props}
                pageTitle={Lang.get('navigation.users')}
                primaryAction={primaryAction}
                tabs={tabs}
                loading={loading}
                message={message}
                alert={alert}
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

export default List;
