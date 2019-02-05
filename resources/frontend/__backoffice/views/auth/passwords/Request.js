import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, withFormik } from 'formik';
import * as Yup from 'yup';
import { Grid, Cell, TextField, Button } from 'react-md';

import { AuthTemplate } from '../../';
import { _route } from '../../../../utils/Navigation';
import { _queryParams } from '../../../../utils/URL';

class PasswordRequest extends Component {
    state = {
        loading: false,
        email: '',
        message: {},
    };

    /**
     * Event listener that is triggered when the password request form is submitted.
     *
     * @param {object} event
     *
     * @return {undefined}
     */
    handleRequestPasswordSubmit = async (values, { setSubmitting }) => {
        setSubmitting(false);

        try {
            this.setState({ loading: true });

            const { history } = this.props;
            const { email } = values;
            const routeSuffix = _route('backoffice.auth.passwords.reset');

            const response = await axios.post('api/auth/password/request', {
                email,
                routeSuffix,
            });

            if (response.status === 200) {
                this.setState({
                    loading: false,
                    message: {
                        type: 'success',
                        title: 'Link Sent',
                        body: (
                            <h4>
                                Check your email to reset your account.
                                <br /> Thank you.
                            </h4>
                        ),
                        action: () => history.push(`/signin?username=${email}`),
                    },
                });
            }
        } catch (error) {
            if (!error.response) {
                this.setState({
                    loading: false,
                    message: {
                        type: 'error',
                        title: 'Something went wrong',
                        body: (
                            <h4>
                                Oops? Something went wrong here.
                                <br /> Please try again.
                            </h4>
                        ),
                        action: () => window.location.reload(),
                    },
                });

                return;
            }

            const { errors } = error.response.data;
            const { setErrors } = this.props;

            setErrors(errors);

            this.setState({ loading: false });
        }
    };

    render() {
        const { location, setErrors, errors: formErrors } = this.props;
        const { loading, message, email } = this.state;

        return (
            <AuthTemplate
                title="Forgot Password"
                subTitle="Enter your email and we'll send a recovery link"
                loading={loading}
                message={message}
            >
                <Formik
                    initialValues={{
                        email: !email
                            ? _queryParams(location.search).username
                            : email,
                    }}
                    onSubmit={this.handleRequestPasswordSubmit}
                    validate={values => {
                        setErrors({});
                    }}
                    validationSchema={Yup.object().shape({
                        email: Yup.string().required(
                            `The email field is required`,
                        ),
                    })}
                >
                    {({ values, setFieldValue, errors, isSubmitting }) => {
                        if (Object.keys(formErrors).length > 0) {
                            errors = formErrors;
                        }

                        return (
                            <Form className="--Form">
                                <Grid className="--Form-Group">
                                    <Cell className="--Item">
                                        <TextField
                                            id="email"
                                            type="email"
                                            label="Email"
                                            lineDirection="center"
                                            value={values.email}
                                            onChange={field =>
                                                setFieldValue('email', field)
                                            }
                                            error={errors.hasOwnProperty(
                                                'email',
                                            )}
                                            errorText={
                                                errors.hasOwnProperty(
                                                    'email',
                                                ) && errors.email
                                            }
                                        />
                                    </Cell>

                                    <Cell className="--Item">
                                        <Link
                                            to={_route(
                                                'backoffice.auth.signin',
                                                {},
                                                {
                                                    username: email,
                                                },
                                            )}
                                        >
                                            Sign in instead
                                        </Link>
                                    </Cell>
                                </Grid>

                                <Grid className="--Footer">
                                    <Cell />

                                    <Cell className="--Item">
                                        <Button
                                            type="submit"
                                            flat
                                            primary
                                            swapTheming
                                            disabled={
                                                isSubmitting ||
                                                Object.keys(errors).length > 0
                                            }
                                        >
                                            Send Link
                                        </Button>
                                    </Cell>
                                </Grid>
                            </Form>
                        );
                    }}
                </Formik>
            </AuthTemplate>
        );
    }
}

const WrappedComponent = withFormik({})(PasswordRequest);

export { WrappedComponent as PasswordRequest };
