import React, { Component } from 'react';

import { CircularProgress } from '@material-ui/core';

import { _route } from '../../../utils/Navigation';
import { _color } from '../../../utils/Random';
import { _queryParams, _queryString } from '../../../utils/URL';
import { MasterTemplate } from '../';
import './List.scss';

class List extends Component {
    state = {
        loading: false,
        selectedRows: [],
        pagination: {},
        sorting: {
            by: 'firstname',
            type: 'ASC',
        },
        filters: {
            name: '',
            type: 'all',
        },
        activeResourceId: 0,
        modal: {
            visible: false,
            title: '',
            content: '',
            confirmAction: null,
        },
        toasts: [],
        actions: [
            {
                icon: 'edit',
                label: 'Edit',
                name: 'edit',
                onClick: id =>
                    this.props.history.push(
                        _route('backoffice.users.edit', {
                            id,
                        }),
                    ),
            },

            { divider: true },

            {
                icon: 'delete',
                type: 'error',
                label: 'Delete',
                name: 'delete',
                onClick: id => this.handleDeleteUsers(id),
            },
        ],
    };

    /**
     * Event listener that is triggered when a delete action from
     * an ActionMenu is clicked. This should trigger a modal confirmation.
     *
     * @param {number} id
     *
     * @return {undefined}
     */
    handleDeleteUsers = id => {
        this.setState({
            activeResourceId: id,
            modal: {
                visible: true,
                title: 'You are deleting a resource.',
                content:
                    'If not undone, this action will be irreversible! Continue?',
                confirmAction: this.handleDeleteUserModalConfirmed,
            },
        });
    };

    /**
     * Event listener that is triggered when a confirm button from a
     * delete modal (triggered by delete button from an Action Menu) is clicked.
     * This should send an API request to delete the resource.
     *
     * @return {undefined}
     */
    handleDeleteUserModalConfirmed = async () => {
        this.setState({ loading: true });

        try {
            const response = await axios.delete(
                `/api/users/${this.state.activeResourceId}`,
                {
                    params: this.getDefaultQueryParams(this.state),
                },
            );

            if (response.status === 200) {
                this.setState(prevState => {
                    return {
                        loading: false,
                        modal: {
                            ...prevState.modal,
                            visible: false,
                        },
                        pagination: response.data,
                        toasts: [
                            {
                                text: 'Resource deleted.',
                                action: 'Undo',
                                autohide: true,
                                clicked: this.handleDeleteUserUndo,
                            },
                            ...prevState.toasts,
                        ],
                    };
                });
            }
        } catch (error) {}
    };

    /**
     * Event listener that is triggered when a dismiss button from a
     * Snackbar is clicked. This should send an API request to restore
     * the deleted resource.
     *
     * @return {undefined}
     */
    handleDeleteUserUndo = async () => {
        this.setState({ loading: true });

        try {
            const response = await axios.patch(
                `/api/users/${this.state.activeResourceId}/restore`,
                {},
                {
                    params: this.getDefaultQueryParams(this.state),
                },
            );

            if (response.status === 200) {
                this.setState(prevState => {
                    return {
                        loading: false,
                        pagination: response.data,
                        toasts: [
                            {
                                text: 'Resource recovered.',
                                action: 'Dismiss',
                                autohide: true,
                                clicked: () => {},
                            },
                            ...prevState.toasts,
                        ],
                    };
                });
            }
        } catch (error) {}
    };

    /**
     * Event listener that is triggered when the delete selected rows action
     * from the TableCardHeader is clicked. This should trigger a modal confirmation.
     *
     * @param {array} selectedRows
     *
     * @return {undefined}
     */
    handleDeleteUsers = selectedRows => {
        this.setState({
            modal: {
                visible: true,
                title: `You are deleting ${selectedRows.length} resource${
                    selectedRows.length > 1 ? 's' : ''
                }.`,
                content:
                    'If not undone, this action will be irreversible! Continue?',
                confirmAction: () =>
                    this.handleDeleteUsersModalConfirmed(selectedRows),
            },
        });
    };

    /**
     * Event listener that is triggered when a confirm button from a
     * delete modal (triggered when the delete selected rows action
     * from the TableCardHeader is clicked).
     * This should send an API request to delete the resources.
     *
     * @return {undefined}
     */
    handleDeleteUsersModalConfirmed = async selectedRows => {
        this.setState({ loading: true });

        try {
            const response = await axios.delete(
                `/api/users/${[...selectedRows].join(',')}/multiple`,
                {
                    params: this.getDefaultQueryParams(this.state),
                },
            );

            if (response.status === 200) {
                this.setState(prevState => {
                    return {
                        loading: false,
                        selectedRows: [],
                        modal: {
                            ...prevState.modal,
                            visible: false,
                        },
                        pagination: response.data,
                        toasts: [
                            {
                                text: `${
                                    prevState.selectedRows.length
                                } resource${
                                    prevState.selectedRows.length > 1 ? 's' : ''
                                } deleted.`,
                                action: 'Undo',
                                autohide: true,
                                clicked: () =>
                                    this.handleDeletedUsersUndo(
                                        prevState.selectedRows,
                                    ),
                            },
                            ...prevState.toasts,
                        ],
                    };
                });
            }

            this.updateQueryString();
        } catch (error) {}
    };

    /**
     * Event listener that is triggered when a dismiss button from a
     * Snackbar is clicked. This should send an API request to restore
     * the deleted resources.
     *
     * @return {undefined}
     */
    handleDeletedUsersUndo = async selectedRows => {
        this.setState({ loading: true });

        try {
            const response = await axios.patch(
                `/api/users/${[...selectedRows].join(',')}/restore/multiple`,
                {},
                {
                    params: this.getDefaultQueryParams(this.state),
                },
            );

            if (response.status === 200) {
                this.setState(prevState => {
                    return {
                        loading: false,
                        pagination: response.data,
                        toasts: [
                            {
                                text: `${selectedRows.length} resource${
                                    selectedRows.length > 1 ? 's' : ''
                                } recovered.`,
                                action: 'Dismiss',
                                autohide: true,
                                clicked: () => {},
                            },
                            ...prevState.toasts,
                        ],
                    };
                });
            }
        } catch (error) {}
    };

    /**
     * Event listener that is triggered when a TableRow checkbox is clicked.
     * This should update the state & also update the queryString.
     *
     * @param {number} row
     *
     * @return {undefined}
     */
    handleRowSelectionToggled = async row => {
        await this.setState(({ selectedRows }) => {
            if (row === 0) {
                const { pagination } = this.state;

                return {
                    selectedRows:
                        selectedRows.length !== parseInt(pagination.per_page)
                            ? _.map(pagination.data, 'id')
                            : [],
                };
            }

            if (_.indexOf(selectedRows, row) < 0) {
                selectedRows = [...selectedRows, row];
            } else {
                selectedRows = _.remove(selectedRows, value => value !== row);
            }

            return {
                selectedRows,
            };
        });

        this.updateQueryString();
    };

    /**
     * Event listener that is triggered when a sortable TableColumn is clicked.
     * This should re-fetch the resource & also update the queryString.
     *
     * @param {string} column
     *
     * @return {undefined}
     */
    handleColumnSortingToggled = async column => {
        let { sortType, sortBy } = this.state.sorting;
        const { per_page, current_page } = this.state.pagination;
        const { name, type } = this.state.filters;

        if (column === sortBy) {
            sortType = sortType === 'ASC' ? 'DESC' : 'ASC';
        }

        await this.fetchUsers({
            perPage: per_page,
            page: current_page,
            sortBy: column,
            sortType,
            name,
            type,
        });

        this.updateQueryString();
    };

    /**
     * Event listener that is triggered when the TablePagination controls is clicked.
     * This should re-fetch the resource & also update the queryString.
     *
     * @param {number} from
     * @param {number} perPage
     * @param {number} page
     *
     * @return {undefined}
     */
    handlePaginationChanged = async (from, perPage, page) => {
        const { sortBy, sortType } = this.state.sorting;
        const { name, type } = this.state.filters;

        await this.fetchUsers({
            sortBy,
            sortType,
            perPage,
            page,
            name,
            type,
        });

        this.updateQueryString();
    };

    /**
     * Event listener that is triggered when the filter button is clicked.
     * This should re-fetch the resource & also update the queryString.
     *
     * @return {undefined}
     */
    handleFilterButtonClicked = async () => {
        this.setState({ loading: true });

        const { name, type } = this.state.filters;

        await this.fetchUsers({
            ...this.getDefaultQueryParams(this.state),
            page: 1,
            name,
            type,
        });

        this.updateQueryString();
    };

    /**
     * Event listener that is triggered when the reset filter button is clicked.
     * This should re-fetch the resource & also update the queryString.
     *
     * @return {undefined}
     */
    handleResetButtonClicked = async () => {
        this.setState({ loading: true });

        await this.fetchUsers({
            ...this.getDefaultQueryParams(this.state),
            page: 1,
            name: '',
            type: 'all',
        });

        this.updateQueryString();
    };

    /**
     * This will update the URL query string via history API.
     *
     * @return {undefined}
     */
    updateQueryString() {
        const { selectedRows, pagination, sorting, filters } = this.state;
        const { history, location } = this.props;
        const queryString = _queryString({
            selectedRows: [...selectedRows].join(','),
            perPage: pagination.per_page,
            page: pagination.current_page,
            sortBy: sorting.sortBy,
            sortType: sorting.sortType,
            name: filters.name,
            type: filters.type,
        });

        history.push(`${location.pathname}${queryString}`);
    }

    /**
     * This will provide the default sorting & pagination parameters from state.
     *
     * @param {object}
     *
     * @return {object}
     */
    getDefaultQueryParams(prevState) {
        const { sortBy, sortType } = prevState.sorting;
        const { per_page, current_page } = prevState.pagination;
        const { name, type } = prevState.filters;

        return {
            sortBy,
            sortType,
            perPage: per_page,
            page: current_page,
            name,
            type,
        };
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
            const {
                selectedRows,
                perPage,
                page,
                sortBy,
                sortType,
                name,
                type,
            } = params;

            const response = await axios.get('/api/users', {
                params: {
                    sortBy,
                    sortType,
                    perPage,
                    page,
                    name,
                    type,
                },
            });

            if (response.status === 200) {
                this.setState({
                    loading: false,
                    selectedRows:
                        _.isString(selectedRows) && selectedRows.length > 0
                            ? selectedRows.split(',').map(val => parseInt(val))
                            : [],
                    pagination: response.data,
                    sorting: {
                        sortBy: _.isNil(sortBy)
                            ? this.state.sorting.sortBy
                            : sortBy,
                        sortType: _.isNil(sortType)
                            ? this.state.sorting.sortType
                            : sortType,
                    },
                    filters: {
                        name: _.isNil(name) ? '' : name,
                        type: _.isNil(type) ? 'all' : type,
                    },
                });
            }
        } catch ({ response }) {
            this.setState(prevState => {
                return {
                    toasts: [
                        {
                            text: _.has(response, 'statusText')
                                ? response.statusText
                                : 'Error fetching data',
                            action: 'Retry',
                            autohide: true,
                            clicked: this.fetchUsers,
                        },
                        ...prevState.toasts,
                    ],
                };
            });
        }
    };

    async componentWillMount() {
        const { location } = this.props;
        const queryParams = _.has(location, 'search')
            ? _queryParams(location.search)
            : {};

        await this.fetchUsers(queryParams);
    }

    render() {
        const { history } = this.props;
        const {
            pagination,
            filters,
            sorting,
            selectedRows,
            modal,
            toasts,
            actions,
        } = this.state;
        const { data } = pagination;

        return (
            <MasterTemplate {...this.props} pageTitle="Users">
                <h1>Ay-Ho</h1>
            </MasterTemplate>
        );
    }
}

export { List };
