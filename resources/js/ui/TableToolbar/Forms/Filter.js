import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, withFormik } from 'formik';
import * as Yup from 'yup';

import {
    Button,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
    withStyles,
} from '@material-ui/core';

const FilterValueInput = props => {
    const inputProps = {
        name: 'filterValue',
        id: 'filterValue',
        label: 'Value',
        variant: 'outlined',
    };

    if (props.columntype === 'numeric') {
        return <TextField type="number" {...inputProps} {...props} />;
    } else {
        return <TextField {...inputProps} {...props} />;
    }
};

let Filter = props => {
    const { classes, setErrors, errors: formErrors, columns, onFilter } = props;
    const filterTypeSets = {
        numeric: [
            { label: 'Is equal to', value: 'eqs' },
            { label: 'Is not equal to', value: 'neqs' },
            { label: 'Greater than', value: 'gt' },
            { label: 'Less than', value: 'lt' },
            { label: 'Greater than equals to', value: 'gte' },
            { label: 'Less than equals to', value: 'lte' },
        ],

        boolean: [
            { label: 'Is equal to', value: 'eqs' },
            { label: 'Is not equal to', value: 'neqs' },
        ],

        string: [
            { label: 'Contains', value: 'like' },
            { label: 'Does not contain', value: 'nlike' },
            { label: 'Is equal to', value: 'eqs' },
            { label: 'Is not equal to', value: 'neqs' },
        ],
    };

    const getColumnType = filterBy => {
        const column = columns.find(column => column.property === filterBy);

        if (column && !column.hasOwnProperty('type')) {
            return 'string';
        }

        return column.type;
    };

    return (
        <Formik
            initialValues={{
                filterBy: '',
                filterType: '',
                filterValue: '',
            }}
            onSubmit={onFilter}
            validate={values => {
                setErrors({});
            }}
            validationSchema={Yup.object().shape({
                filterBy: Yup.string().required(),
            })}
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
                    <Form className={classes.form}>
                        <FormControl
                            variant="outlined"
                            className={classes.input}
                            error={errors.hasOwnProperty('filterBy')}
                        >
                            <InputLabel htmlFor="filterBy">Column</InputLabel>

                            <Select
                                value={values.filterBy}
                                onChange={event => {
                                    if (values.filterBy) {
                                        setFieldValue('filterType', '');
                                    }

                                    handleChange(event);
                                }}
                                name="filterBy"
                                id="filterBy"
                                input={<OutlinedInput labelWidth={55} />}
                            >
                                {columns.map((column, key) => (
                                    <MenuItem key={key} value={column.property}>
                                        {column.name}
                                    </MenuItem>
                                ))}
                            </Select>

                            {errors.hasOwnProperty('filterBy') && (
                                <FormHelperText>
                                    {errors.filterBy}
                                </FormHelperText>
                            )}
                        </FormControl>

                        {values.filterBy && (
                            <FormControl
                                variant="outlined"
                                className={classes.input}
                                error={errors.hasOwnProperty('filterType')}
                            >
                                <InputLabel htmlFor="filterType">
                                    Condition
                                </InputLabel>

                                <Select
                                    value={values.filterType}
                                    onChange={event => {
                                        if (values.filterType) {
                                            setFieldValue('filterValue', '');
                                        }

                                        handleChange(event);
                                    }}
                                    name="filterType"
                                    id="filterType"
                                    input={<OutlinedInput labelWidth={65} />}
                                >
                                    {filterTypeSets[
                                        getColumnType(values.filterBy)
                                    ].map((type, key) => (
                                        <MenuItem key={key} value={type.value}>
                                            {type.label}
                                        </MenuItem>
                                    ))}
                                </Select>

                                {errors.hasOwnProperty('filterType') && (
                                    <FormHelperText>
                                        {errors.filterType}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        )}

                        {values.filterBy && values.filterType && (
                            <FilterValueInput
                                columntype={getColumnType(values.filterBy)}
                                className={classes.input}
                                value={values.filterValue}
                                onChange={handleChange}
                                error={errors.hasOwnProperty('filterValue')}
                                helperText={
                                    errors.hasOwnProperty('filterValue') &&
                                    errors.filterValue
                                }
                            />
                        )}

                        <FormControl className={classes.input}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={
                                    (errors &&
                                        Object.keys(errors).length > 0) ||
                                    isSubmitting
                                }
                            >
                                Add Filter
                            </Button>
                        </FormControl>
                    </Form>
                );
            }}
        </Formik>
    );
};

Filter.propTypes = {
    classes: PropTypes.object,
    errors: PropTypes.object,
    setErrors: PropTypes.func,
    columns: PropTypes.array.isRequired,
    onFilter: PropTypes.func,
};

Filter = withStyles(
    theme => ({
        form: {
            display: 'flex',
            flexWrap: 'wrap',
        },

        input: {
            margin: theme.spacing.unit,
            minWidth: '12.5rem',
        },
    }),
    { withTheme: true },
)(Filter);

Filter = withFormik({})(Filter);

export { Filter };
