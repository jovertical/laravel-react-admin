import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { TextField, Button } from 'react-md';

import AuthTemplate from '../templates/AuthTemplate';

class SignIn extends Component {
    state = {
        loading: false,
        username: '',
        password: '',
        errors: {},
    };

    signinSubmitHandler = event => {
        event.preventDefault();

        this.setState({ loading: true });

        axios
            .post('/api/auth/signin', {
                username: this.state.username,
                password: this.state.password,
            })
            .then(response => {
                window.localStorage.setItem('uid', response.data);

                this.setState({ errors: {}, loading: false });

                window.location.reload();
            })
            .catch(({ response }) => {
                const { errors } = response.data;

                this.setState({ errors, loading: false });
            });
    };

    render() {
        return (
            <AuthTemplate
                title="Sign in"
                subtitle="with your Account"
                loading={this.state.loading}
            >
                <form onSubmit={this.signinSubmitHandler}>
                    <div className="AT-Form-Group md-grid">
                        <div className="AT-Form-Group-Item md-cell">
                            <TextField
                                id="username"
                                label="Username or Email"
                                lineDirection="center"
                                value={this.state.username}
                                onChange={value =>
                                    this.setState({ username: value })
                                }
                                error={_.has(this.state.errors, 'username')}
                                errorText={
                                    _.has(this.state.errors, 'username')
                                        ? this.state.errors.username[0]
                                        : ''
                                }
                            />
                        </div>
                    </div>

                    <div className="AT-Form-Group md-grid">
                        <div className="AT-Form-Group-Item md-cell">
                            <TextField
                                id="password"
                                type="password"
                                label="Password"
                                lineDirection="center"
                                value={this.state.password}
                                onChange={value =>
                                    this.setState({ password: value })
                                }
                                error={_.has(this.state.errors, 'password')}
                                errorText={
                                    _.has(this.state.errors, 'password')
                                        ? this.state.errors.password[0]
                                        : ''
                                }
                            />
                        </div>

                        <div className="AT-Form-Group-Item md-cell">
                            <Link to="#">Forgot Password?</Link>
                        </div>
                    </div>

                    <div className="AT-Form-Footer md-grid">
                        <div />

                        <div className="AT-Form-Footer-Item md-cell">
                            <Button type="submit" flat primary swapTheming>
                                Sign In
                            </Button>
                        </div>
                    </div>
                </form>
            </AuthTemplate>
        );
    }
}

export default SignIn;
