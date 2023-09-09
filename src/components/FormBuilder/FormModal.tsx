import React, { FC, useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { FormProps, FormValues } from '../../lib/types';
import { FORM_TYPES } from '../../lib/consts';
import FormField from './FormField';

interface FormModalProps {
  isOpen: boolean;
  formData?: FormProps;
  onClose: () => void;
  onConfirm: (formData: FormValues) => void;
}

const FormModal: FC<FormModalProps> = ({
  isOpen,
  formData,
  onClose,
  onConfirm,
}) => {
  const [show, setShow] = useState(isOpen);
  const methods = useForm();

  useEffect(() => {
    setShow(isOpen);
  }, [isOpen]);

  useEffect(() => {
    // Update the nameValue whenever formData changes
    methods.setValue('name', formData?.name);
  }, [formData]);

  const handleClose = () => {
    setShow(false);
    onClose();
  };

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const localData = { ...formData, ...data };
    console.log('data: ', data, localData);
    onConfirm(localData);
    setShow(false);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Input detail</Modal.Title>
      </Modal.Header>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Modal.Body>
            <FormField
              name="name"
              value={formData?.name}
              type={FORM_TYPES.TEXT}
              label="Form name"
              validations={[{
                name: 'required',
                message: 'Form name is required',
              }]}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </form>
      </FormProvider>
    </Modal>
  );
};

export default FormModal;
