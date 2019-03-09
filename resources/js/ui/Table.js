import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    withStyles,
    Button,
    ClickAwayListener,
    Grow,
    IconButton,
    Paper,
    Popper,
    Table as MuiTable,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Toolbar,
    Tooltip,
    Typography,
} from '@material-ui/core';

import {
    FilterList as FilterListIcon,
    FirstPage as FirstPageIcon,
    KeyboardArrowLeft as KeyboardArrowLeftIcon,
    KeyboardArrowRight as KeyboardArrowRightIcon,
    LastPage as LastPageIcon,
} from '@material-ui/icons';

let TableToolbar = props => {
    const { classes, title, filterMenuOpen, handleFilterMenuClick } = props;
    let filterAnchorEl = null;

    return (
        <Toolbar>
            <div className={classes.title}>
                <Typography variant="h6" id="tableTitle">
                    {title}
                </Typography>
            </div>

            <div className={classes.spacer} />

            <div className={classes.actions}>
                <Tooltip title="Filter list">
                    <div class={classes.filterMenuWrapper}>
                        <IconButton
                            aria-label="Filter list"
                            aria-haspopup="true"
                            buttonRef={node => console.log(node)}
                            onClick={handleFilterMenuClick}
                        >
                            <FilterListIcon />
                        </IconButton>

                        <Popper
                            open={filterMenuOpen}
                            anchorEl={filterAnchorEl}
                            transition
                            disablePortal
                        >
                            {({ TransitionProps, placement }) => (
                                <Grow
                                    {...TransitionProps}
                                    id="menu-list-grow"
                                    style={{
                                        transformOrigin:
                                            placement === 'bottom'
                                                ? 'center top'
                                                : 'center bottom',
                                    }}
                                >
                                    <Paper className={classes.filterMenu}>
                                        <ClickAwayListener
                                            onClickAway={handleFilterMenuClick}
                                        >
                                            <div>Filter Form</div>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                    </div>
                </Tooltip>
            </div>
        </Toolbar>
    );
};

TableToolbar.propTypes = {
    title: PropTypes.string.isRequired,
    filterMenuOpen: PropTypes.bool,
    handleFilterMenuClick: PropTypes.func,
};

TableToolbar = withStyles(
    theme => ({
        title: {
            flex: '0 0 auto',
        },

        spacer: {
            flex: '1 1 100%',
        },

        actions: {
            color: theme.palette.text.secondary,
        },

        filterMenuWrapper: {
            position: 'relative',
            display: 'inline-block',
        },

        filterMenu: {
            position: 'absolute',
            padding: '5rem',
            right: 0,
        },
    }),
    { withTheme: true },
)(TableToolbar);

let PaginationActions = props => {
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

PaginationActions = withStyles(
    theme => ({
        root: {
            flexShrink: 0,
            color: theme.palette.text.secondary,
            marginLeft: theme.spacing.unit * 2.5,
        },
    }),
    { withTheme: true },
)(PaginationActions);

class Table extends Component {
    state = {
        filterMenuOpen: false,
    };

    handleFilterMenuClick = () => {
        this.setState(prevState => {
            return {
                filterMenuOpen: !prevState.filterMenuOpen,
            };
        });
    };

    render() {
        const {
            classes,
            title,
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
        } = this.props;

        const { filterMenuOpen } = this.state;

        return (
            <Paper className={classes.root}>
                <TableToolbar
                    title={title}
                    filterMenuOpen={filterMenuOpen}
                    handleFilterMenuClick={this.handleFilterMenuClick}
                />

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
                                                        sortBy ===
                                                        column.property
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

                            {data.length > 0 && (
                                <TableRow
                                    style={{
                                        height: 32 * (perPage - data.length),
                                    }}
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
                                    ActionsComponent={PaginationActions}
                                />
                            </TableRow>
                        </TableFooter>
                    </MuiTable>
                </div>
            </Paper>
        );
    }
}

Table.propTypes = {
    title: PropTypes.string.isRequired,
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
