import React, { useState } from 'react';

import {
    Paper,
    Step,
    StepLabel,
    Stepper,
    Typography,
    withStyles,
} from '@material-ui/core';

import * as NavigationUtils from '../../../helpers/Navigation';
import { User } from '../../../models';
import { LinearIndeterminate } from '../../../ui/Loaders';
import { Master as MasterLayout } from '../layouts';

import { Profile, Account, Avatar } from './Forms';

function Create(props) {
    const [loading, setLoading] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [formValues, setFormValues] = useState([]);
    const [user, setUser] = useState({});
    const [message, setMessage] = useState({});

    /**
     * This should return back to the previous step.
     *
     * @return {undefined}
     */
    const handleBack = () => {
        setActiveStep(activeStep - 1);
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
    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        setSubmitting(false);

        // Stop here as it is the last step...
        if (activeStep === 2) {
            return;
        }

        setLoading(true);

        try {
            let previousValues = {};

            // Merge the form values here.
            if (activeStep === 1) {
                previousValues = formValues.reduce((prev, next) => {
                    return { ...prev, ...next };
                });
            }

            // Instruct the API the current step.
            values.step = activeStep;

            const user = await User.store({ ...previousValues, ...values });

            // After persisting the previous values. Move to the next step...
            let newFormValues = [...formValues];
            newFormValues[activeStep] = values;

            if (activeStep === 1) {
                setMessage({
                    type: 'success',
                    body: Lang.get('resources.created', {
                        name: 'User',
                    }),
                    closed: () => setMessage({}),
                });
            }

            setLoading(false);
            setFormValues(newFormValues);
            setUser(user);
            setActiveStep(activeStep + 1);
        } catch (error) {
            if (!error.response) {
                throw new Error('Unknown error');
            }

            const { errors } = error.response.data;

            setErrors(errors);

            setLoading(false);
        }
    };

    const { classes, ...other } = props;
    const { history } = props;

    const steps = ['Profile', 'Account', 'Avatar'];

    const renderForm = () => {
        const defaultProfileValues = {
            firstname: '',
            middlename: '',
            lastname: '',
            gender: '',
            birthdate: null,
            address: '',
        };

        switch (activeStep) {
            case 0:
                return (
                    <Profile
                        {...other}
                        values={
                            formValues[0] ? formValues[0] : defaultProfileValues
                        }
                        handleSubmit={handleSubmit}
                    />
                );

            case 1:
                return (
                    <Account
                        {...other}
                        values={{
                            type: '',
                            email: '',
                            username: '',
                        }}
                        handleSubmit={handleSubmit}
                        handleBack={handleBack}
                    />
                );

            case 2:
                return (
                    <Avatar
                        {...other}
                        user={user}
                        handleSkip={() =>
                            history.push(
                                NavigationUtils.route(
                                    'backoffice.resources.users.index',
                                ),
                            )
                        }
                    />
                );

            default:
                throw new Error('Unknown step!');
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
