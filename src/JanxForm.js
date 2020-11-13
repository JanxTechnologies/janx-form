import React, { forwardRef, useRef, useCallback, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import JanxFormContext from './components/JanxFormContext';

const JanxForm = forwardRef(
  ({
    children,
    className,
    defaultValues,
    onSubmit,
    skipValidationOnSubmit,
    commonFieldsClassName
  }, ref) => {

    const values = useRef(defaultValues || {});
    const fields = useRef([]);
    const errors = useRef({});
    const touched = useRef({});

    const setTouched = tch => {
      touched.current = tch;
      // console.log(tch)
    };

    const setFieldTouched = (fieldName, tch) => {
      setTouched({
        ...touched.current,
        [fieldName]: tch
      });
    }

    const getFieldTouched = fieldName => touched.current[fieldName];

    const setErrors = errs => {
      errors.current = errs;
      // console.log(errs)
    };

    const setFieldErrors = (fieldName, errs) => {

      if (errs.length === 0) {

        const newErrs = errors.current;

        delete newErrs[fieldName];

        setErrors(
          newErrs
        );
      } else {
        setErrors({
          ...errors.current,
          [fieldName]: errs
        });
      }

    }

    const getFieldErrors = fieldName => errors.current[fieldName];

    const errorsLength = () => Object.keys(errors.current).length;

    const setValues = v => {
      values.current = v;
      // console.log(v)
    };

    const setFieldValue = (fieldName, value) => {
      setValues({
        ...values.current,
        [fieldName]: value
      });
    }

    const getFieldValue = fieldName => values.current[fieldName];

    const setFields = f => {
      fields.current = f;
      // console.log(f)
    };

    const registerField = useCallback((field) => {
      setFields([
        ...fields.current,
        field
      ]);

      // if (!getFieldValue(field.name) && field.defaultControlValue) {
      //   setFieldValue(field.name, field.defaultControlValue);
      // }
    }, [fields]);

    const unregisterField = useCallback((name) => {
      setFields(fields.current.filter(f => f.name !== name));
    }, [fields]);

    const getField = fieldName => fields.current.find(f => f.name === fieldName);

    const validateForm = useCallback(() => new Promise((resolve, reject) => {

      Object.keys(fields.current).forEach(key => {

        if (fields.current[key]) {

          fields.current[key].ref && fields.current[key].ref.validate && fields.current[key].ref.validate();
        }
      });

      setTimeout(() => {
        resolve(errorsLength() === 0)
      }, 10);
    }), []);

    const setData = useCallback(data => {
      Object.keys(data).forEach(fieldName => {

        const field = getField(fieldName);

        if (field) {

          field.ref && field.ref.setValue && field.ref.setValue(data[fieldName]);
        }
      });
    }, []);

    const clearForm = useCallback(() => {

      Object.keys(fields.current).forEach(key => {

        if (fields.current[key]) {

          fields.current[key].ref && fields.current[key].ref.clearValue && fields.current[key].ref.clearValue();
        }
      });

    }, []);

    const handleSubmit = useCallback(async (ev) => {
      if (ev) {
        ev.preventDefault();
      }

      if (skipValidationOnSubmit) {
        onSubmit(values.current, { touched: touched.current, errors: errors.current, isValid: errorsLength() === 0 });
      } else {
        validateForm().then(isValid => {

          if (isValid) {
            onSubmit(values.current, { touched: touched.current, errors: errors.current, isValid });
          } else {

            const fieldsErrs = Object.keys(errors.current).reverse();

            fieldsErrs.forEach(fieldName => {

              const field = getField(fieldName);

              if (field) {
                field.ref && field.ref.setFocus && field.ref.setFocus();
              }

            })
          }

        });
      }
    }, [skipValidationOnSubmit, onSubmit, validateForm]);

    useImperativeHandle(ref, () => ({

      getField() {
        return getField()
      },

      setData(data) {
        setData(data)
      },

      getValues() {
        return values.current;
      },

      clearForm() {
        clearForm()
      },

      submitForm() {
        handleSubmit();
      },

      setFieldValue(fieldName, value) {

        const field = getField(fieldName);

        if (field) {
          field.ref && field.ref.setValue && field.ref.setValue(value);
        }
      },

      // getFieldValue,
      // setFieldErrors,
      // getFieldErrors,
      // setFieldTouched,
      // getFieldTouched,
      // getField,

    }));

    return (
      <JanxFormContext.Provider
        value={{
          registerField,
          unregisterField,
          setValues,
          setFieldValue,
          getFieldValue,
          setFieldErrors,
          getFieldErrors,
          setFieldTouched,
          getFieldTouched,
          getField,
          commonFieldsClassName
        }}
      >
        <form className={className} onSubmit={handleSubmit}>
          {children}
        </form>
      </JanxFormContext.Provider>
    )
  }
);

JanxForm.propTypes = {
  className: PropTypes.string,
  commonFieldsClassName: PropTypes.string,
  defaultValues: PropTypes.object,
  children: PropTypes.any,
  onSubmit: PropTypes.func,
  skipValidationOnSubmit: PropTypes.bool
};

export default JanxForm;