import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDropzone } from 'react-dropzone';

import {
    Button,
    colors,
    Grid,
    Icon,
    RootRef,
    Tooltip,
    Typography,
    withStyles,
} from '@material-ui/core';

import {
    Block as BlockIcon,
    CheckCircle as CheckCircleIcon,
    Queue as QueueIcon,
} from '@material-ui/icons';

import * as StringUtils from '../helpers/String';
import { LinearDeterminate } from './Loaders';

const getFileStatusClass = status => {
    switch (status) {
        case 'queued':
            return 'fileQueued';
            break;

        case 'uploaded':
            return 'fileUploaded';
            break;

        case 'rejected':
            return 'fileRejected';
            break;

        default:
            return 'fileUploading';
            break;
    }
};

let FileIcon = props => {
    const { classes, status } = props;

    switch (status) {
        case 'queued':
            return <QueueIcon className={classes.queued} fontSize="large" />;
            break;

        case 'uploaded':
            return (
                <CheckCircleIcon
                    className={classes.uploaded}
                    fontSize="large"
                />
            );
            break;

        case 'rejected':
            return <BlockIcon className={classes.rejected} fontSize="large" />;
            break;

        default:
            return (
                <LinearDeterminate className={classes.uploading} speed="slow" />
            );
            break;
    }
};

FileIcon.propTypes = {
    classes: PropTypes.object.isRequired,
    status: PropTypes.oneOf(['queued', 'uploading', 'uploaded', 'rejected'])
        .isRequired,
};

FileIcon = withStyles(theme => ({
    queued: {
        color: theme.palette.grey[500],
    },

    uploaded: {
        color: colors.green[600],
    },

    rejected: {
        color: theme.palette.error.light,
    },

    uploading: {
        marginTop: 12,
        height: 12,
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
}))(FileIcon);

function Dropzone(props) {
    const {
        classes,
        initialFiles,
        acceptedFileTypes,
        maxFiles,
        maxFileSize,
        handleUpload,
        handleFileRemoved,
    } = props;

    const [files, setFiles] = useState(initialFiles);

    const getfileRejectedMessage = file => {
        let errors = [];

        if (
            acceptedFileTypes.filter(type => type.indexOf(file.type) < 0)
                .length === 0
        ) {
            errors.push(`File type is invalid.`);
        }

        if (file.size / 1000 / 1000 > maxFileSize) {
            errors.push(
                `File size is over the limit of ${maxFileSize} megabytes.`,
            );
        }

        if (errors.length === 0) {
            return 'File not accepted due to unknown error.';
        }

        return errors[0];
    };

    const removeFile = removedFile => {
        if (removedFile.status === 'uploading') {
            const confirmed = confirm('The file is being uploaded, stop it?');

            if (!confirmed) {
                return;
            }
        }

        if (removedFile.status === 'uploaded') {
            handleFileRemoved(removedFile, (removed, message = '') => {
                if (!removed) {
                    // Let it be known why the file is not removed.
                    setFiles(
                        files.map(file => {
                            if (file.url === removedFile.url) {
                                return Object.assign(file, {
                                    message,
                                });
                            }

                            return file;
                        }),
                    );

                    return;
                }

                setFiles(files.filter(file => file.url !== removedFile.url));
            });

            return;
        }

        setFiles(files.filter(file => file.url !== removedFile.url));
    };

    useEffect(
        () => () =>
            files.forEach(file => {
                // Make sure to revoke the data uris to avoid memory leaks.
                URL.revokeObjectURL(file.preview);
            }),
        [files],
    );

    /**
     * Handle the queueing of files here.
     */
    useEffect(() => {
        // If nothing is in the queue, stop.
        if (files.findIndex(file => file.status === 'queued') < 0) {
            return;
        }

        // Stop if there is a file being uploaded.
        if (files.findIndex(file => file.status === 'uploading') > -1) {
            return;
        }

        // Queue out a file if the one being uploaded is removed / has finished.
        setFiles(
            files
                // Set aside the uploaded files
                .filter(file => file.status === 'uploaded')
                .concat(
                    files
                        // Only the queued files should be a candidate for uploading.
                        .filter(file => file.status === 'queued')
                        .map((file, key) => {
                            // Upload the first in the queue
                            if (key === 0) {
                                return Object.assign(file, {
                                    status: 'uploading',
                                    message: '',
                                });
                            }

                            return file;
                        }),
                )
                // Append the rejected files at the end.
                .concat(files.filter(file => file.status === 'rejected')),
        );
    }, [files]);

    /**
     * Handle the file being uploaded here.
     */
    useEffect(() => {
        // Stop if there are nothing to be uploaded.
        if (files.findIndex(file => file.status === 'uploading') < 0) {
            return;
        }

        handleUpload(
            files.find(file => file.status === 'uploading'),
            (uploaded, message = '') => {
                function updateFiles(fileStatus, fileMessage = '') {
                    setFiles(
                        files.map(file => {
                            if (file.status === 'uploading') {
                                return Object.assign(file, {
                                    status: fileStatus,
                                    message: fileMessage,
                                });
                            }

                            return file;
                        }),
                    );
                }

                if (!uploaded) {
                    updateFiles('rejected', message);

                    return;
                }

                updateFiles('uploaded');
            },
        );
    }, [files]);

    const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
        accept: acceptedFileTypes.join(','),
        maxSize: maxFileSize * 1000 * 1000,
        onDrop: (acceptedFiles, rejectedFiles) => {
            acceptedFiles = acceptedFiles.map((file, key) =>
                Object.assign(file, {
                    url: URL.createObjectURL(file),
                    status: 'queued',
                    message: 'File is on the waiting queue.',
                }),
            );

            rejectedFiles = rejectedFiles.map(file =>
                Object.assign(file, {
                    url: URL.createObjectURL(file),
                    status: 'rejected',
                    message: file.hasOwnProperty('message')
                        ? file.message
                        : getfileRejectedMessage(file),
                }),
            );

            setFiles(
                files.concat(acceptedFiles, rejectedFiles).map((file, key) => {
                    // Set the first one as uploading.
                    if (key === 0 && file.status === 'queued') {
                        return Object.assign(file, {
                            status: 'uploading',
                            message: '',
                        });
                    }

                    // If the file count exceeds the maximum, set it as rejected.
                    if (key + 1 > maxFiles) {
                        return Object.assign(file, {
                            status: 'rejected',
                            message: 'It could not accept more files.',
                        });
                    }

                    return file;
                }),
            );
        },
        noClick: true,
        noKeyboard: true,
    });

    const { ref, ...rootProps } = getRootProps();

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
                            <Grid item key={key} className={classes.textCenter}>
                                <div className={classes.fileWrapper}>
                                    {file.type.indexOf('image') > -1 ? (
                                        <img
                                            src={file.url}
                                            className={classNames(
                                                classes.file,
                                                classes.image,
                                                classes[
                                                    getFileStatusClass(
                                                        file.status,
                                                    )
                                                ],
                                            )}
                                        />
                                    ) : (
                                        <div
                                            className={classNames(
                                                classes.file,
                                                classes.fileInvalid,
                                                classes[
                                                    getFileStatusClass(
                                                        file.status,
                                                    )
                                                ],
                                            )}
                                        />
                                    )}

                                    <Typography
                                        className={classNames(
                                            classes.fileInfo,
                                            classes.fileSize,
                                        )}
                                    >
                                        {Math.round(
                                            (file.size / 1000 / 1000) * 100,
                                        ) / 100}{' '}
                                        mb
                                    </Typography>

                                    <Typography
                                        className={classNames(
                                            classes.fileInfo,
                                            classes.fileName,
                                        )}
                                    >
                                        {StringUtils.limit(file.name, 10)}
                                    </Typography>

                                    <Tooltip
                                        title={
                                            file.hasOwnProperty('message')
                                                ? file.message
                                                : ''
                                        }
                                        TransitionProps={{
                                            style: {
                                                backgroundColor:
                                                    file.status === 'rejected'
                                                        ? colors.red[400]
                                                        : '',
                                            },
                                        }}
                                    >
                                        <Icon
                                            component="div"
                                            className={classes.fileIcon}
                                        >
                                            <FileIcon status={file.status} />
                                        </Icon>
                                    </Tooltip>
                                </div>

                                <Typography
                                    color="primary"
                                    className={classes.removeLink}
                                    onClick={() => removeFile(file)}
                                >
                                    {file.status === 'uploading'
                                        ? 'Cancel'
                                        : 'Remove File'}
                                </Typography>
                            </Grid>
                        ))
                        .concat([
                            <Grid
                                item
                                key="fileAdd"
                                className={classes.textCenter}
                            >
                                <div
                                    className={classNames(
                                        classes.file,
                                        classes.fileAdd,
                                    )}
                                >
                                    <Typography
                                        className={classNames(
                                            classes.text,
                                            classes.textIcon,
                                        )}
                                        onClick={open}
                                    >
                                        +
                                    </Typography>
                                </div>

                                <Typography>&nbsp;</Typography>
                            </Grid>,
                        ])
                ) : (
                    <Grid item className={classes.textCenter}>
                        <Typography className={classes.text} gutterBottom>
                            {isDragActive
                                ? `Drag files here`
                                : `Drag 'n' drop some files here`}
                        </Typography>

                        <Typography
                            className={classNames(classes.text)}
                            gutterBottom
                        >
                            Or
                        </Typography>

                        <Button
                            color="primary"
                            variant="contained"
                            onClick={open}
                        >
                            Browse Files
                        </Button>
                    </Grid>
                )}
            </Grid>
        </RootRef>
    );
}

Dropzone.propTypes = {
    initialFiles: PropTypes.array,
    acceptedFileTypes: PropTypes.array,
    maxFiles: PropTypes.number,
    maxFileSize: PropTypes.number,
    handleUpload: PropTypes.func.isRequired,
    handleFileRemoved: PropTypes.func.isRequired,
};

Dropzone.defaultProps = {
    initialFiles: [],
    acceptedFileTypes: ['image/*'],
    maxFiles: 5,
    maxFileSize: 1,
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
        fontSize: 50,
        padding: 20,
        fontWeight: 'bold',
    },

    textCenter: {
        textAlign: 'center',
    },

    removeLink: {
        '&:hover': {
            cursor: 'pointer',
        },
    },

    fileWrapper: {
        position: 'relative',
        '&:hover div': {
            display: 'block',
        },
    },

    fileInfo: {
        position: 'absolute',
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        color: theme.palette.grey[900],
    },

    fileSize: {
        top: 30,
    },

    fileName: {
        bottom: 30,
    },

    fileIcon: {
        display: 'none',
        position: 'absolute',
        width: '100%',
        fontSize: 35,
        top: 45,
    },

    file: {
        borderRadius: '5%',
        width: 120,
        height: 120,
    },

    image: {
        '&:hover': {
            filter: 'blur(2px)',
        },
    },

    fileQueued: {
        border: `2px solid ${theme.palette.grey[500]}`,
    },

    fileUploading: {
        border: `2px solid ${theme.palette.primary.main}`,
    },

    fileUploaded: {
        border: `2px solid ${colors.green[600]}`,
    },

    fileRejected: {
        border: `2px solid ${theme.palette.error.light}`,
    },

    fileAdd: {
        border: `2px dashed ${theme.palette.grey[500]}`,
        '&:hover': {
            cursor: 'pointer',
        },
    },

    fileInvalid: {
        backgroundColor: theme.palette.grey[300],
    },
});

export default withStyles(styles)(Dropzone);
