import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { TextField, Button } from 'react-md';

import AuthTemplate from '../templates/AuthTemplate';

class SignIn extends Component {
    render() {
        return (
            <AuthTemplate title="Sign in" subtitle="with your Account">
                <div className="AT-Form-Group md-grid">
                    <div className="AT-Form-Group-Item md-cell">
                        <TextField
                            id="floating-center-title"
                            label="Username or Email"
                            lineDirection="center"
                        />
                    </div>
                </div>

                <div className="AT-Form-Group md-grid">
                    <div className="AT-Form-Group-Item md-cell">
                        <TextField
                            type="password"
                            id="floating-center-title"
                            label="Password"
                            lineDirection="center"
                        />
                    </div>

                    <div className="AT-Form-Group-Item md-cell">
                        <Link to="#">Forgot Password?</Link>
                    </div>
                </div>

                <div className="AT-Form-Footer md-grid">
                    <div />

                    <div className="AT-Form-Footer-Item md-cell">
                        <Button flat primary swapTheming>
                            Sign In
                        </Button>
                    </div>
                </div>
            </AuthTemplate>
        );
    }
}

export default SignIn;
