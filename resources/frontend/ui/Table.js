import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    withStyles,
    Paper,
    Tooltip,
    Table as MuiTable,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableSortLabel,
} from '@material-ui/core';

class Table extends Component {
    render() {
        const {
            classes,
            columns,
            data,
            sortType,
            sortBy,
            headerCellClicked,
        } = this.props;

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
                                                    active={
                                                        sortBy === column.name
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
                                    {Object.values(item).map(
                                        (cell, cellKey) => {
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
                                        },
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </MuiTable>
                </div>
            </Paper>
        );
    }
}

Table.propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    sortType: PropTypes.oneOf(['asc', 'desc']),
    sortBy: PropTypes.string,
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
