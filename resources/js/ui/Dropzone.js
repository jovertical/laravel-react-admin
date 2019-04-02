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
} from '@material-ui/icons';

import * as StringUtils from '../utils/String';
import { LinearDeterminate } from './Loaders';

const getFileStatusClass = status => {
    switch (status) {
        case 'uploaded':
            return 'fileSuccess';
            break;

        case 'rejected':
            return 'fileError';
            break;

        default:
            return 'filePrimary';
            break;
    }
};

let FileIcon = props => {
    const { classes, status } = props;

    switch (status) {
        case 'uploaded':
            return <CheckCircleIcon color="primary" fontSize="large" />;
            break;

        case 'rejected':
            return <BlockIcon className={classes.error} fontSize="large" />;
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
    status: PropTypes.oneOf(['uploading', 'uploaded', 'rejected']).isRequired,
};

FileIcon = withStyles(theme => ({
    success: {
        color: colors.green[600],
    },

    error: {
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
    const { classes, acceptedFileTypes, maxFiles, maxFileSize } = props;

    const [files, setFiles] = useState([]);

    const getFileErrorMessage = file => {
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

    const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
        accept: acceptedFileTypes.join(','),
        maxSize: maxFileSize * 1000 * 1000,
        onDrop: (acceptedFiles, rejectedFiles) => {
            acceptedFiles = acceptedFiles.map(file =>
                Object.assign(file, {
                    url: URL.createObjectURL(file),
                    status: 'uploading',
                }),
            );

            rejectedFiles = rejectedFiles.map(file =>
                Object.assign(file, {
                    url: URL.createObjectURL(file),
                    status: 'rejected',
                    message: file.hasOwnProperty('message')
                        ? file.message
                        : getFileErrorMessage(file),
                }),
            );

            setFiles(files.concat(acceptedFiles, rejectedFiles));
        },
        noClick: true,
        noKeyboard: true,
    });

    const { ref, ...rootProps } = getRootProps();

    useEffect(
        () => () => {
            files.forEach(file => {
                // Make sure to revoke the data uris to avoid memory leaks.
                URL.revokeObjectURL(file.preview);

                // Process uploading here.
            });
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
                                        {StringUtils._limit(file.name, 10)}
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
                                    onClick={() => {
                                        if (file.status === 'uploading') {
                                            const confirmed = confirm(
                                                'The file is being uploaded, stop it?',
                                            );

                                            if (!confirmed) {
                                                return;
                                            }
                                        }

                                        setFiles(
                                            files.filter(
                                                (file, i) => i !== key,
                                            ),
                                        );
                                    }}
                                >
                                    Remove File
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
    acceptedFileTypes: PropTypes.array,
    onDrop: PropTypes.func,
    maxFiles: PropTypes.number,
    maxFileSize: PropTypes.number,
};

Dropzone.defaultProps = {
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

    fileSuccess: {
        border: `2px solid ${colors.green[600]}`,
    },

    fileError: {
        border: `2px solid ${theme.palette.error.light}`,
    },

    filePrimary: {
        border: `2px solid ${theme.palette.primary.main}`,
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
