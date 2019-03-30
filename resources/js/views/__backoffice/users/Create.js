import React, { Component } from 'react';

import {
    Paper,
    Step,
    StepLabel,
    Stepper,
    Typography,
    withStyles,
} from '@material-ui/core';

import * as NavigationUtils from '../../../utils/Navigation';
import { User } from '../../../models';
import { LinearIndeterminate } from '../../../ui/Loaders';
import { Master as MasterLayout } from '../layouts';

import { Profile, Account, Avatar } from './Forms';

class Create extends Component {
    state = {
        loading: false,
        activeStep: 0,
        formValues: [],
        errors: {},
        message: {},
    };

    /**
     * This should return back to the previous step.
     *
     * @return {undefined}
     */
    handleBack = () => {
        this.setState(prevState => {
            return {
                activeStep: prevState.activeStep - 1,
            };
        });
    };

    /**
     * Handle form submit, this should send an API response
     * to create a user.
     *
     * @param {object} values
     *
     * @param {object} form
     *
     * @return {undefined}
     */
    handleSubmit = async (values, { setSubmitting, setErrors }) => {
        setSubmitting(false);

        // Stop here as it is the last step...
        if (this.state.activeStep === 2) {
            return;
        }

        this.setState({ loading: true });

        try {
            const { activeStep, formValues } = this.state;
            let previousValues = {};

            // Merge the form values here.
            if (activeStep === 1) {
                previousValues = formValues.reduce((prev, next) => {
                    return { ...prev, ...next };
                });
            }

            // Instruct the API the current step.
            values.step = activeStep;

            await User.store({ ...previousValues, ...values });

            // After persisting the previous values. Move to the next step...
            this.setState(prevState => {
                let formValues = [...prevState.formValues];
                formValues[prevState.activeStep] = values;

                let message = {};

                if (prevState.activeStep === 1) {
                    message = {
                        type: 'success',
                        body: Lang.get('resources.created', {
                            name: 'User',
                        }),
                        closed: () => this.setState({ message: {} }),
                    };
                }

                return {
                    loading: false,
                    message,
                    formValues,
                    activeStep: prevState.activeStep + 1,
                };
            });
        } catch (error) {
            if (!error.response) {
                throw new Error('Unknown error');
            }

            const { errors } = error.response.data;

            setErrors(errors);

            this.setState({ loading: false });
        }
    };

    render() {
        const { classes, ...other } = this.props;
        const { loading, activeStep, formValues, errors, message } = this.state;

        const steps = ['Profile', 'Account', 'Avatar'];

        const renderForm = () => {
            switch (activeStep) {
                case 0:
                    const defaultValues = {
                        firstname: '',
                        middlename: '',
                        lastname: '',
                        gender: '',
                        birthdate: null,
                        address: '',
                    };

                    return (
                        <Profile
                            values={
                                formValues[0] ? formValues[0] : defaultValues
                            }
                            errors={errors}
                            handleSubmit={this.handleSubmit}
                        />
                    );
                    break;

                case 1:
                    return (
                        <Account
                            values={{
                                type: '',
                                email: '',
                                username: '',
                            }}
                            errors={errors}
                            handleSubmit={this.handleSubmit}
                            handleBack={this.handleBack}
                        />
                    );
                    break;

                case 2:
                    return (
                        <Avatar
                            values={{}}
                            errors={errors}
                            handleSubmit={this.handleSubmit}
                            handleSkip={() =>
                                this.props.history.push(
                                    NavigationUtils._route(
                                        'backoffice.users.index',
                                    ),
                                )
                            }
                        />
                    );
                    break;

                default:
                    throw new Error('Unknown step!');
                    break;
            }
        };

        return (
            <MasterLayout
                {...other}
                pageTitle="Create a user"
                tabs={[]}
                message={message}
            >
                <div className={classes.pageContentWrapper}>
                    {loading && <LinearIndeterminate />}

                    <Paper>
                        <div className={classes.pageContent}>
                            <Typography
                                component="h1"
                                variant="h4"
                                align="center"
                                gutterBottom
                            >
                                User Creation
                            </Typography>

                            <Stepper
                                activeStep={activeStep}
                                className={classes.stepper}
                            >
                                {steps.map(name => (
                                    <Step key={name}>
                                        <StepLabel>{name}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>

                            {renderForm()}
                        </div>
                    </Paper>
                </div>
            </MasterLayout>
        );
    }
}

const styles = theme => ({
    pageContentWrapper: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        minHeight: '75vh',
        overflowX: 'auto',
    },

    pageContent: {
        padding: theme.spacing.unit * 3,
    },
});

export default withStyles(styles)(Create);
