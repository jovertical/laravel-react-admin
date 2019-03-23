import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    Chip,
    Grow,
    IconButton,
    Paper,
    Popper,
    Toolbar,
    Tooltip,
    Typography,
    withStyles,
} from '@material-ui/core';

import {
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Clear as ClearIcon,
    Done as DoneIcon,
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
    TrendingDown as TrendingDownIcon,
    TrendingUp as TrendingUpIcon,
} from '@material-ui/icons';

import { FilterList as FilterListIcon } from '@material-ui/icons';

import FilterForm from './Forms/Filter';

class TableToolbar extends Component {
    state = {
        filterMenuOpen: false,
    };

    filterIcon = type => {
        switch (type) {
            case 'eqs':
                return <DoneIcon />;
                break;

            case 'neqs':
                return <ClearIcon />;
                break;

            case 'gt':
                return <ChevronRightIcon />;
                break;

            case 'lt':
                return <ChevronLeftIcon />;
                break;

            case 'gte':
                return <TrendingUpIcon />;
                break;

            case 'lte':
                return <TrendingDownIcon />;
                break;

            case 'like':
                return <FavoriteIcon />;
                break;

            case 'nlike':
                return <FavoriteBorderIcon />;
                break;
        }
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
            filters,
            onFilter,
            onFilterRemove,
        } = this.props;

        const { filterMenuOpen } = this.state;

        const filterValues = Object.values(filters);

        const filterableColumns = columns.filter(column => {
            // If no filter property is provided in the columns list, include column.
            if (!column.hasOwnProperty('filter')) {
                return true;
            }

            return column.filter;
        });

        let filterAnchorEl = null;

        return (
            <>
                <Toolbar>
                    <div className={classes.title}>
                        <Typography variant="h6" id="tableTitle">
                            {title}
                        </Typography>
                    </div>

                    <div className={classes.spacer} />

                    <div className={classes.actions}>
                        <Tooltip title={Lang.get('table.filter_list')}>
                            <div className={classes.filterMenuWrapper}>
                                <IconButton
                                    aria-label={Lang.get('table.filter_list')}
                                    aria-haspopup="true"
                                    buttonRef={node => (filterAnchorEl = node)}
                                    onClick={this.handleFilterMenuClick}
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
                                            <Paper
                                                className={classes.filterMenu}
                                            >
                                                <FilterForm
                                                    columns={filterableColumns}
                                                    onFilter={onFilter}
                                                />
                                            </Paper>
                                        </Grow>
                                    )}
                                </Popper>
                            </div>
                        </Tooltip>
                    </div>
                </Toolbar>

                {Object.values(filters).length > 0 && (
                    <Toolbar>
                        {Object.keys(filters).map((filterKey, key) => {
                            return (
                                <div key={key} className={classes.filter}>
                                    <small className={classes.filterName}>
                                        {
                                            columns.find(
                                                column =>
                                                    column.property ===
                                                    filterKey.substr(
                                                        0,
                                                        filterKey.indexOf('['),
                                                    ),
                                            ).name
                                        }
                                    </small>

                                    <Chip
                                        icon={this.filterIcon(
                                            filterKey.match(/\[(.*)\]/).pop(),
                                        )}
                                        label={filterValues[key]}
                                        onDelete={() =>
                                            onFilterRemove(filterKey)
                                        }
                                    />
                                </div>
                            );
                        })}
                    </Toolbar>
                )}
            </>
        );
    }
}

TableToolbar.propTypes = {
    title: PropTypes.string.isRequired,
    columns: PropTypes.array.isRequired,
    filters: PropTypes.object,
    filterMenuOpen: PropTypes.bool,
    onFilter: PropTypes.func,
    onFilterRemove: PropTypes.func,
};

export default withStyles(
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
            padding: '1rem',
            right: 0,
            zIndex: 999,
        },

        filter: {
            margin: theme.spacing.unit / 2,
        },

        filterName: {
            marginRight: '0.25rem',
        },
    }),
    { withTheme: true },
)(TableToolbar);
