import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Cell, TextField, Button } from 'react-md';

import { Errors } from '../../../../core';
import { _route } from '../../../../utils/Navigation';
import { _queryParams } from '../../../../utils/URL';
import { AuthTemplate } from '../../';

export class PasswordRequest extends Component {
    state = {
        email: '',
        errors: new Errors(),
        message: {},
    };

    /**
     * Event listener that is triggered when the password request form is submitted.
     *
     * @param {object} event
     *
     * @return {undefined}
     */
    requestPasswordSubmitHandler = async event => {
        event.preventDefault();

        this.setState({ loading: true });

        try {
            const { history } = this.props;
            const { email } = this.state;
            const routePostfix = _route('backoffice.auth.passwords.reset');

            const response = await axios.post('api/auth/password/request', {
                email,
                routePostfix,
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
                        action: () => history.push(`/signin?u=${email}`),
                    },
                });
            }
        } catch (error) {
            if (error.response) {
                const { data } = error.response;
                const { errors } = this.state;

                errors.record(data.errors);

                this.setState({ loading: false });
            } else {
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
            }
        }
    };

    componentDidMount() {
        const { location } = this.props;

        this.setState({ email: _queryParams(location.search).u });
    }

    render() {
        const { loading, message, email, errors } = this.state;

        return (
            <AuthTemplate
                title="Forgot Password"
                subTitle="Enter your email and we'll send a recovery link"
                loading={loading}
                message={message}
            >
                <form
                    onSubmit={this.requestPasswordSubmitHandler}
                    className="--Form"
                    onChange={event => errors.clear(event.target.id)}
                >
                    <Grid className="--Form-Group">
                        <Cell className="--Item">
                            <TextField
                                id="email"
                                type="email"
                                label="Email"
                                lineDirection="center"
                                value={email}
                                onChange={email => this.setState({ email })}
                                error={errors.has('email')}
                                errorText={errors.get('email')}
                            />
                        </Cell>

                        <Cell className="--Item">
                            <Link
                                to={_route(
                                    'backoffice.auth.signin',
                                    {},
                                    {
                                        u: email,
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
                                disabled={errors.any()}
                            >
                                Send Link
                            </Button>
                        </Cell>
                    </Grid>
                </form>
            </AuthTemplate>
        );
    }
}
