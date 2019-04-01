import React from 'react';
import PropTypes from 'prop-types';

import { Button, Grid, Typography, withStyles } from '@material-ui/core';

import { Dropzone } from '../../../../ui';

const Avatar = props => {
    const { classes, values, errors, handleSubmit, handleSkip } = props;

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Avatar Upload
            </Typography>

            <Dropzone />

            <div className={classes.sectionSpacer} />

            <Grid container spacing={24} justify="flex-end">
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSkip}
                    >
                        Skip
                    </Button>
                </Grid>
            </Grid>
        </>
    );
};

Avatar.propTypes = {
    values: PropTypes.object.isRequired,
    errors: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    handleSkip: PropTypes.func.isRequired,
};

const styles = theme => ({
    root: {
        padding: theme.spacing.unit * 10,
        border: `1px solid ${theme.palette.text.primary}`,
    },

    sectionSpacer: {
        marginTop: theme.spacing.unit * 2,
    },
});

export default withStyles(styles)(Avatar);
