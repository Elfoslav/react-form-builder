import React, { FC } from 'react';
import { Form, FormGroup, FormControl, FormLabel } from 'react-bootstrap';
import { FormFieldProps } from '../../lib/types';
import { FieldError, FieldErrors, useFormContext, UseFormRegisterReturn } from 'react-hook-form';
import { FORM_VALIDATIONS } from '../../lib/consts';

interface Props extends FormFieldProps {
  register?: UseFormRegisterReturn;
}

interface CustomFieldError extends FieldError {
  contains: string;
  startsWith: string;
}

interface ValidationOptions {
  required?: string;
  min?: {
    value: number;
    message: string;
  };
  max?: {
    value: number;
    message: string;
  };
  validate?: {
    [key: string]: (value: string) => boolean | string;
  };
}

const FormField: FC<Props> = ({
  label,
  type,
  name,
  value,
  options,
  validations,
  onChange,
}: Props) => {

  const {
    register,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<FormFieldProps>();

  let validationOptions: ValidationOptions = { validate: {} };

  validations?.forEach((validation) => {
    if (validation.name === FORM_VALIDATIONS.REQUIRED) {
      validationOptions['required'] = validation.message || `${label} is required`;
    }

    if (validation.name === FORM_VALIDATIONS.CONTAINS && validation.value) {
      validationOptions.validate!['contains'] = (value: string) => {
        return value.includes(validation.value as string) || `${label} does not contain ${validation.value}`;
      }
    }

    if (validation.name === FORM_VALIDATIONS.STARTS_WITH && validation.value) {
      validationOptions.validate!['startsWith'] = (value: string) => {
        return value.startsWith(validation.value as string) || `${label} does not start with ${validation.value}`; ;
      }
    }

    if (validation.name === FORM_VALIDATIONS.NUMBER_BETWEEN && validation.min) {
      validationOptions['min'] = {
        value: validation.min,
        message: `Minimum is ${validation.min}`,
      };
    }

    if (validation.name === FORM_VALIDATIONS.NUMBER_BETWEEN && validation.max) {
      validationOptions['max'] = {
        value: validation.max,
        message: `Maximum is ${validation.max}`,
      };
    }
  });

  const registerInput = register(name as keyof FormFieldProps, validationOptions);
  const errorsTyped = errors as FieldErrors<FormFieldProps> & {
    [name: string]: CustomFieldError;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setValue(name as keyof FormFieldProps, newValue);
    trigger(name as keyof FormFieldProps);
    if (onChange) {
      onChange(name, newValue);
    }
  };

  const renderInput = () => {
    if (type === 'textarea') {
      return (
        <FormControl
          as="textarea"
          defaultValue={value}
          {...registerInput}
          onChange={handleChange}
        />
      );
    }

    if (type === 'checkbox') {
      return (
        <Form.Check
          id={name}
          type="checkbox"
          checked={value}
          label={label}
          {...registerInput}
          onChange={handleChange}
        />
      );
    }

    if (type === 'number') {
      return (
        <FormControl
          type="number"
          defaultValue={value}
          {...registerInput}
          onChange={handleChange}
        />
      );
    }

    if (type === 'select') {
      return (
        <FormControl
          as="select"
          value={value}
          {...registerInput}
          onChange={handleChange}
        >
          {options && options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </FormControl>
      );
    }

    return (
      <FormControl
        type="text"
        defaultValue={value}
        {...registerInput}
        onChange={handleChange}
      />
    );
  };

  return (
    <FormGroup className="mb-2 w-100">
      {type !== 'checkbox' ? <FormLabel>{label}</FormLabel> : null}
      {renderInput()}
      {errorsTyped[name] && (
        <div className="text-danger">{(errorsTyped[name])?.message}</div>
      )}
    </FormGroup>
  );
};

export default FormField;
