import React from 'react';
import PropTypes from 'prop-types';

import {
    withStyles,
    Paper,
    Tooltip,
    Table as MuiTable,
    TableHead,
    TableBody,
    TableFooter,
    TableRow,
    TableCell,
    TableSortLabel,
    TablePagination,
} from '@material-ui/core';

const Table = props => {
    const {
        classes,
        columns,
        data,
        total,
        sortType,
        sortBy,
        headerCellClicked,
        page,
        perPage,
        onChangePage,
        onChangePerPage,
    } = props;
    const emptyRows = perPage - Math.min(perPage, data.length - page * perPage);

    return (
        <Paper className={classes.root}>
            <div className={classes.tableWrapper}>
                <MuiTable className={classes.table}>
                    <TableHead>
                        <TableRow>
                            {columns.map((column, key) => (
                                <TableCell
                                    key={key}
                                    onClick={() =>
                                        column.sort &&
                                        headerCellClicked(column.name)
                                    }
                                >
                                    {!column.sort ? (
                                        column.name
                                    ) : (
                                        <Tooltip
                                            title="Sort"
                                            placement={
                                                column.numeric
                                                    ? 'bottom-end'
                                                    : 'bottom-start'
                                            }
                                            enterDelay={300}
                                        >
                                            <TableSortLabel
                                                active={sortBy === column.name}
                                                direction={sortType}
                                            >
                                                {column.name}
                                            </TableSortLabel>
                                        </Tooltip>
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {data.map((item, key) => (
                            <TableRow key={key}>
                                {Object.values(item).map((cell, cellKey) => {
                                    if (cellKey === 0) {
                                        return (
                                            <TableCell
                                                key={cellKey}
                                                component="th"
                                                scope="row"
                                            >
                                                {cell}
                                            </TableCell>
                                        );
                                    }

                                    return (
                                        <TableCell key={cellKey}>
                                            {cell}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}

                        {emptyRows > 0 && (
                            <TableRow style={{ minHeight: 18 * emptyRows }}>
                                <TableCell colSpan={columns.length} />
                            </TableRow>
                        )}
                    </TableBody>

                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={['5', '10', '20']}
                                colSpan={columns.length}
                                count={total}
                                rowsPerPage={perPage}
                                page={page}
                                onChangePage={(event, page) =>
                                    onChangePage(page)
                                }
                                onChangeRowsPerPage={event =>
                                    onChangePerPage(event.target.value, 0)
                                }
                            />
                        </TableRow>
                    </TableFooter>
                </MuiTable>
            </div>
        </Paper>
    );
};

Table.propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    total: PropTypes.number.isRequired,
    sortType: PropTypes.oneOf(['asc', 'desc']),
    sortBy: PropTypes.string,
    headerCellClicked: PropTypes.func,
    page: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    onChangePerPage: PropTypes.func.isRequired,
};

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        minHeight: '75vh',
    },

    table: {
        minWidth: 500,
    },

    tableWrapper: {
        overflowX: 'auto',
    },
});

const Styled = withStyles(styles)(Table);

export { Styled as Table };
