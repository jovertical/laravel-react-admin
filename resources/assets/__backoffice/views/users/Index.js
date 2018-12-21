import React, { Component } from 'react';
import {
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

    deleteUserModalConfirmedHandler = async () => {
        this.setState({ loading: true });

        try {
            const { by, type } = this.state.sorting;
            const { per_page, current_page } = this.state.pagination;

            const response = await axios.delete(
                `/api/users/${this.state.activeResourceId}`,
                {
                    params: {
                        sortBy: by,
                        sortType: type,
                        perPage: per_page,
                        page: current_page,
                    },
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

    deletedUserUndoHandler = async () => {
        this.setState({ loading: true });

        try {
            const { by, type } = this.state.sorting;
            const { per_page, current_page } = this.state.pagination;

            const response = await axios.patch(
                `/api/users/${this.state.activeResourceId}/restore`,
                {
                    sortBy: by,
                    sortType: type,
                    perPage: per_page,
                    page: current_page,
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

    deleteUserClickedHandler = id => {
        this.setState({
            activeResourceId: id,
            modal: {
                visible: true,
                title: 'You are deleting a resource.',
                content:
                    'If not undone, this action will be irreversible! Continue?',
            },
        });
    };

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

    updateQueryString() {
        const { selectedRows, pagination, sorting } = this.state;
        const { history, location } = this.props;
        const queryString = _queryString({
            perPage: pagination.per_page,
            page: pagination.current_page,
            sortBy: sorting.by,
            sortType: sorting.type,
            selectedRows: selectedRows.join(','),
        });

        history.push(`${location.pathname}${queryString}`);
    }

    fetchUsers = async (params = {}) => {
        this.setState({ loading: true });

        try {
            const { authToken } = this.props.pageProps;
            const { selectedRows, perPage, page, sortBy, sortType } = params;

            const response = await axios.get('/api/users', {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
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
                    <Card className="MT-Content">
                        <TableCardHeader
                            title="List of Users"
                            visible={selectedRows.length > 0}
                            contextualTitle={`${selectedRows.length} item${
                                selectedRows.length > 1 ? 's' : ''
                            } selected`}
                            actions={[
                                <Button
                                    icon
                                    key="delete"
                                    onClick={() => console.log('deleting')}
                                    tooltipLabel="Delete selected rows"
                                    tooltipDelay={300}
                                    tooltipPosition="left"
                                >
                                    delete
                                </Button>,
                            ]}
                        />

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
                        confirmAction={this.deleteUserModalConfirmedHandler}
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

                                return {
                                    toasts,
                                };
                            })
                        }
                    />
                ) : null}
            </div>
        );
    }
}

export default Index;
