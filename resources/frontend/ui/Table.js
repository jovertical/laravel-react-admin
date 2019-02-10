import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    withStyles,
    Paper,
    Table as MuiTable,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from '@material-ui/core';

class Table extends Component {
    render() {
        const { classes, columns, data } = this.props;

        return (
            <Paper className={classes.root}>
                <div className={classes.tableWrapper}>
                    <MuiTable className={classes.table}>
                        <TableHead>
                            <TableRow>
                                {columns.map((column, key) => (
                                    <TableCell key={key}>{column}</TableCell>
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
