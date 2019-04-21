import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Button, Grid, Typography, withStyles } from '@material-ui/core';

import { Dropzone } from '../../../../ui';

function Avatar(props) {
    const [files, setFiles] = useState([]);

    /**
     * Initial files to be fed to dropzone.
     *
     * @return {array}
     */
    const loadFiles = (reset = false) => {
        const { user } = props;

        if (!user.hasOwnProperty('filename')) {
            return;
        }

        if (user.filename === null) {
            return;
        }

        const files = [
            {
                name: user.original_filename,
                size: user.thumbnail_filesize,
                url: user.thumbnail_url,
                type: `image/${user.filename.split('.').reverse()[0]}`,
                status: 'uploaded',
            },
        ];

        setFiles(files);
    };

    /**
     * Handle the removal of files.
     *
     * @param {object} file The file that should be fed to the API.
     * @param {function} removed  When called, will inform that the file is removed.
     *
     * @return {undefined}
     */
    const handleFileRemoved = async (file, removed) => {
        const { user } = props;

        try {
            const response = await axios.delete(
                `api/v1/users/${user.id}/avatar`,
            );

            if (response.status !== 200) {
                removed(false, response.statusText);

                return;
            }

            removed(true);
        } catch (error) {
            if (!error.response) {
                removed(false, 'File not removed due to unknown error.');

                return;
            }

            removed(false, error.response.statusText);
        }
    };

    /**
     * Handle the file upload.
     *
     * @param {object} file The file that should be fed to the API.
     * @param {function} done When called, will inform that upload is done.
     *
     * @return {undefined}
     */
    const handleUpload = async (file, done) => {
        const { user } = props;

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

            if (response.status !== 200) {
                done(false, response.statusText);
            }

            done(true);
        } catch (error) {
            if (!error.response) {
                removed(false, 'File not uploaded due to unknown error.');

                return;
            }

            removed(false, error.response.statusText);
        }
    };

    useEffect(() => {
        if (files.length > 0) {
            return;
        }

        loadFiles();
    });

    const { classes, handleSkip } = props;

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Avatar Upload
            </Typography>

            <Dropzone
                initialFiles={files}
                maxFiles={1}
                maxFileSize={25}
                handleUpload={handleUpload}
                handleFileRemoved={handleFileRemoved}
            />

            <div className={classes.sectionSpacer} />

            <Grid container spacing={24} justify="flex-end">
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSkip}
                    >
                        Finish
                    </Button>
                </Grid>
            </Grid>
        </>
    );
}

Avatar.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
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
