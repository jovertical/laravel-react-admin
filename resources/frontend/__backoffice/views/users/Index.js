import React, { Component } from 'react';
import {
    Grid,
    Cell,
    TextField,
    SelectField,
    Button,
    Snackbar,
    Avatar,
    IconSeparator,
    AccessibleFakeButton,
    Card,
    TableCardHeader,
    DataTable,
    TableHeader,
    TableBody,
    TableRow,
    TableColumn,
    TablePagination,
} from 'react-md';

import { _color } from '../../../utils/Random';
import { _queryParams, _queryString } from '../../../utils/URL';
import { ActionMenu, Loading, Modal } from '../../ui';
import { Templates } from '../';
import './Index.scss';

class Index extends Component {
    state = {
        loading: false,
        selectedRows: [],
        pagination: {},
        sorting: {
            by: 'firstname',
            type: 'ASC',
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
                icon: 'info',
                label: 'More Info',
                name: 'show',
                onClick: () => console.log('Showing...'),
            },

            { divider: true },

            {
                icon: 'delete',
                type: 'error',
                label: 'Delete',
                name: 'delete',
                onClick: id => this.deleteUserClickedHandler(id),
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
    deleteUserClickedHandler = id => {
        this.setState({
            activeResourceId: id,
            modal: {
                visible: true,
                title: 'You are deleting a resource.',
                content:
                    'If not undone, this action will be irreversible! Continue?',
                confirmAction: this.deleteUserModalConfirmedHandler,
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
    deleteUserModalConfirmedHandler = async () => {
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
                                clicked: this.deletedUserUndoHandler,
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
    deletedUserUndoHandler = async () => {
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
    deleteUsersClickedHandler = selectedRows => {
        this.setState({
            modal: {
                visible: true,
                title: `You are deleting ${selectedRows.length} resource${
                    selectedRows.length > 1 ? 's' : ''
                }.`,
                content:
                    'If not undone, this action will be irreversible! Continue?',
                confirmAction: () =>
                    this.deleteUsersModalConfirmedHandler(selectedRows),
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
    deleteUsersModalConfirmedHandler = async selectedRows => {
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
                                    this.deletedUsersUndoHandler(
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
    deletedUsersUndoHandler = async selectedRows => {
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
    rowSelectionToggledHandler = async row => {
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
    columnSortingToggledHandler = async column => {
        let { type } = this.state.sorting;
        const { per_page, current_page } = this.state.pagination;

        if (column === this.state.sorting.by) {
            type = type === 'ASC' ? 'DESC' : 'ASC';
        }

        await this.fetchUsers({
            perPage: per_page,
            page: current_page,
            sortBy: column,
            sortType: type,
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
    paginationChangedHandler = async (from, perPage, page) => {
        const { by, type } = this.state.sorting;

        await this.fetchUsers({
            sortBy: by,
            sortType: type,
            perPage,
            page,
        });

        this.updateQueryString();
    };

    /**
     * This will update the URL query string via history API.
     *
     * @return {undefined}
     */
    updateQueryString() {
        const { selectedRows, pagination, sorting } = this.state;
        const { history, location } = this.props;
        const queryString = _queryString({
            perPage: pagination.per_page,
            page: pagination.current_page,
            sortBy: sorting.by,
            sortType: sorting.type,
            selectedRows: [...selectedRows].join(','),
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
        const { by, type } = prevState.sorting;
        const { per_page, current_page } = prevState.pagination;

        return {
            sortBy: by,
            sortType: type,
            perPage: per_page,
            page: current_page,
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
            const { selectedRows, perPage, page, sortBy, sortType } = params;

            const response = await axios.get('/api/users', {
                params: {
                    perPage,
                    page,
                    sortBy,
                    sortType,
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
                        by: _.isNil(sortBy) ? this.state.sorting.by : sortBy,
                        type: _.isNil(sortType)
                            ? this.state.sorting.type
                            : sortType,
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
        const {
            pagination,
            selectedRows,
            sorting,
            modal,
            toasts,
            actions,
        } = this.state;
        const { data } = pagination;

        return (
            <div>
                <Templates.Master {...this.props} pageTitle="Users">
                    <Card className="--Card">
                        <TableCardHeader
                            className="--Header"
                            visible={selectedRows.length > 0}
                            contextualTitle={`${selectedRows.length} item${
                                selectedRows.length > 1 ? 's' : ''
                            } selected`}
                            actions={[
                                <div className="--Actions">
                                    <Button
                                        icon
                                        key="delete"
                                        onClick={() =>
                                            this.deleteUsersClickedHandler(
                                                selectedRows,
                                            )
                                        }
                                        tooltipLabel="Delete selected rows"
                                        tooltipDelay={300}
                                        tooltipPosition="left"
                                    >
                                        delete
                                    </Button>
                                </div>,
                            ]}
                        >
                            <Grid className="--Actions">
                                <Cell
                                    className="--Action"
                                    phoneSize={10}
                                    desktopSize={2}
                                    desktopOffset={2}
                                >
                                    <TextField
                                        id="fullname"
                                        className="w-100"
                                        label="Name"
                                        placeholder="Enter name"
                                    />
                                </Cell>

                                <Cell
                                    className="--Action"
                                    phoneSize={10}
                                    desktopSize={1}
                                >
                                    <SelectField
                                        id="type"
                                        className="w-100"
                                        label="Type"
                                        placeholder="Select type"
                                        menuItems={[
                                            {
                                                label: 'All',
                                                value: 'all',
                                            },

                                            {
                                                label: 'Superuser',
                                                value: 'superuser',
                                            },

                                            {
                                                label: 'User',
                                                value: 'user',
                                            },
                                        ]}
                                        defaultValue="all"
                                    />
                                </Cell>

                                <Cell
                                    className="--Action --Filters"
                                    phoneSize={10}
                                    desktopSize={3}
                                >
                                    <Button flat iconChildren="search" primary>
                                        Filter
                                    </Button>

                                    <Button flat iconChildren="refresh">
                                        Reset
                                    </Button>
                                </Cell>

                                <Cell
                                    className="--Action --Primary"
                                    phoneSize={10}
                                    desktopSize={3}
                                    desktopOffset={1}
                                >
                                    <Button flat iconChildren="cloud_upload">
                                        Import
                                    </Button>

                                    <Button flat iconChildren="add" primary>
                                        Create
                                    </Button>
                                </Cell>
                            </Grid>
                        </TableCardHeader>

                        {!this.state.loading ? (
                            <DataTable baseId="users">
                                <TableHeader>
                                    <TableRow
                                        selectable
                                        selected={
                                            selectedRows.length ===
                                            parseInt(pagination.data.length)
                                        }
                                        onCheckboxClick={() =>
                                            this.rowSelectionToggledHandler(0)
                                        }
                                    >
                                        <TableColumn
                                            grow
                                            sorted={
                                                sorting.type === 'DESC' &&
                                                sorting.by === 'firstname'
                                            }
                                            onClick={() =>
                                                this.columnSortingToggledHandler(
                                                    'firstname',
                                                )
                                            }
                                        >
                                            Name
                                        </TableColumn>

                                        <TableColumn
                                            sorted={
                                                sorting.type === 'DESC' &&
                                                sorting.by === 'email'
                                            }
                                            onClick={() =>
                                                this.columnSortingToggledHandler(
                                                    'email',
                                                )
                                            }
                                        >
                                            Email
                                        </TableColumn>

                                        <TableColumn
                                            sorted={
                                                sorting.type === 'DESC' &&
                                                sorting.by === 'type'
                                            }
                                            onClick={() =>
                                                this.columnSortingToggledHandler(
                                                    'type',
                                                )
                                            }
                                        >
                                            Type
                                        </TableColumn>

                                        <TableColumn />
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {data.map(user => (
                                        <TableRow
                                            key={user.id}
                                            selectable
                                            selected={
                                                _.indexOf(
                                                    selectedRows,
                                                    parseInt(user.id),
                                                ) >= 0
                                            }
                                            onCheckboxClick={() =>
                                                this.rowSelectionToggledHandler(
                                                    user.id,
                                                )
                                            }
                                        >
                                            <TableColumn>
                                                <AccessibleFakeButton
                                                    component={IconSeparator}
                                                    iconBefore
                                                    label={
                                                        <span>
                                                            {`${
                                                                user.firstname
                                                            } ${user.lastname}`}
                                                        </span>
                                                    }
                                                >
                                                    <Avatar
                                                        suffix={_color(
                                                            user.id
                                                                .toString()
                                                                .slice(1),
                                                        )}
                                                    >
                                                        {user.firstname.substring(
                                                            0,
                                                            1,
                                                        )}
                                                    </Avatar>
                                                </AccessibleFakeButton>
                                            </TableColumn>

                                            <TableColumn>
                                                {user.email}
                                            </TableColumn>

                                            <TableColumn>
                                                {_.startCase(user.type)}
                                            </TableColumn>

                                            <ActionMenu
                                                resourceId={user.id}
                                                actions={actions}
                                            />
                                        </TableRow>
                                    ))}
                                </TableBody>

                                <TablePagination
                                    rows={pagination.total}
                                    onPagination={this.paginationChangedHandler}
                                    page={parseInt(pagination.current_page)}
                                    rowsPerPage={parseInt(pagination.per_page)}
                                />
                            </DataTable>
                        ) : (
                            <Loading />
                        )}
                    </Card>
                </Templates.Master>

                {modal.visible ? (
                    <Modal.Confirm
                        title={modal.title}
                        visible
                        confirmAction={modal.confirmAction}
                        cancelAction={() =>
                            this.setState(prevState => {
                                return {
                                    modal: {
                                        ...prevState.modal,
                                        visible: false,
                                    },
                                };
                            })
                        }
                    >
                        {modal.content}
                    </Modal.Confirm>
                ) : null}

                {toasts.length > 0 ? (
                    <Snackbar
                        id="Action-Feedback"
                        toasts={toasts}
                        autohide={toasts[0].autohide}
                        autohideTimeout={5000}
                        onClick={toasts[0].clicked}
                        onDismiss={() =>
                            this.setState(prevState => {
                                const [, ...toasts] = prevState.toasts;

                                return { toasts };
                            })
                        }
                    />
                ) : null}
            </div>
        );
    }
}

export default Index;
