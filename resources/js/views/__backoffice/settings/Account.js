import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import {
    Button,
    CircularProgress,
    Grid,
    Hidden,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    Typography,
    withStyles,
} from '@material-ui/core';

import {
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
} from '@material-ui/icons';

import * as UrlUtils from '../../../utils/URL';
import {
    Clean as CleanLayout,
    Settings as SettingsLayout,
    Slave as SlaveLayout,
} from '../layouts';

function Account(props) {
    const { classes, ...other } = props;
    const { location, pageProps } = props;
    const { user } = pageProps;

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({});
    const [formVisible, setFormVisibility] = useState(false);
    const [oldPasswordVisible, setOldPasswordVisibility] = useState(false);
    const [passwordVisible, setPasswordVisibility] = useState(false);
    const [
        passwordConfirmationVisible,
        setPasswordConfirmationVisibility,
    ] = useState(false);

    /**
     * Handle password form submit, this should send an API response
     * to update the password.
     *
     * @param {object} values
     * @param {object} form
     *
     * @return {undefined}
     */
    const handlePasswordSubmit = async (
        values,
        { setSubmitting, setErrors },
    ) => {
        setSubmitting(false);

        const updatePassword = () =>
            axios.patch('/api/v1/settings/account/password', values);

        try {
            setLoading(true);

            await updatePassword();

            setMessage({
                type: 'success',
                body: Lang.get('settings.account_password_updated'),
                closed: () => setMessage({}),
            });

            setLoading(false);
        } catch (error) {
            if (!error.response) {
                return;
            }

            const { errors } = error.response.data;

            if (errors) {
                setErrors(errors);
            } else {
                setMessage({
                    type: 'error',
                    body: Lang.get('settings.account_password_not_updated'),
                    closed: () => setMessage({}),
                    actionText: Lang.get('actions.retry'),
                    action: async () => await updatePassword(),
                });
            }

            setLoading(false);
        }
    };

    useEffect(() => {
        const queryParams = UrlUtils._queryParams(location.search);

        if (queryParams.hasOwnProperty('visible')) {
            setFormVisibility(true);
        } else if (queryParams.hasOwnProperty('hidden')) {
            setFormVisibility(false);
        }
    });

    const renderPasswordForm = (
        <Grid item md={8} sm={12} xs={12}>
            <Paper className={classes.form}>
                <Formik
                    initialValues={{
                        old_password: '',
                        password: '',
                        password_confirmation: '',
                    }}
                    validationSchema={Yup.object().shape({
                        old_password: Yup.string().required(
                            Lang.get('validation.required', {
                                attribute: 'old password',
                            }),
                        ),

                        password: Yup.string()
                            .required(
                                Lang.get('validation.required', {
                                    attribute: 'password',
                                }),
                            )
                            .min(
                                8,
                                Lang.get('validation.min.string', {
                                    attribute: 'password',
                                    min: 8,
                                }),
                            )
                            .oneOf(
                                [Yup.ref('password_confirmation'), null],
                                Lang.get('validation.confirmed', {
                                    attribute: 'password',
                                }),
                            ),

                        password_confirmation: Yup.string()
                            .required(
                                Lang.get('validation.required', {
                                    attribute: 'password confirmation',
                                }),
                            )
                            .min(
                                8,
                                Lang.get('validation.min.string', {
                                    attribute: 'password confirmation',
                                    min: 8,
                                }),
                            ),
                    })}
                    onSubmit={handlePasswordSubmit}
                    validateOnBlur={false}
                >
                    {({
                        values,
                        errors,
                        submitCount,
                        isSubmitting,
                        handleChange,
                    }) => (
                        <Form>
                            <Typography variant="h6" gutterBottom>
                                Change Password
                            </Typography>

                            <TextField
                                type={oldPasswordVisible ? 'text' : 'password'}
                                id="old_password"
                                name="old_password"
                                label="Old Password"
                                placeholder="Enter your old password"
                                value={values.old_password}
                                onChange={handleChange}
                                fullWidth
                                margin="dense"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="Toggle old password visibility"
                                                onClick={() =>
                                                    setOldPasswordVisibility(
                                                        !oldPasswordVisible,
                                                    )
                                                }
                                            >
                                                {oldPasswordVisible ? (
                                                    <VisibilityOffIcon />
                                                ) : (
                                                    <VisibilityIcon />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                error={
                                    submitCount > 0 &&
                                    errors.hasOwnProperty('old_password')
                                }
                                helperText={
                                    submitCount > 0 &&
                                    errors.hasOwnProperty('old_password') &&
                                    errors.old_password
                                }
                            />

                            <TextField
                                type={passwordVisible ? 'text' : 'password'}
                                id="password"
                                name="password"
                                label="Password"
                                placeholder="Enter your password"
                                value={values.password}
                                onChange={handleChange}
                                fullWidth
                                margin="dense"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="Toggle password visibility"
                                                onClick={() =>
                                                    setPasswordVisibility(
                                                        !passwordVisible,
                                                    )
                                                }
                                            >
                                                {passwordVisible ? (
                                                    <VisibilityOffIcon />
                                                ) : (
                                                    <VisibilityIcon />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                error={
                                    submitCount > 0 &&
                                    errors.hasOwnProperty('password')
                                }
                                helperText={
                                    submitCount > 0 &&
                                    errors.hasOwnProperty('password') &&
                                    errors.password
                                }
                            />

                            <TextField
                                type={
                                    passwordConfirmationVisible
                                        ? 'text'
                                        : 'password'
                                }
                                id="password_confirmation"
                                name="password_confirmation"
                                label="Password Confirmation"
                                placeholder="Enter your password again"
                                value={values.password_confirmation}
                                onChange={handleChange}
                                fullWidth
                                margin="dense"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="Toggle password confirmation visibility"
                                                onClick={() =>
                                                    setPasswordConfirmationVisibility(
                                                        !passwordConfirmationVisible,
                                                    )
                                                }
                                            >
                                                {passwordConfirmationVisible ? (
                                                    <VisibilityOffIcon />
                                                ) : (
                                                    <VisibilityIcon />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                error={
                                    submitCount > 0 &&
                                    errors.hasOwnProperty(
                                        'password_confirmation',
                                    )
                                }
                                helperText={
                                    submitCount > 0 &&
                                    errors.hasOwnProperty(
                                        'password_confirmation',
                                    ) &&
                                    errors.password_confirmation
                                }
                            />

                            <div className={classes.dense} />

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={
                                    (errors &&
                                        Object.keys(errors).length > 0 &&
                                        submitCount > 0) ||
                                    isSubmitting
                                }
                            >
                                {loading && (
                                    <div className={classes.spinner}>
                                        <CircularProgress
                                            size={14}
                                            color="inherit"
                                        />
                                    </div>
                                )}

                                <Typography color="inherit">Change</Typography>
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </Grid>
    );

    const renderBody = (
        <SettingsLayout
            navigationProps={{
                ...other,
                formVisible,
                setFormVisibility: () => setFormVisibility(!formVisible),
            }}
        >
            <Hidden mdUp>{formVisible && <>{renderPasswordForm}</>}</Hidden>

            <Hidden smDown>
                <>{renderPasswordForm}</>
            </Hidden>
        </SettingsLayout>
    );

    const Layout = formVisible ? SlaveLayout : CleanLayout;

    return (
        <Layout {...other} pageTitle="Account" message={message}>
            {renderBody}
        </Layout>
    );
}

const styles = theme => ({
    form: {
        padding: theme.spacing.unit * 3,
        minHeight: '100%',
    },

    dense: {
        marginTop: 16,
    },

    spinner: {
        marginRight: theme.spacing.unit,
    },
});

export default withStyles(styles)(Account);
