import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
    Chip,
    Grid,
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

function TableToolbar(props) {
    const [filterMenuVisible, setFilterMenuVisibility] = useState(false);

    const filterIcon = type => {
        switch (type) {
            case 'eqs':
                return <DoneIcon />;

            case 'neqs':
                return <ClearIcon />;

            case 'gt':
                return <ChevronRightIcon />;

            case 'lt':
                return <ChevronLeftIcon />;

            case 'gte':
                return <TrendingUpIcon />;

            case 'lte':
                return <TrendingDownIcon />;

            case 'like':
                return <FavoriteIcon />;

            case 'nlike':
                return <FavoriteBorderIcon />;
        }
    };

    const handleFilterMenuClick = () => {
        setFilterMenuVisibility(!filterMenuVisible);
    };

    const {
        classes,
        title,
        columns,
        filters,
        onFilter,
        onFilterRemove,
    } = props;

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
                                onClick={handleFilterMenuClick}
                            >
                                <FilterListIcon />
                            </IconButton>

                            <Popper
                                open={filterMenuVisible}
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
                                <Typography className={classes.filterName}>
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
                                </Typography>

                                <Chip
                                    icon={filterIcon(
                                        filterKey.match(/\[(.*)\]/).pop(),
                                    )}
                                    label={filterValues[key]}
                                    onDelete={() => onFilterRemove(filterKey)}
                                />
                            </div>
                        );
                    })}
                </Toolbar>
            )}
        </>
    );
}

TableToolbar.propTypes = {
    title: PropTypes.string.isRequired,
    columns: PropTypes.array.isRequired,
    filters: PropTypes.object,
    filterMenuVisible: PropTypes.bool,
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
            padding: 16,
            right: 0,
            zIndex: 999,
        },

        filter: {
            display: 'flex',
            flexWrap: 'no-wrap',
            flexDirection: 'row',
            alignItems: 'center',
            margin: theme.spacing.unit / 2,
        },

        filterName: {
            marginRight: 4,
        },
    }),
    { withTheme: true },
)(TableToolbar);
