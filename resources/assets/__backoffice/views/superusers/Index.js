import React, { Component } from 'react';
import {
    Snackbar,
    Avatar,
    IconSeparator,
    AccessibleFakeButton,
    DataTable,
    TableHeader,
    TableBody,
    TableRow,
    TableColumn,
    TablePagination,
} from 'react-md';

import Loading from '../../ui/Loading';
import ModalDialog from '../../ui/ModalDialog';
import ActionMenu from '../../ui/ActionMenu';
import MasterTemplate from '../templates/MasterTemplate';

class Index extends Component {
    state = {
        loading: false,
        pagination: {},
        sorting: {
            by: 'firstname',
            type: 'ASC',
        },
        activeResourceId: 0,
        modalDialog: {
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
                onClick: () => this.deleteUserClickedHandler(),
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
                        type: 'superuser',
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
                        modalDialog: {
                            ...prevState.modalDialog,
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
                    type: 'superuser',
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
            modalDialog: {
                visible: true,
                title: 'You are deleting a resource.',
                content:
                    'If not undone, this action will be irreversible! Continue?',
            },
        });
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
    };

    paginationChangedHandler = async (from, perPage, page) => {
        const { by, type } = this.state.sorting;

        await this.fetchUsers({
            sortBy: by,
            sortType: type,
            perPage,
            page,
        });
    };

    fetchUsers = async (params = {}) => {
        this.setState({ loading: true });

        try {
            const { perPage, page, sortBy, sortType } = params;

            const response = await axios.get('/api/users', {
                params: {
                    type: 'superuser',
                    perPage,
                    page,
                    sortBy,
                    sortType,
                },
            });

            if (response.status === 200) {
                this.setState({
                    loading: false,
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
                            text: response.statusText,
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
        await this.fetchUsers();
    }

    render() {
        const { pagination, modalDialog, toasts, actions } = this.state;
        const { data } = pagination;

        return (
            <div>
                <MasterTemplate {...this.props}>
                    {!this.state.loading ? (
                        <DataTable baseId="users">
                            <TableHeader>
                                <TableRow selectable={false}>
                                    <TableColumn
                                        grow
                                        sorted={
                                            this.state.sorting.type ===
                                                'DESC' &&
                                            this.state.sorting.by ===
                                                'firstname'
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
                                            this.state.sorting.type ===
                                                'DESC' &&
                                            this.state.sorting.by === 'email'
                                        }
                                        onClick={() =>
                                            this.columnSortingToggledHandler(
                                                'email',
                                            )
                                        }
                                    >
                                        Email
                                    </TableColumn>
                                    <TableColumn />
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {data.map(user => (
                                    <TableRow key={user.id} selectable={false}>
                                        <TableColumn>
                                            <AccessibleFakeButton
                                                component={IconSeparator}
                                                iconBefore
                                                label={
                                                    <span>
                                                        {`${user.firstname} ${
                                                            user.lastname
                                                        }`}
                                                    </span>
                                                }
                                            >
                                                <Avatar random>
                                                    {user.firstname.substring(
                                                        0,
                                                        1,
                                                    )}
                                                </Avatar>
                                            </AccessibleFakeButton>
                                        </TableColumn>

                                        <TableColumn>{user.email}</TableColumn>

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
                </MasterTemplate>

                {modalDialog.visible ? (
                    <ModalDialog
                        title={modalDialog.title}
                        visible
                        confirmAction={this.deleteUserModalConfirmedHandler}
                        cancelAction={() =>
                            this.setState(prevState => {
                                return {
                                    modalDialog: {
                                        ...prevState.modalDialog,
                                        visible: false,
                                    },
                                };
                            })
                        }
                    >
                        {modalDialog.content}
                    </ModalDialog>
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
