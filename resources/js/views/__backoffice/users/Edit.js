import React, { Component } from 'react';

import {
    CircularProgress,
    Grid,
    Paper,
    Step,
    StepLabel,
    Stepper,
    Typography,
    withStyles,
} from '@material-ui/core';

import * as UrlUtils from '../../../utils/URL';
import * as NavigationUtils from '../../../utils/Navigation';
import { User } from '../../../models';
import { LinearIndeterminate } from '../../../ui/Loaders';
import { Master as MasterLayout } from '../layouts';

import { Profile, Account, Avatar } from './Forms';

class Edit extends Component {
    state = {
        loading: false,
        activeStep: 0,
        formValues: [],
        user: {},
        message: {},
    };

    /**
     * Fetch the user.
     *
     * @param {number} id
     *
     * @return {undefined}
     */
    fetchUser = async id => {
        this.setState({ loading: true });

        const user = await User.show(id);

        this.setState({
            loading: false,
            user,
        });
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
            const { activeStep, formValues, user } = this.state;
            let previousValues = {};

            // Merge the form values here.
            if (activeStep === 1) {
                previousValues = formValues.reduce((prev, next) => {
                    return { ...prev, ...next };
                });
            }

            // Instruct the API the current step.
            values.step = activeStep;

            const updatedUser = await User.update(user.id, {
                ...previousValues,
                ...values,
            });

            // After persisting the previous values. Move to the next step...
            this.setState(prevState => {
                let formValues = [...prevState.formValues];
                formValues[prevState.activeStep] = values;

                let message = {};

                if (prevState.activeStep === 1) {
                    message = {
                        type: 'success',
                        body: Lang.get('resources.updated', {
                            name: 'User',
                        }),
                        closed: () => this.setState({ message: {} }),
                    };
                }

                return {
                    loading: false,
                    formValues,
                    user: updatedUser,
                    message,
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

    async componentDidMount() {
        const { params } = this.props.match;
        const { location } = this.props;

        const queryParams = UrlUtils._queryParams(location.search);

        if (queryParams.hasOwnProperty('step')) {
            this.setState({ activeStep: parseInt(queryParams.step) });
        }

        await this.fetchUser(params.id);
    }

    render() {
        const { classes, ...other } = this.props;
        const { loading, activeStep, formValues, user, message } = this.state;

        const steps = ['Profile', 'Account', 'Avatar'];

        const renderLoading = (
            <Grid
                container
                className={classes.loadingContainer}
                justify="center"
                alignItems="center"
            >
                <Grid item>
                    <CircularProgress color="primary" />
                </Grid>
            </Grid>
        );

        const renderForm = () => {
            if (loading) {
                return renderLoading;
            }

            switch (activeStep) {
                case 0:
                    const defaultValues = {
                        firstname:
                            user.firstname === null ? '' : user.firstname,
                        middlename:
                            user.middlename === null ? '' : user.middlename,
                        lastname: user.lastname === null ? '' : user.lastname,
                        gender: user.gender === null ? '' : user.gender,
                        birthdate: user.birthdate,
                        address: user.address === null ? '' : user.address,
                    };

                    return (
                        <Profile
                            {...other}
                            values={
                                formValues[0] ? formValues[0] : defaultValues
                            }
                            handleSubmit={this.handleSubmit}
                        />
                    );
                    break;

                case 1:
                    return (
                        <Account
                            {...other}
                            values={{
                                type: user.type === null ? '' : user.type,
                                email: user.email === null ? '' : user.email,
                                username:
                                    user.username === null ? '' : user.username,
                            }}
                            handleSubmit={this.handleSubmit}
                            handleBack={this.handleBack}
                        />
                    );
                    break;

                case 2:
                    return (
                        <Avatar
                            {...other}
                            user={user}
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
                pageTitle="Edit user"
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
                                User Modification
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

    loadingContainer: {
        minHeight: 200,
    },
});

export default withStyles(styles)(Edit);
