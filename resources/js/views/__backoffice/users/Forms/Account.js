import React from 'react';
import PropTypes from 'prop-types';
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
    Select,
    Typography,
    withStyles,
} from '@material-ui/core';

const Account = props => {
    const { classes, values, handleSubmit, handleBack } = props;

    return (
        <Formik
            initialValues={values}
            validationSchema={Yup.object().shape({
                email: Yup.string().required(
                    Lang.get('validation.required', {
                        attribute: 'email',
                    }),
                ),
            })}
            onSubmit={handleSubmit}
            validateOnBlur={false}
        >
            {({ values, handleChange, errors, submitCount, isSubmitting }) => (
                <Form>
                    <Typography variant="h6" gutterBottom>
                        Account Settings
                    </Typography>

                    <Grid container spacing={24}>
                        <Grid item xs={12} sm={12}>
                            <FormControl
                                className={classes.formControl}
                                error={
                                    submitCount > 0 &&
                                    errors.hasOwnProperty('type')
                                }
                            >
                                <InputLabel htmlFor="type">
                                    Type{' '}
                                    <span className={classes.required}>*</span>
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

                                    <MenuItem value="user">User</MenuItem>
                                </Select>

                                {submitCount > 0 &&
                                    errors.hasOwnProperty('type') && (
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
                                error={
                                    submitCount > 0 &&
                                    errors.hasOwnProperty('email')
                                }
                            >
                                <InputLabel htmlFor="email">
                                    Email{' '}
                                    <span className={classes.required}>*</span>
                                </InputLabel>

                                <Input
                                    id="email"
                                    name="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    fullWidth
                                />

                                {submitCount > 0 &&
                                    errors.hasOwnProperty('email') && (
                                        <FormHelperText>
                                            {errors.email}
                                        </FormHelperText>
                                    )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl
                                className={classes.formControl}
                                error={
                                    submitCount > 0 &&
                                    errors.hasOwnProperty('username')
                                }
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

                                {submitCount > 0 &&
                                    errors.hasOwnProperty('username') && (
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
                                onClick={handleBack}
                                className={classes.backButton}
                            >
                                Back
                            </Button>

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
                                Next
                            </Button>
                        </Grid>
                    </Grid>
                </Form>
            )}
        </Formik>
    );
};

Account.propTypes = {
    values: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
};

const styles = theme => ({
    sectionSpacer: {
        marginTop: theme.spacing.unit * 2,
    },

    formControl: {
        minWidth: '100%',
    },

    required: {
        color: theme.palette.error.main,
    },

    backButton: {
        marginRight: theme.spacing.unit,
    },
});

export default withStyles(styles)(Account);
