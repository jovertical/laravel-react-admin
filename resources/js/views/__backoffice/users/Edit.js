import React, { useState, useEffect } from 'react';

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

import * as UrlUtils from '../../../helpers/URL';
import * as NavigationUtils from '../../../helpers/Navigation';
import { User } from '../../../models';
import { LinearIndeterminate } from '../../../ui/Loaders';
import { Master as MasterLayout } from '../layouts';

import { Profile, Account, Avatar } from './Forms';

function Edit(props) {
    const [loading, setLoading] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [formValues, setFormValues] = useState([]);
    const [user, setUser] = useState({});
    const [message, setMessage] = useState({});

    /**
     * Fetch the user.
     *
     * @param {number} id
     *
     * @return {undefined}
     */
    const fetchUser = async id => {
        setLoading(true);

        try {
            const user = await User.show(id);

            setUser(user);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

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

            const updatedUser = await User.update(user.id, {
                ...previousValues,
                ...values,
            });

            // After persisting the previous values. Move to the next step...
            let newFormValues = [...formValues];
            newFormValues[activeStep] = values;

            if (activeStep === 1) {
                setMessage({
                    type: 'success',
                    body: Lang.get('resources.updated', {
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

    useEffect(() => {
        if (Object.keys(user).length > 0) {
            return;
        }

        const { params } = props.match;
        const { location } = props;

        const queryParams = UrlUtils.queryParams(location.search);

        if (queryParams.hasOwnProperty('step')) {
            setActiveStep(parseInt(queryParams.step));
        }

        fetchUser(params.id);
    });

    const { classes, ...other } = props;
    const { history } = props;

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

        const defaultProfileValues = {
            firstname: user.firstname === null ? '' : user.firstname,
            middlename: user.middlename === null ? '' : user.middlename,
            lastname: user.lastname === null ? '' : user.lastname,
            gender: user.gender === null ? '' : user.gender,
            birthdate: user.birthdate,
            address: user.address === null ? '' : user.address,
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
                            type: user.type === null ? '' : user.type,
                            email: user.email === null ? '' : user.email,
                            username:
                                user.username === null ? '' : user.username,
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
