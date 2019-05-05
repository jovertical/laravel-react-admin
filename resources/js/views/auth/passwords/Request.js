import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Formik, Form, withFormik } from 'formik';
import * as Yup from 'yup';

import { Button, Grid, Link, TextField, withStyles } from '@material-ui/core';

import * as NavigationUtils from '../../../helpers/Navigation';
import * as UrlUtils from '../../../helpers/URL';
import { Auth as AuthLayout } from '../../layouts';

function PasswordRequest(props) {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState({});

    /**
     * Event listener that is triggered when the password request form is submitted.
     *
     * @param {object} event
     * @param {object} form
     *
     * @return {undefined}
     */
    const handleRequestPasswordSubmit = async (
        values,
        { setSubmitting, setErrors },
    ) => {
        setSubmitting(false);

        try {
            setLoading(true);

            const { history } = props;
            const { email } = values;
            const routeSuffix = NavigationUtils.route('auth.passwords.reset');

            await axios.post('api/v1/auth/password/request', {
                email,
                routeSuffix,
            });

            setLoading(false);
            setMessage({
                type: 'success',
                title: 'Link Sent',
                body: `Check your email to reset your account. Thank you.`,
                action: () => history.push(`/signin?username=${email}`),
            });
        } catch (error) {
            if (!error.response) {
                setLoading(false);
                setMessage({
                    type: 'error',
                    title: 'Something went wrong',
                    body: `Oops? Something went wrong here. Please try again.`,
                    action: () => window.location.reload(),
                });

                return;
            }

            const { errors } = error.response.data;

            setErrors(errors);

            setLoading(false);
        }
    };

    useEffect(() => {
        if (email === '') {
            return;
        }

        const { location } = props;

        setEmail(
            UrlUtils.queryParams(location.search).hasOwnProperty('username')
                ? UrlUtils.queryParams(location.search).username
                : '',
        );
    });

    const { classes, ...other } = props;
    const { location } = props;

    return (
        <AuthLayout
            {...other}
            title={Lang.get('navigation.password_request_title')}
            subTitle={Lang.get('navigation.password_request_subtitle')}
            loading={loading}
            message={message}
        >
            <Formik
                initialValues={{
                    email: !email
                        ? UrlUtils.queryParams(location.search).username
                        : email,
                }}
                onSubmit={handleRequestPasswordSubmit}
                validationSchema={Yup.object().shape({
                    email: Yup.string().required(
                        Lang.get('validation.required', {
                            attribute: 'email',
                        }),
                    ),
                })}
            >
                {({
                    values,
                    handleChange,
                    errors,
                    submitCount,
                    isSubmitting,
                }) => (
                    <Form autoComplete="off">
                        <Grid container direction="column">
                            <Grid item className={classes.formGroup}>
                                <TextField
                                    id="email"
                                    type="email"
                                    label="Email"
                                    value={values.email}
                                    onChange={handleChange}
                                    variant="outlined"
                                    fullWidth
                                    error={
                                        submitCount > 0 &&
                                        errors.hasOwnProperty('email')
                                    }
                                    helperText={
                                        submitCount > 0 &&
                                        errors.hasOwnProperty('email') &&
                                        errors.email
                                    }
                                />
                            </Grid>

                            <Grid item className={classes.formGroup}>
                                <Link
                                    component={props => (
                                        <RouterLink
                                            {...props}
                                            to={{
                                                search: UrlUtils.queryString({
                                                    username: email,
                                                }),
                                                pathname: NavigationUtils.route(
                                                    'auth.signin',
                                                ),
                                            }}
                                        />
                                    )}
                                >
                                    {Lang.get('navigation.signin')}
                                </Link>
                            </Grid>
                        </Grid>

                        <Grid container justify="space-between">
                            <Grid item />

                            <Grid item className={classes.formGroup}>
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
                                    {Lang.get('navigation.send_link')}
                                </Button>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </AuthLayout>
    );
}

const styles = theme => ({
    formGroup: {
        padding: theme.spacing.unit * 2,
        paddingTop: 0,
    },
});

const Styled = withStyles(styles)(PasswordRequest);

export default withFormik({})(Styled);
