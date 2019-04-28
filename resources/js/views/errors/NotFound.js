import React from 'react';

import {
    Grid,
    IconButton,
    InputBase,
    Link,
    Paper,
    Typography,
    withStyles,
} from '@material-ui/core';

import { Search as SearchIcon } from '@material-ui/icons';

import { Error as ErrorLayout } from '../layouts';

let Search = ({ classes }) => (
    <Paper className={classes.root} elevation={1}>
        <IconButton>
            <SearchIcon />
        </IconButton>

        <InputBase
            className={classes.input}
            placeholder="Search for anything"
        />
    </Paper>
);

const searchStyles = theme => ({
    root: {
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
    },

    input: {
        marginLeft: 8,
        flex: 1,
    },
});

Search = withStyles(searchStyles)(Search);

const NotFound = ({ classes }) => (
    <ErrorLayout>
        <Grid item>
            <Typography variant="h1" color="textPrimary">
                404
            </Typography>
        </Grid>

        <Grid item>
            <Typography variant="h6" color="textSecondary">
                Sorry but we could not find the page you are looking for
            </Typography>
        </Grid>

        <Grid className={classes.spacer} item />

        <Grid item>
            <Search />
        </Grid>

        <Grid className={classes.break} item />

        <Grid item>
            <Link href="#">Go Home</Link>
        </Grid>
    </ErrorLayout>
);

const styles = theme => ({
    spacer: {
        height: theme.spacing.unit * 4,
    },

    break: {
        height: theme.spacing.unit * 2,
    },
});

export default withStyles(styles)(NotFound);
