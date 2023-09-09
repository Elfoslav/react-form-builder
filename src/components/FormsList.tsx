import React, { useState, useEffect } from 'react';
import { Card, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import FormService from '../lib/FormService';
import { Pencil, PlusCircle, TrashFill } from 'react-bootstrap-icons';
import FormModal from '../components/FormBuilder/FormModal';
import { FormProps, FormValues } from '../lib/types';

function FormsList() {
  const [forms, setForms] = useState(FormService.getAllForms());
  const [isOpenFormModal, setIsOpenFormModal] = useState(false);
  const [formToEdit, setFormToEdit] = useState<FormProps | undefined>();

  const addForm = () => {
    setFormToEdit(undefined);
    setIsOpenFormModal(true);
  };

  const editForm = (form: FormProps) => {
    setIsOpenFormModal(true);
    setFormToEdit(form);
  };

  const onFormModalconfirm = (formData: FormValues) => {
    if (formData?.id) {
      FormService.updateForm(formData.id, formData as FormProps);
    } else if (formData) {
      FormService.createForm(formData as FormProps);
    }
    loadForms();
    onFormModalClose();
  };

  const onFormModalClose = () => {
    setIsOpenFormModal(false);
  };

  const deleteForm = (id?: string) => {
    if (id) {
      FormService.deleteForm(id);
      loadForms();
    }
  };

  const loadForms = () => {
    setForms(FormService.getAllForms());
  };

  useEffect(() => {
    loadForms();
  }, []);

  return (
    <>
      <Container>
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="page-title">Forms</h1>
          <Button className="me-1" onClick={addForm}>
            <PlusCircle size={20} />
          </Button>
        </div>
      </Container>
      {!forms.length && (
        <Container>No forms. Create one!</Container>
      )}
      {forms.map((form) => (
        <Card key={form.id} className="mb-3">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <Card.Title>
                <Link to={`/forms/edit/${form.id}`}>{form.name}</Link>
              </Card.Title>
              <div>
                <Button variant="warning" onClick={() => editForm(form)}>
                  <Pencil size={18} />
                </Button>
                <Button
                variant="danger"
                  className="ms-2"
                  title="Delete"
                  onClick={() => deleteForm(form.id)}
                >
                  <TrashFill />
                </Button>
              </div>
            </div>
            <Card.Text>
              Form ID: {form.id}
              {/* You can add more details about the form here */}
            </Card.Text>
            <Button variant="primary" href={`/forms/edit/${form.id}`}>
              Edit Fields
            </Button>
            {form.fields?.length ?
              <Button variant="outline-primary" className="ms-2" href={`/forms/test/${form.id}`}>
                Test
              </Button>
            : null}
          </Card.Body>
        </Card>
      ))}

      <FormModal
        isOpen={isOpenFormModal}
        formData={formToEdit}
        onClose={onFormModalClose}
        onConfirm={onFormModalconfirm}
      />
    </>
  );
}

export default FormsList;
