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

import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';

import MomentUtils from '@date-io/moment';

const FilterValueInput = props => {
    const inputProps = {
        name: 'filterValue',
        id: 'filterValue',
        label: Lang.get('table.filter_value_label'),
        variant: 'outlined',
    };

    if (props.columntype === 'numeric') {
        return (
            <TextField
                type="number"
                {...inputProps}
                {...props}
                placeholder={Lang.get('table.numeric_value_placeholder')}
            />
        );
    } else if (props.columntype === 'date') {
        return (
            <MuiPickersUtilsProvider utils={MomentUtils}>
                <DatePicker
                    {...inputProps}
                    value={props.value}
                    onChange={date => props.set('filterValue', date)}
                    className={props.className}
                    variant="outlined"
                    format="YYYY-MM-DD"
                    keyboard
                    clearable
                    disableFuture
                />
            </MuiPickersUtilsProvider>
        );
    } else {
        return (
            <TextField
                {...inputProps}
                {...props}
                placeholder={Lang.get('table.string_value_placeholder')}
            />
        );
    }
};

let Filter = props => {
    const { classes, errors: formErrors, columns, onFilter } = props;
    const filterTypeSets = {
        numeric: [
            { label: Lang.get('table.eqs'), value: 'eqs' },
            { label: Lang.get('table.neqs'), value: 'neqs' },
            { label: Lang.get('table.gt'), value: 'gt' },
            { label: Lang.get('table.lt'), value: 'lt' },
            { label: Lang.get('table.gte'), value: 'gte' },
            { label: Lang.get('table.lte'), value: 'lte' },
        ],

        boolean: [
            { label: Lang.get('table.eqs'), value: 'eqs' },
            { label: Lang.get('table.neqs'), value: 'neqs' },
        ],

        date: [
            { label: Lang.get('table.eqs'), value: 'eqs' },
            { label: Lang.get('table.neqs'), value: 'neqs' },
            { label: Lang.get('table.gt'), value: 'gt' },
            { label: Lang.get('table.lt'), value: 'lt' },
            { label: Lang.get('table.gte'), value: 'gte' },
            { label: Lang.get('table.lte'), value: 'lte' },
        ],

        string: [
            { label: Lang.get('table.like'), value: 'like' },
            { label: Lang.get('table.nlike'), value: 'nlike' },
            { label: Lang.get('table.eqs'), value: 'eqs' },
            { label: Lang.get('table.neqs'), value: 'neqs' },
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
            onSubmit={(values, form) => {
                // Format values specially the object ones (i.e Moment)
                let mappedValues = {};
                let valuesArray = Object.values(values);

                Object.keys(values).forEach((filter, key) => {
                    if (
                        typeof valuesArray[key] === 'object' &&
                        valuesArray[key].hasOwnProperty('_isAMomentObject')
                    ) {
                        mappedValues[filter] = moment(valuesArray[key]).format(
                            'YYYY-MM-DD',
                        );

                        return;
                    }

                    mappedValues[filter] = valuesArray[key];
                });

                onFilter(mappedValues, form);
            }}
            validationSchema={Yup.object().shape({
                filterBy: Yup.string().required('You must select a column.'),
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
                            <InputLabel htmlFor="filterBy">
                                {Lang.get('table.filter_by_label')}
                            </InputLabel>

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
                                    {Lang.get('table.filter_type_label')}
                                </InputLabel>

                                <Select
                                    value={values.filterType}
                                    onChange={event => {
                                        if (
                                            getColumnType(values.filterBy) ===
                                            'date'
                                        ) {
                                            setFieldValue(
                                                'filterValue',
                                                moment().format('YYYY-MM-DD'),
                                            );
                                        } else {
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
                                {...(getColumnType(values.filterBy) === 'date'
                                    ? { set: setFieldValue }
                                    : {})}
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
                                {Lang.get('table.add_filter')}
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
            minWidth: 200,
        },
    }),
    { withTheme: true },
)(Filter);

Filter = withFormik({})(Filter);

export default Filter;
