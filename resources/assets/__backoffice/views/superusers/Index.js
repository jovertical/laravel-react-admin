import React, { Component } from 'react';
import {
    DataTable,
    TableHeader,
    TableBody,
    TableRow,
    TableColumn,
    TablePagination,
} from 'react-md';

import Loading from '../../ui/Loading';
import MasterTemplate from '../templates/MasterTemplate';

class Index extends Component {
    state = {
        loading: false,
        columnHeaders: ['Name', 'Gender', 'Birthdate', 'Address', 'Email'],
        pagination: {},
    };

    paginationChangedHandler = async (from, perPage, page) => {
        this.setState({ loading: true });

        await this.fetchUsers({ perPage, page });

        this.setState({ loading: false });
    };

    async fetchUsers(params = {}) {
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
    }

    async componentWillMount() {
        this.setState({ loading: true });

        await this.fetchUsers();

        this.setState({ loading: false });
    }

    render() {
        const { pagination } = this.state;
        const { data } = pagination;

        return (
            <MasterTemplate {...this.props}>
                {!this.state.loading ? (
                    <DataTable baseId="users">
                        <TableHeader>
                            <TableRow selectable={false}>
                                {this.state.columnHeaders.map((header, i) => (
                                    <TableColumn key={i}>{header}</TableColumn>
                                ))}
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {data.map(user => (
                                <TableRow key={user.id} selectable={false}>
                                    <TableColumn>{`${user.firstname} ${
                                        user.lastname
                                    }`}</TableColumn>
                                    <TableColumn>
                                        {!_.isEmpty(user.gender)
                                            ? _.startCase(user.gender)
                                            : null}
                                    </TableColumn>
                                    <TableColumn>{user.birthdate}</TableColumn>
                                    <TableColumn>{user.address}</TableColumn>
                                    <TableColumn>{user.email}</TableColumn>
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
        );
    }
}

export default Index;
