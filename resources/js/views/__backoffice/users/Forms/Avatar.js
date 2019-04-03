import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button, Grid, Typography, withStyles } from '@material-ui/core';

import { Dropzone } from '../../../../ui';

class Avatar extends Component {
    /**
     * Handle the file upload.
     *
     * @param {object} file The file that should be fed to the API.
     * @param {function} done When called, will inform that upload is done.
     *
     * @return {undefined}
     */
    handleUpload = async (file, done) => {
        const { pageProps } = this.props;
        const { user } = pageProps;

        try {
            const formData = new FormData();
            formData.append('avatar', file);

            const response = await fetch(`api/v1/users/${user.id}/avatar`, {
                method: 'POST',
                headers: {
                    Authorization:
                        axios.defaults.headers.common['Authorization'],
                    'X-CSRF-TOKEN':
                        axios.defaults.headers.common['X-CSRF-TOKEN'],
                },
                body: formData,
            });
        } catch (error) {}
    };

    render() {
        const { classes, handleSkip } = this.props;

        return (
            <>
                <Typography variant="h6" gutterBottom>
                    Avatar Upload
                </Typography>

                <Dropzone
                    maxFiles={2}
                    maxFileSize={2}
                    handleUpload={this.handleUpload}
                    handleFileRemoved={removed => {
                        setTimeout(() => {
                            removed();
                        }, Math.floor(Math.random() * Math.floor(10)) * 1000);
                    }}
                />

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
    }
}

Avatar.propTypes = {
    classes: PropTypes.object.isRequired,
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
