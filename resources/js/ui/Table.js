import React from 'react';
import PropTypes from 'prop-types';

import {
    withStyles,
    Paper,
    IconButton,
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

import {
    FirstPage as FirstPageIcon,
    KeyboardArrowLeft as KeyboardArrowLeftIcon,
    KeyboardArrowRight as KeyboardArrowRightIcon,
    LastPage as LastPageIcon,
} from '@material-ui/icons';

const PaginationActions = props => {
    const {
        classes,
        theme,
        onChangePage,
        count: total,
        page,
        rowsPerPage: perPage,
    } = props;
    const lastPage = Math.ceil(total / perPage);

    return (
        <div className={classes.root}>
            <IconButton
                onClick={event => onChangePage(event, 0)}
                disabled={page === 0}
                aria-label="First Page"
            >
                {theme.direction === 'rtl' ? (
                    <LastPageIcon />
                ) : (
                    <FirstPageIcon />
                )}
            </IconButton>

            <IconButton
                onClick={event => onChangePage(event, page)}
                disabled={page === 0}
                aria-label="Previous Page"
            >
                {theme.direction === 'rtl' ? (
                    <KeyboardArrowRightIcon />
                ) : (
                    <KeyboardArrowLeftIcon />
                )}
            </IconButton>

            <IconButton
                onClick={event => onChangePage(event, page + 2)}
                disabled={page + 1 >= lastPage}
                aria-label="Next Page"
            >
                {theme.direction === 'rtl' ? (
                    <KeyboardArrowLeftIcon />
                ) : (
                    <KeyboardArrowRightIcon />
                )}
            </IconButton>

            <IconButton
                onClick={event => onChangePage(event, lastPage)}
                disabled={page + 1 >= lastPage}
                aria-label="Last Page"
            >
                {theme.direction === 'rtl' ? (
                    <FirstPageIcon />
                ) : (
                    <LastPageIcon />
                )}
            </IconButton>
        </div>
    );
};

const StyledPaginationActions = withStyles(
    theme => ({
        root: {
            flexShrink: 0,
            color: theme.palette.text.secondary,
            marginLeft: theme.spacing.unit * 2.5,
        },
    }),
    { withTheme: true },
)(PaginationActions);

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
                                        headerCellClicked(column.property)
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
                                                active={
                                                    sortBy === column.property
                                                }
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

                        {data.length > 0 && (
                            <TableRow
                                style={{ height: 32 * (perPage - data.length) }}
                            >
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
                                page={page - 1}
                                rowsPerPage={perPage}
                                onChangePage={(event, page) => {
                                    onChangePage(page);
                                }}
                                onChangeRowsPerPage={event =>
                                    onChangePerPage(event.target.value, 1)
                                }
                                ActionsComponent={StyledPaginationActions}
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
