import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

export interface Validation {
  name: string;
  value?: string;
  message?: string;
  min?: number;
  max?: number;
}

export interface FieldOption {
  label: string;
  value: any;
}

export interface FormValues {
  [key: string]: any;
}

export interface FormFieldProps {
  label: string;
  type: string;
  name: string;
  value?: any;
  options?: { label: string; value: string | number }[];
  errors?: { message: string }[];
  // [{ name: 'starts-with', value: 'abc' }, { name: 'number-between', value: '1-10'}]
  validations?: Validation[];
  register?: UseFormRegisterReturn;
  onChange?: (name: string, value: any) => void;
}

export interface FormProps {
  id?: string;
  name: string;
  fields: FormFieldProps[];
}