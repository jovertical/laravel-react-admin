import React, { Component } from 'react';
import { Card, CardTitle } from 'react-md';
import { MasterTemplate } from '../';

export class Create extends Component {
    render() {
        return (
            <MasterTemplate {...this.props} pageTitle="Create a user">
                <Card className="--Card">
                    <CardTitle
                        title="Please fill up the form"
                        subtitle={
                            <span>
                                Fields marked with
                                <strong className="text-error"> * </strong>
                                are required
                            </span>
                        }
                    />
                </Card>
            </MasterTemplate>
        );
    }
}
