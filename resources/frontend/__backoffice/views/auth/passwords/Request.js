import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Cell, TextField, Button } from 'react-md';

import { AuthTemplate } from '../../';
import { _route } from '../../../../utils/Navigation';
import { _queryParams } from '../../../../utils/URL';

export class PasswordRequest extends Component {
    state = { email: '', errors: {} };

    /**
     * Event listener that is triggered when an input has changed.
     * This may clear existing errors that is previously attached to the input.
     *
     * @param {string} value
     * @param {string} input
     *
     * @return {undefined}
     */
    inputChangeHandler = (value, input) => {
        this.setState(prevState => {
            const filteredErrors = _.pick(
                prevState.errors,
                _.keys(prevState.errors).filter(field => field !== input),
            );

            return { [input]: value, errors: filteredErrors };
        });
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
            const response = await axios.post('api/auth/password/request', {
                email: this.state.email,
            });

            console.log(response);
        } catch (error) {
            if (error.response) {
                const { errors } = error.response.data;

                this.setState({ loading: false, errors });
            } else {
                throw new Error('Unknown error');
            }
        }
    };

    componentDidMount() {
        const { location } = this.props;

        this.setState({ email: _queryParams(location.search).u });
    }

    render() {
        const { email, errors } = this.state;

        return (
            <AuthTemplate
                title="Forgot Password"
                subTitle="Enter your email and we'll send a recovery link"
            >
                <form
                    onSubmit={this.requestPasswordSubmitHandler}
                    className="--Form"
                >
                    <Grid className="--Form-Group">
                        <Cell className="--Item">
                            <TextField
                                id="email"
                                type="email"
                                label="Email"
                                lineDirection="center"
                                value={email}
                                onChange={value =>
                                    this.inputChangeHandler(value, 'email')
                                }
                                error={_.has(errors, 'email')}
                                errorText={
                                    _.has(errors, 'email')
                                        ? errors.email[0]
                                        : ''
                                }
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
                            <Button type="submit" flat primary swapTheming>
                                Send Link
                            </Button>
                        </Cell>
                    </Grid>
                </form>
            </AuthTemplate>
        );
    }
}
