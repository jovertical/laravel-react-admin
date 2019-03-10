import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, withStyles } from '@material-ui/core';

import {
    FirstPage as FirstPageIcon,
    KeyboardArrowLeft as KeyboardArrowLeftIcon,
    KeyboardArrowRight as KeyboardArrowRightIcon,
    LastPage as LastPageIcon,
} from '@material-ui/icons';

let TablePaginationActions = props => {
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

TablePaginationActions = withStyles(
    theme => ({
        root: {
            flexShrink: 0,
            color: theme.palette.text.secondary,
            marginLeft: theme.spacing.unit * 2.5,
        },
    }),
    { withTheme: true },
)(TablePaginationActions);

TablePaginationActions.propTypes = {
    classes: PropTypes.object,
    theme: PropTypes.object,
    onChangePage: PropTypes.func,
    count: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

export { TablePaginationActions };
