import React, { FC, useState, useRef } from 'react';
import { Button, FormControl, Toast, ToastContainer, Card } from 'react-bootstrap';
import { PencilFill, TrashFill } from 'react-bootstrap-icons';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import FormField from './FormField';
import { FormFieldProps, FormProps, FormValues } from '../../lib/types';
import './FormBuilder.scss';
import FormFieldDetailModal from './FormFieldDetailModal';
import { FORM_TYPES } from '../../lib/consts';
import FormService from '../../lib/FormService';
import { generateInputName } from '../../lib/functions';

interface FormBuilderProps {
  form?: FormProps;
}

const FormBuilder: FC<FormBuilderProps> = ({ form }) => {
  const [formFields, setFormFields] = useState<FormFieldProps[]>(form?.fields || []);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState(-1);
  const [labelInput, setLabelInput] = useState('');
  const labelForInputRef = useRef<HTMLInputElement>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isFormFieldDetailModalOpen, setIsFormFieldDetailModalOpen] = useState(false);
  const selectedField = selectedFieldIndex !== -1 ? formFields[selectedFieldIndex] : null;
  const methods = useForm();

  const addFormField = (type: string, label: string) => {
    if (!label.trim()) {
      labelForInputRef?.current?.focus();
      return alert('Fill in label!');
    }
    const newField: FormFieldProps = {
      label: label,
      type: type,
      name: generateInputName(label),
      value: '',
    };
    setFormFields((prevFields) => [...prevFields, newField]);
    setLabelInput('');
    unselectField();
  };

  const onFieldChange = (name: string, value: any) => {
    setFormFields((prevFields) =>
      prevFields.map((field) =>
        field.name === name ? { ...field, value } : field
      )
    );
  };

  const removeFormField = (name: string) => {
    setFormFields((prevFields) =>
      prevFields.filter((field) => field.name !== name)
    );
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setLabelInput(value);
  };

  const openFieldDetailModal = (field: FormFieldProps, index: number) => {
    setSelectedFieldIndex(index);
    setIsFormFieldDetailModalOpen(true);
  };

  const unselectField = () => {
    setSelectedFieldIndex(-1);
  };

  const onFormSubmit: SubmitHandler<FormValues> = () => {
    saveForm();
  };

  const saveForm = (_formFields?: FormFieldProps[]) => {
    if (form && form.id) {
      const formToUpdate = { ...form, fields: _formFields ? _formFields : formFields };
      console.log(formFields);
      FormService.updateForm(form.id, formToUpdate);
      showToastMessage('Form saved.');
    }
  };

  const onCloseFieldDetail = () => {
    setIsFormFieldDetailModalOpen(false);
  };

  const onConfirmFieldDetail = (formField: FormFieldProps) => {
    const updatedFormFields = [...formFields];
    updatedFormFields[selectedFieldIndex] = formField;

    // Update the state with the new array
    setFormFields(updatedFormFields);
    onCloseFieldDetail();
    saveForm(updatedFormFields);
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  return (
    <>
      <div className="d-flex gap-2">
        <FormControl
          ref={labelForInputRef}
          type="text"
          placeholder="Label for input..."
          name={'label-for-input'}
          value={labelInput}
          onChange={handleLabelChange}
        />
        <div className="d-flex gap-2">
          <Button onClick={() => addFormField(FORM_TYPES.CHECKBOX, labelInput)}>Add Checkbox</Button>
          <Button onClick={() => addFormField(FORM_TYPES.TEXT, labelInput)}>Add Text Input</Button>
          <Button onClick={() => addFormField(FORM_TYPES.NUMBER, labelInput)}>Add Number Input</Button>
          <Button onClick={() => addFormField(FORM_TYPES.TEXTAREA, labelInput)}>Add Textarea</Button>
        </div>
      </div>

      <Card className="mt-3">
        <Card.Body>
          <Card.Title>
            {formFields.length === 0 ? (
              <span>&uarr; Write label and add input &uarr;</span>
            ) : (
              <span>Generated form:</span>
            )}
          </Card.Title>
          <FormProvider {...methods}>
            <form className="form" onSubmit={methods.handleSubmit(onFormSubmit)}>
              {formFields.map((field, index) => (
                <div key={field.name} className="d-flex align-items-end">
                  <FormField {...field} validations={undefined} onChange={onFieldChange} />
                  <Button variant="secondary" className="mb-2 ms-2" onClick={() => openFieldDetailModal(field, index)}>
                    <PencilFill />
                  </Button>
                  <Button variant="danger" className="mb-2 ms-2" onClick={() => removeFormField(field.name)}>
                    <TrashFill />
                  </Button>
                </div>
              ))}

              {formFields.length ? (
                <div className="d-flex gap-2 align-items-end">
                  <Button type="button" variant="secondary" href="/">Cancel</Button>
                  <Button type="submit" className="flex-fill">Save</Button>
                </div>
              ) : (
                <Button type="button" className="mt-1" variant="secondary" href="/">&larr; Back</Button>
              )}

              {formFields.length > 0 && (
                <Button type="button" className="mt-2 w-100" href={`/forms/test/${form?.id}`}>Test the form</Button>
              )}
            </form>
          </FormProvider>
        </Card.Body>
      </Card>

      {selectedField && (
        <FormFieldDetailModal
          isOpen={isFormFieldDetailModalOpen}
          formField={selectedField}
          onClose={onCloseFieldDetail}
          onConfirm={onConfirmFieldDetail}
        />
      )}

      <ToastContainer
        className="p-3"
        position="bottom-center"
        style={{ zIndex: 1 }}
      >
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default FormBuilder;
