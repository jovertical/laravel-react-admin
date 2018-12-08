import React, { Component } from 'react';
import {
    FontIcon,
    MenuButtonColumn,
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
        columnHeaders: ['Name', 'Email', 'Gender', 'Birthdate', 'Address', ''],
        pagination: {},
        activeResourceId: 0,
        modalDialogVisible: false,
        modalDialogTitle: '',
        modalDialogContent: '',
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
                this.setState({
                    loading: false,
                    modalDialogVisible: false,
                    pagination: response.data,
                });
            }
        } catch (error) {}
    };

    deleteUserClickedHandler = id => {
        this.setState({
            activeResourceId: id,
            modalDialogVisible: true,
            modalDialogTitle: 'You are deleting a resource.',
            modalDialogContent: 'This action is irreversible! Continue?',
        });
    };

    paginationChangedHandler = async (from, perPage, page) => {
        this.setState({ loading: true });

        await this.fetchUsers({ perPage, page });

        this.setState({ loading: false });
    };

    fetchUsers = async (params = {}) => {
        try {
            const response = await axios.get('/api/users', {
                params: {
                    type: 'superuser',
                    perPage: _.has(params, 'perPage') ? params.perPage : null,
                    page: _.has(params, 'page') ? params.page : null,
                },
            });

            if (response.status === 200) {
                this.setState({ pagination: response.data });
            }
        } catch (error) {}
    };

    async componentWillMount() {
        this.setState({ loading: true });

        await this.fetchUsers();

        this.setState({ loading: false });
    }

    render() {
        const {
            pagination,
            modalDialogVisible,
            modalDialogTitle,
            modalDialogContent,
        } = this.state;
        const { data } = pagination;

        return (
            <div>
                <MasterTemplate {...this.props}>
                    {!this.state.loading ? (
                        <DataTable baseId="users">
                            <TableHeader>
                                <TableRow selectable={false}>
                                    {this.state.columnHeaders.map(
                                        (header, i) => (
                                            <TableColumn key={i}>
                                                {header}
                                            </TableColumn>
                                        ),
                                    )}
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {data.map(user => (
                                    <TableRow key={user.id} selectable={false}>
                                        <TableColumn>{`${user.firstname} ${
                                            user.lastname
                                        }`}</TableColumn>

                                        <TableColumn>{user.email}</TableColumn>

                                        <TableColumn>
                                            {!_.isEmpty(user.gender)
                                                ? _.startCase(user.gender)
                                                : null}
                                        </TableColumn>

                                        <TableColumn>
                                            {user.birthdate}
                                        </TableColumn>

                                        <TableColumn>
                                            {user.address}
                                        </TableColumn>

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
                    title={modalDialogTitle}
                    visible={modalDialogVisible}
                    confirmAction={this.deleteUserModalConfirmedHandler}
                    cancelAction={() =>
                        this.setState({ modalDialogVisible: false })
                    }
                >
                    {modalDialogContent}
                </ModalDialog>
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
        <MenuButtonColumn id={props.id} icon menuItems={mappedActions}>
            <FontIcon>more_vert</FontIcon>
        </MenuButtonColumn>
    );
};

export default Index;
