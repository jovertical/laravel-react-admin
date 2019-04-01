import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';

import { Grid, RootRef, Typography, withStyles } from '@material-ui/core';
import classNames from 'classnames';

function Dropzone(props) {
    const { classes } = props;

    const [files, setFiles] = useState([]);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: 'image/*',
        maxSize: 1 * 1000 * 1000,
        onDrop: acceptedFiles => {
            setFiles(
                files.concat(
                    acceptedFiles.map(file =>
                        Object.assign(file, {
                            url: URL.createObjectURL(file),
                        }),
                    ),
                ),
            );
        },
    });

    const { ref, ...rootProps } = getRootProps();

    useEffect(
        () => () => {
            // Make sure to revoke the data uris to avoid memory leaks.
            files.forEach(file => URL.revokeObjectURL(file.preview));
        },
        [files],
    );

    return (
        <RootRef rootRef={ref}>
            <Grid
                {...rootProps}
                container
                spacing={8}
                justify="center"
                alignItems="center"
                className={classes.root}
            >
                <input {...getInputProps()} />

                {files.length > 0 ? (
                    files
                        .map((file, key) => (
                            <Grid item key={key}>
                                <img
                                    src={file.url}
                                    className={classNames(
                                        classes.file,
                                        classes.image,
                                    )}
                                />

                                <Typography
                                    color="primary"
                                    className={classes.removeLink}
                                >
                                    Remove File
                                </Typography>
                            </Grid>
                        ))
                        .concat([
                            <Grid item key="addFile">
                                <div
                                    className={classNames(
                                        classes.file,
                                        classes.addFile,
                                    )}
                                >
                                    <Typography
                                        className={classNames(
                                            classes.text,
                                            classes.textIcon,
                                        )}
                                    >
                                        +
                                    </Typography>
                                </div>

                                <Typography>&nbsp;</Typography>
                            </Grid>,
                        ])
                ) : (
                    <Grid item>
                        <Typography className={classes.text}>
                            {isDragActive
                                ? `Drag files here`
                                : `Drag 'n' drop some files here, or click to select files`}
                        </Typography>
                    </Grid>
                )}
            </Grid>
        </RootRef>
    );
}

Dropzone.propTypes = {
    onDrop: PropTypes.func,
};

const styles = theme => ({
    root: {
        border: `2px dashed ${theme.palette.grey[500]}`,
        backgroundColor: theme.palette.grey[200],
        minHeight: 250,
    },

    text: {
        color: theme.palette.grey[500],
    },

    textIcon: {
        fontSize: 75,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    removeLink: {
        textAlign: 'center',
        '&:hover': {
            cursor: 'pointer',
        },
    },

    file: {
        border: `3px solid ${theme.palette.grey[500]}`,
        borderRadius: '5%',
        width: 120,
        height: 120,
    },

    image: {
        '&:hover': {
            filter: 'blur(4px)',
        },
    },

    addFile: {
        '&:hover': {
            cursor: 'pointer',
        },
    },
});

export default withStyles(styles)(Dropzone);
