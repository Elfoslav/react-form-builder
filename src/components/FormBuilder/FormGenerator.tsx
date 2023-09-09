import React, { FC, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import FormField from './FormField';
import './FormGenerator.scss';

interface FieldConfig {
  label: string;
  type: string;
  name: string;
}

interface FormGeneratorProps {
  fields: FieldConfig[];
  onSubmit: (formData: Record<string, any>) => void;
}

const FormGenerator: FC<FormGeneratorProps> = ({ fields, onSubmit }) => {
  const initialFormState: Record<string, any> = {};
  fields.forEach(field => {
    initialFormState[field.name] = '';
  });

  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (name: string, value: any) => {
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Form onSubmit={handleSubmit} className="form">
      {fields.map((field, index) => (
        <FormField
          key={index}
          label={field.label}
          type={field.type}
          name={field.name}
          value={formData[field.name]}
          onChange={handleChange}
        />
      ))}

      <div className="mt-3">
        <Button type="submit">Submit</Button>
      </div>
    </Form>
  );
};

export default FormGenerator;
