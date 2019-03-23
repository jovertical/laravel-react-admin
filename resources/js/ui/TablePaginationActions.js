import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, Tooltip, withStyles } from '@material-ui/core';

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
            <Tooltip title={Lang.get('table.first_page')}>
                <span>
                    <IconButton
                        onClick={event => onChangePage(event, 0)}
                        disabled={page === 0}
                        aria-label={Lang.get('table.first_page')}
                    >
                        {theme.direction === 'rtl' ? (
                            <LastPageIcon />
                        ) : (
                            <FirstPageIcon />
                        )}
                    </IconButton>
                </span>
            </Tooltip>

            <Tooltip title={Lang.get('table.previous_page')}>
                <span>
                    <IconButton
                        onClick={event => onChangePage(event, page)}
                        disabled={page === 0}
                        aria-label={Lang.get('table.previous_page')}
                    >
                        {theme.direction === 'rtl' ? (
                            <KeyboardArrowRightIcon />
                        ) : (
                            <KeyboardArrowLeftIcon />
                        )}
                    </IconButton>
                </span>
            </Tooltip>

            <Tooltip title={Lang.get('table.next_page')}>
                <span>
                    <IconButton
                        onClick={event => onChangePage(event, page + 2)}
                        disabled={page + 1 >= lastPage}
                        aria-label={Lang.get('table.next_page')}
                    >
                        {theme.direction === 'rtl' ? (
                            <KeyboardArrowLeftIcon />
                        ) : (
                            <KeyboardArrowRightIcon />
                        )}
                    </IconButton>
                </span>
            </Tooltip>

            <Tooltip title={Lang.get('table.last_page')}>
                <span>
                    <IconButton
                        onClick={event => onChangePage(event, lastPage)}
                        disabled={page + 1 >= lastPage}
                        aria-label={Lang.get('table.last_page')}
                    >
                        {theme.direction === 'rtl' ? (
                            <FirstPageIcon />
                        ) : (
                            <LastPageIcon />
                        )}
                    </IconButton>
                </span>
            </Tooltip>
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

export default TablePaginationActions;
