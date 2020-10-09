import { useContext } from 'react'
import JanxFormContext from '../components/JanxFormContext';

const useField = () => {

  const {
    registerField,
    unregisterField,
    setFieldValue,
    setValues,
    getFieldValue,
    setFieldErrors,
    getFieldErrors,
    setFieldTouched,
    getFieldTouched,
    getField,
    commonFieldsClassName,
  } = useContext(JanxFormContext);

  return {
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
    commonFieldsClassName,
  }
}

export default useField;