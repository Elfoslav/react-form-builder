import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { Button, Card } from 'react-bootstrap';
import FormField from '../FormBuilder/FormField';
import { FormFieldProps, FormProps, FormValues } from '../../lib/types';

interface FormTesterProps {
  form?: FormProps;
}

const FormTester: FC<FormTesterProps> = ({ form }) => {
  const navigate = useNavigate();
  const [formFields, setFormFields] = useState<FormFieldProps[]>(form?.fields || []);
  const [formFieldsValues, setFormFieldsValues] = useState<FormValues>({});
  const methods = useForm();
  const { handleSubmit } = methods;
  console.log(formFields);

  const onFieldChange = (name: string, value: any) => {
    setFormFields((prevFields) =>
      prevFields.map((field) =>
        field.name === name ? { ...field, value } : field
      )
    );
  };

  const onSubmit: SubmitHandler<FormValues> = (formData) => {
    // You can access form data here via the formData parameter.
    console.log('FormTester onSubmit', formData);
    setFormFieldsValues(formData);
  };

  return (
    <Card className="mt-3">
      <Card.Body>
        <Card.Title>
          {formFields.length === 0 ? (
            <span>The form has no fields.</span>
          ) : null}
        </Card.Title>

        <div className="d-flex gap-4">
          <FormProvider {...methods}>
            <form className="form" onSubmit={handleSubmit(onSubmit)}>
              {formFields.map((field, index) => (
                <div key={index} className="d-flex align-items-end">
                  <FormField {...field} onChange={onFieldChange} />
                </div>
              ))}

              {formFields.length ? (
                <div className="d-flex gap-2 align-items-end">
                  <Button type="button" className="mt-1" variant="secondary" onClick={() => navigate(-1)}>Back</Button>
                  <Button type="submit" className="flex-fill">Submit</Button>
                </div>
              ) : (
                <Button type="button" className="mt-1" variant="secondary" onClick={() => navigate(-1)}>&larr; Back</Button>
              )}
            </form>
          </FormProvider>

          {Object.keys(formFieldsValues).length}
          {Object.keys(formFieldsValues).length > 0 &&
            <div>
              <div className="fw-bold">Form Data</div>
              {Object.entries(formFieldsValues).map(([key, value], index) => (
                <div key={index}>
                  {key}:
                  {(typeof value === 'boolean') ? (value === true ? 'true' : 'false') : value}
                </div>
              ))}
            </div>
          }
        </div>
      </Card.Body>
    </Card>
  );
};

export default FormTester;
