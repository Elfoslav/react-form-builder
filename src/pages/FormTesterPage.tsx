import React from 'react';
import { useParams } from 'react-router-dom';
import FormService from '../lib/FormService';
import FormTester from '../components/FormTester/FormTester';

function FormPage() {
  const { id } = useParams();

  if (!id) {
    return <div>ID Required.</div>
  }

  const form = FormService.getFormById(id);

  if (!form) {
    return <div>Form not found.</div>
  }

  return (
    <div>
      <h1 className="page-title">Form Tester - {form.name}</h1>
      <FormTester form={form} />
    </div>
  );
}

export default FormPage;