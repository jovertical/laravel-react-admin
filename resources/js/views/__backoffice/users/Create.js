import React, { Component } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import {
    Button,
    FormControl,
    FormHelperText,
    Input,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Typography,
    withStyles,
} from '@material-ui/core';

import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';

import * as NavigationUtils from '../../../utils/Navigation';
import * as UrlUtils from '../../../utils/URL';
import { User } from '../../../models';
import { Master as MasterLayout } from '../layouts';

class Create extends Component {
    state = {
        loading: false,
        errors: {},
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

        this.setState({ loading: true });

        try {
            const { history } = this.props;

            await User.store(values);

            this.setState({ loading: false });

            const url = NavigationUtils._route('backoffice.users.index');
            const queryString = UrlUtils._queryString({
                '_message[type]': 'success',
                '_message[body]': Lang.get('resources.created', {
                    name: 'User',
                }),
            });

            history.push(`${url}${queryString}`);
        } catch (error) {
            if (!error.response) {
                throw new Error('Unknown error');
            }

            const { errors } = error.response.data;

            setErrors(errors);
        }
    };

    render() {
        const { classes, ...other } = this.props;
        const { errors: formErrors } = this.state;

        const renderForm = (
            <Formik
                initialValues={{
                    type: '',
                    firstname: '',
                    middlename: '',
                    lastname: '',
                    gender: '',
                    birthdate: null,
                    address: '',
                    email: '',
                    username: '',
                }}
                validationSchema={Yup.object().shape({
                    type: Yup.string().required(
                        Lang.get('validation.required', {
                            attribute: 'type',
                        }),
                    ),

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

                    email: Yup.string()
                        .required(
                            Lang.get('validation.required', {
                                attribute: 'email',
                            }),
                        )
                        .email(
                            Lang.get('validation.email', {
                                attribute: 'email',
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
                            valuesArray[key].hasOwnProperty('_isAMomentObject')
                        ) {
                            mappedValues[filter] = moment(
                                valuesArray[key],
                            ).format('YYYY-MM-DD');

                            return;
                        }

                        mappedValues[filter] = valuesArray[key];
                    });

                    await this.handleSubmit(mappedValues, form);
                }}
                validateOnBlur={false}
            >
                {({
                    values,
                    handleChange,
                    setFieldValue,
                    errors,
                    isSubmitting,
                }) => {
                    if (formErrors && Object.keys(formErrors).length > 0) {
                        errors = formErrors;
                    }

                    return (
                        <Form>
                            <Typography variant="h6" gutterBottom>
                                Personal Information
                            </Typography>

                            <Grid container spacing={24}>
                                <Grid item xs={12} sm={4}>
                                    <FormControl
                                        className={classes.formControl}
                                        error={errors.hasOwnProperty(
                                            'firstname',
                                        )}
                                    >
                                        <InputLabel htmlFor="firstname">
                                            Firstname *
                                        </InputLabel>

                                        <Input
                                            id="firstname"
                                            name="firstname"
                                            value={values.firstname}
                                            onChange={handleChange}
                                            fullWidth
                                        />

                                        {errors.hasOwnProperty('firstname') && (
                                            <FormHelperText>
                                                {errors.firstname}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <FormControl
                                        className={classes.formControl}
                                        error={errors.hasOwnProperty(
                                            'middlename',
                                        )}
                                    >
                                        <InputLabel htmlFor="middlename">
                                            Middlename
                                        </InputLabel>

                                        <Input
                                            id="middlename"
                                            name="middlename"
                                            value={values.middlename}
                                            onChange={handleChange}
                                            fullWidth
                                        />

                                        {errors.hasOwnProperty(
                                            'middlename',
                                        ) && (
                                            <FormHelperText>
                                                {errors.middlename}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <FormControl
                                        className={classes.formControl}
                                        error={errors.hasOwnProperty(
                                            'lastname',
                                        )}
                                    >
                                        <InputLabel htmlFor="lastname">
                                            Lastname *
                                        </InputLabel>

                                        <Input
                                            id="lastname"
                                            name="lastname"
                                            value={values.lastname}
                                            onChange={handleChange}
                                            fullWidth
                                        />

                                        {errors.hasOwnProperty('lastname') && (
                                            <FormHelperText>
                                                {errors.lastname}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Grid container spacing={24}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl
                                        className={classes.formControl}
                                        error={errors.hasOwnProperty('gender')}
                                    >
                                        <InputLabel htmlFor="gender">
                                            Gender
                                        </InputLabel>

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

                                            <MenuItem value="female">
                                                Female
                                            </MenuItem>

                                            <MenuItem value="male">
                                                Male
                                            </MenuItem>
                                        </Select>

                                        {errors.hasOwnProperty('gender') && (
                                            <FormHelperText>
                                                {errors.gender}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <FormControl
                                        className={classes.formControl}
                                        error={errors.hasOwnProperty(
                                            'birthdate',
                                        )}
                                    >
                                        <MuiPickersUtilsProvider
                                            utils={MomentUtils}
                                        >
                                            <DatePicker
                                                id="birthdate"
                                                name="birthdate"
                                                label="Birthdate"
                                                placeholder="Please pick the birthdate"
                                                value={values.birthdate}
                                                onChange={date =>
                                                    setFieldValue(
                                                        'birthdate',
                                                        date,
                                                    )
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

                                        {errors.hasOwnProperty('birthdate') && (
                                            <FormHelperText>
                                                {errors.birthdate}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Grid container spacing={24}>
                                <Grid item xs={12} sm={12}>
                                    <FormControl
                                        className={classes.formControl}
                                        error={errors.hasOwnProperty('address')}
                                    >
                                        <InputLabel htmlFor="address">
                                            Address
                                        </InputLabel>

                                        <Input
                                            id="address"
                                            name="address"
                                            value={values.address}
                                            onChange={handleChange}
                                            fullWidth
                                        />

                                        {errors.hasOwnProperty('address') && (
                                            <FormHelperText>
                                                {errors.address}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <div className={classes.sectionSpacer} />

                            <Typography variant="h6" gutterBottom>
                                Account Settings
                            </Typography>

                            <Grid container spacing={24}>
                                <Grid item xs={12} sm={12}>
                                    <FormControl
                                        className={classes.formControl}
                                        error={errors.hasOwnProperty('type')}
                                    >
                                        <InputLabel htmlFor="type">
                                            Type *
                                        </InputLabel>

                                        <Select
                                            id="type"
                                            name="type"
                                            value={values.type}
                                            onChange={handleChange}
                                            input={<Input fullWidth />}
                                            autoWidth
                                        >
                                            <MenuItem value="">
                                                Please select the user's type
                                            </MenuItem>

                                            <MenuItem value="superuser">
                                                Superuser
                                            </MenuItem>

                                            <MenuItem value="user">
                                                User
                                            </MenuItem>
                                        </Select>

                                        {errors.hasOwnProperty('type') && (
                                            <FormHelperText>
                                                {errors.type}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Grid container spacing={24}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl
                                        className={classes.formControl}
                                        error={errors.hasOwnProperty('email')}
                                    >
                                        <InputLabel htmlFor="email">
                                            Email *
                                        </InputLabel>

                                        <Input
                                            id="email"
                                            name="email"
                                            value={values.email}
                                            onChange={handleChange}
                                            fullWidth
                                        />

                                        {errors.hasOwnProperty('email') && (
                                            <FormHelperText>
                                                {errors.email}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <FormControl
                                        className={classes.formControl}
                                        error={errors.hasOwnProperty(
                                            'username',
                                        )}
                                    >
                                        <InputLabel htmlFor="username">
                                            Username
                                        </InputLabel>

                                        <Input
                                            id="username"
                                            name="username"
                                            value={values.username}
                                            onChange={handleChange}
                                            fullWidth
                                        />

                                        {errors.hasOwnProperty('username') && (
                                            <FormHelperText>
                                                {errors.username}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <div className={classes.sectionSpacer} />

                            <Grid container spacing={24} justify="flex-end">
                                <Grid item>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={
                                            (errors &&
                                                Object.keys(errors).length >
                                                    0) ||
                                            isSubmitting
                                        }
                                    >
                                        Save
                                    </Button>
                                </Grid>
                            </Grid>
                        </Form>
                    );
                }}
            </Formik>
        );

        return (
            <MasterLayout {...other} pageTitle="Create a user" tabs={[]}>
                <Paper className={classes.pageContentWrapper}>
                    <div className={classes.pageContent}>
                        <Typography
                            component="h1"
                            variant="h4"
                            align="center"
                            gutterBottom
                        >
                            User Creation
                        </Typography>

                        <div className={classes.sectionSpacer} />

                        {renderForm}
                    </div>
                </Paper>
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

    sectionSpacer: {
        marginTop: theme.spacing.unit * 2,
    },

    formControl: {
        minWidth: '100%',
    },
});

export default withStyles(styles)(Create);
