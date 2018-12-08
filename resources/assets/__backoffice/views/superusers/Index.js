import React, { Component } from 'react';
import {
    FontIcon,
    MenuButtonColumn,
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
import MasterTemplate from '../templates/MasterTemplate';

class Index extends Component {
    state = {
        loading: false,
        pagination: {},
        activeResourceId: 0,
        modalDialog: {
            visible: false,
            title: '',
            content: '',
        },
        toasts: [],
    };

    deleteUserModalConfirmedHandler = async () => {
        this.setState({ loading: true });

        try {
            const response = await axios.delete(
                `/api/users/${this.state.activeResourceId}`,
                {
                    params: {
                        type: 'superuser',
                        perPage: _.has(this.state.pagination, 'per_page')
                            ? this.state.pagination.per_page
                            : 10,
                        page: _.has(this.state.pagination, 'current_page')
                            ? this.state.pagination.current_page
                            : 1,
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
            const response = await axios.patch(
                `/api/users/${this.state.activeResourceId}/restore`,
                {
                    type: 'superuser',
                    perPage: _.has(this.state.pagination, 'per_page')
                        ? this.state.pagination.per_page
                        : 10,
                    page: _.has(this.state.pagination, 'current_page')
                        ? this.state.pagination.current_page
                        : 1,
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

    paginationChangedHandler = async (from, perPage, page) => {
        this.setState({ loading: true });

        await this.fetchUsers({ perPage, page });

        this.setState({ loading: false });
    };

    fetchUsers = async (params = {}) => {
        this.setState({ loading: true });

        try {
            const response = await axios.get('/api/users', {
                params: {
                    type: 'superuser',
                    perPage: _.has(params, 'perPage') ? params.perPage : null,
                    page: _.has(params, 'page') ? params.page : null,
                },
            });

            if (response.status === 200) {
                this.setState({ loading: false, pagination: response.data });
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
        const { pagination, modalDialog, toasts } = this.state;
        const { data } = pagination;

        return (
            <div>
                <MasterTemplate {...this.props}>
                    {!this.state.loading ? (
                        <DataTable baseId="users">
                            <TableHeader>
                                <TableRow selectable={false}>
                                    <TableColumn grow>Name</TableColumn>
                                    <TableColumn>Email</TableColumn>
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
                                            id={user.id}
                                            delete={() =>
                                                this.deleteUserClickedHandler(
                                                    user.id,
                                                )
                                            }
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

                <ModalDialog
                    title={modalDialog.title}
                    visible={modalDialog.visible}
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

const actions = [
    {
        leftIcon: <FontIcon className="Action-Menu-Icon">info</FontIcon>,
        primaryText: <span>More Info</span>,
        name: 'show',
    },
    { divider: true },
    {
        leftIcon: (
            <FontIcon className="Action-Menu-Icon md-text--error">
                delete
            </FontIcon>
        ),
        primaryText: <span className="md-text--error">Delete</span>,
        name: 'delete',
    },
];

const ActionMenu = props => {
    const mappedActions = actions.map(action => {
        let onClickAction;

        switch (action.name) {
            case 'show':
                onClickAction = () => console.log(`Showing: ${props.id}`);

                break;

            case 'delete':
                onClickAction = props.delete;

                break;
        }

        return {
            ...action,
            onClick: onClickAction,
        };
    });

    return (
        <MenuButtonColumn
            id={props.id}
            style={{ ...props.style, maxWidth: '1rem' }}
            icon
            menuItems={mappedActions}
            listClassName="tables__with-menus__kebab-list"
        >
            <FontIcon>more_vert</FontIcon>
        </MenuButtonColumn>
    );
};

export default Index;
