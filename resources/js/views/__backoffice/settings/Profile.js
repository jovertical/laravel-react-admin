import React, { useState, useEffect, useContext } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import {
    Button,
    CircularProgress,
    FormControl,
    FormHelperText,
    Grid,
    Hidden,
    Input,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
    withStyles,
} from '@material-ui/core';

import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';

import * as UrlUtils from '../../../helpers/URL';
import {
    Clean as CleanLayout,
    Settings as SettingsLayout,
    Slave as SlaveLayout,
} from '../layouts';
import { AppContext } from '../../../AppContext';

function Profile(props) {
    const { user } = useContext(AppContext);
    const { classes, ...other } = props;
    const { location } = props;

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({});
    const [formVisible, setFormVisibility] = useState(false);

    /**
     * Handle form submit, this should send an API response
     * to update the profile.
     *
     * @param {object} values
     * @param {object} form
     *
     * @return {undefined}
     */
    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        setSubmitting(false);

        const updateProfile = () =>
            axios.patch('/api/v1/settings/profile', values);

        try {
            setLoading(true);

            await updateProfile();

            setMessage({
                type: 'success',
                body: Lang.get('settings.profile_updated'),
                closed: () => setMessage({}),
            });

            setLoading(false);
        } catch (error) {
            if (!error.response) {
                return;
            }

            const { errors } = error.response.data;

            if (errors) {
                setErrors(errors);
            } else {
                setMessage({
                    type: 'error',
                    body: Lang.get('settings.profile_not_updated'),
                    closed: () => setMessage({}),
                    actionText: Lang.get('actions.retry'),
                    action: async () => await updateProfile(),
                });
            }

            setLoading(false);
        }
    };

    useEffect(() => {
        const queryParams = UrlUtils.queryParams(location.search);

        if (queryParams.hasOwnProperty('visible')) {
            setFormVisibility(true);
        } else if (queryParams.hasOwnProperty('hidden')) {
            setFormVisibility(false);
        }
    });

    const renderForm = (
        <Grid item md={8} sm={12} xs={12}>
            <Paper className={classes.form}>
                <Formik
                    initialValues={{
                        firstname: user.firstname,
                        middlename: user.middlename,
                        lastname: user.lastname,

                        gender: user.gender,
                        birthdate: user.birthdate,
                        address: user.address,
                    }}
                    validationSchema={Yup.object().shape({
                        firstname: Yup.string().required(
                            Lang.get('validation.required', {
                                attribute: 'firstname',
                            }),
                        ),

                        lastname: Yup.string().required(
                            Lang.get('validation.required', {
                                attribute: 'lastname',
                            }),
                        ),
                    })}
                    onSubmit={async (values, form) => {
                        let mappedValues = {};
                        let valuesArray = Object.values(values);

                        // Format values specially the object ones (i.e Moment)
                        Object.keys(values).forEach((filter, key) => {
                            if (
                                valuesArray[key] !== null &&
                                typeof valuesArray[key] === 'object' &&
                                valuesArray[key].hasOwnProperty(
                                    '_isAMomentObject',
                                )
                            ) {
                                mappedValues[filter] = moment(
                                    valuesArray[key],
                                ).format('YYYY-MM-DD');

                                return;
                            }

                            mappedValues[filter] = valuesArray[key];
                        });

                        await handleSubmit(mappedValues, form);
                    }}
                    validateOnBlur={false}
                >
                    {({
                        values,
                        errors,
                        submitCount,
                        isSubmitting,
                        handleChange,
                        setFieldValue,
                    }) => (
                        <Form>
                            <Typography variant="h6" gutterBottom>
                                Personal Information
                            </Typography>

                            <TextField
                                id="firstname"
                                name="firstname"
                                label="First Name"
                                placeholder="Enter your firstname"
                                value={values.firstname}
                                onChange={handleChange}
                                fullWidth
                                margin="dense"
                                error={
                                    submitCount > 0 &&
                                    errors.hasOwnProperty('firstname')
                                }
                                helperText={
                                    submitCount > 0 &&
                                    errors.hasOwnProperty('firstname') &&
                                    errors.firstname
                                }
                            />

                            <TextField
                                id="middlename"
                                name="middlename"
                                label="Middle Name"
                                placeholder="Enter your middlename"
                                value={values.middlename}
                                onChange={handleChange}
                                fullWidth
                                margin="dense"
                                error={
                                    submitCount > 0 &&
                                    errors.hasOwnProperty('middlename')
                                }
                                helperText={
                                    submitCount > 0 &&
                                    errors.hasOwnProperty('middlename') &&
                                    errors.middlename
                                }
                            />

                            <TextField
                                id="lastname"
                                name="lastname"
                                label="Last Name"
                                placeholder="Enter your lastname"
                                value={values.lastname}
                                onChange={handleChange}
                                fullWidth
                                margin="dense"
                                error={
                                    submitCount > 0 &&
                                    errors.hasOwnProperty('lastname')
                                }
                                helperText={
                                    submitCount > 0 &&
                                    errors.hasOwnProperty('lastname') &&
                                    errors.lastname
                                }
                            />

                            <FormControl
                                fullWidth
                                margin="dense"
                                error={
                                    submitCount > 0 &&
                                    errors.hasOwnProperty('gender')
                                }
                            >
                                <InputLabel htmlFor="gender">Gender</InputLabel>

                                <Select
                                    id="gender"
                                    name="gender"
                                    value={values.gender}
                                    onChange={handleChange}
                                    input={<Input fullWidth />}
                                    autoWidth
                                >
                                    <MenuItem value="">
                                        Please select the gender
                                    </MenuItem>

                                    <MenuItem value="female">Female</MenuItem>

                                    <MenuItem value="male">Male</MenuItem>
                                </Select>

                                {submitCount > 0 &&
                                    errors.hasOwnProperty('gender') && (
                                        <FormHelperText>
                                            {errors.gender}
                                        </FormHelperText>
                                    )}
                            </FormControl>

                            <FormControl
                                fullWidth
                                margin="dense"
                                error={
                                    submitCount > 0 &&
                                    errors.hasOwnProperty('birthdate')
                                }
                            >
                                <MuiPickersUtilsProvider utils={MomentUtils}>
                                    <DatePicker
                                        id="birthdate"
                                        name="birthdate"
                                        label="Birthdate"
                                        placeholder="Please pick your birthdate"
                                        value={values.birthdate}
                                        onChange={date =>
                                            setFieldValue('birthdate', date)
                                        }
                                        format="YYYY-MM-DD"
                                        maxDate={moment()
                                            .subtract(10, 'y')
                                            .subtract(1, 'd')
                                            .format('YYYY-MM-DD')}
                                        keyboard
                                        clearable
                                        disableFuture
                                    />
                                </MuiPickersUtilsProvider>

                                {submitCount > 0 &&
                                    errors.hasOwnProperty('birthdate') && (
                                        <FormHelperText>
                                            {errors.birthdate}
                                        </FormHelperText>
                                    )}
                            </FormControl>

                            <TextField
                                id="address"
                                name="address"
                                label="Address"
                                placeholder="Enter your address"
                                value={values.address}
                                onChange={handleChange}
                                fullWidth
                                multiline
                                rows={3}
                                margin="dense"
                                error={
                                    submitCount > 0 &&
                                    errors.hasOwnProperty('address')
                                }
                                helperText={
                                    submitCount > 0 &&
                                    errors.hasOwnProperty('address') &&
                                    errors.address
                                }
                            />

                            <div className={classes.dense} />

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={
                                    (errors &&
                                        Object.keys(errors).length > 0 &&
                                        submitCount > 0) ||
                                    isSubmitting
                                }
                            >
                                {loading && (
                                    <div className={classes.spinner}>
                                        <CircularProgress
                                            size={14}
                                            color="inherit"
                                        />
                                    </div>
                                )}

                                <Typography color="inherit">Update</Typography>
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </Grid>
    );

    const renderBody = (
        <SettingsLayout
            navigationProps={{
                ...other,
                formVisible,
                setFormVisibility: () => setFormVisibility(!formVisible),
            }}
        >
            <Hidden mdUp>{formVisible && renderForm}</Hidden>

            <Hidden smDown>{renderForm}</Hidden>
        </SettingsLayout>
    );

    const Layout = formVisible ? SlaveLayout : CleanLayout;

    return (
        <Layout {...other} pageTitle="Profile" message={message}>
            {renderBody}
        </Layout>
    );
}

const styles = theme => ({
    form: {
        padding: theme.spacing.unit * 3,
        minHeight: '100%',
    },

    dense: {
        marginTop: 16,
    },

    spinner: {
        marginRight: theme.spacing.unit,
    },
});

export default withStyles(styles)(Profile);
