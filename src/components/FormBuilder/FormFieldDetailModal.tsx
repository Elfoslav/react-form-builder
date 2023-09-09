import React, { FC, useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useForm, FormProvider } from 'react-hook-form';
import { FormFieldProps, Validation, FieldOption } from '../../lib/types';
import { FORM_TYPES, FORM_VALIDATIONS } from '../../lib/consts';
import FormField from './FormField';
import { generateInputName } from '../../lib/functions';

interface FormFieldDetailModalProps {
  isOpen: boolean;
  formField: FormFieldProps;
  onClose: () => void;
  onConfirm: (formField: FormFieldProps) => void;
}

const FormFieldDetailModal: FC<FormFieldDetailModalProps> = ({
  isOpen,
  formField,
  onClose,
  onConfirm,
}) => {
  const defaultValidationOption = { label: 'No validation', value: '' };
  const defaultValidation = { name: defaultValidationOption.label, value: defaultValidationOption.value };
  const defaultValidations = formField.validations?.length ? formField.validations : [{ ...defaultValidation }];
  const [show, setShow] = useState(isOpen);
  const [localFormField, setLocalFormField] = useState(formField); // Local state to track form field values
  const [formValidations, setFormValidations] = useState<Validation[]>(defaultValidations);
  const validationOptions: FieldOption[] = [];
  const methods = useForm();

  useEffect(() => {
    setFormValidations(defaultValidations);
    setLocalFormField(formField);
    methods.reset();
  }, [formField]);

  const typeOptions = [
    { label: 'Text', value: FORM_TYPES.TEXT },
    { label: 'Number', value: FORM_TYPES.NUMBER },
    { label: 'Checkbox', value: FORM_TYPES.CHECKBOX },
    { label: 'Textarea', value: FORM_TYPES.TEXTAREA },
  ];

  const commonValidationOptions = [
    { ...defaultValidationOption },
    { label: 'Required', value: FORM_VALIDATIONS.REQUIRED },
  ];

  const textValidationOptions = [
    ...commonValidationOptions,
    { label: 'Starts with', value: FORM_VALIDATIONS.STARTS_WITH },
    { label: 'Contains', value: FORM_VALIDATIONS.CONTAINS },
  ];

  const numberValidationOptions = [
    ...commonValidationOptions,
    { label: 'Number between', value: FORM_VALIDATIONS.NUMBER_BETWEEN },
  ];

  if (localFormField.type === FORM_TYPES.TEXT || localFormField.type === FORM_TYPES.TEXTAREA) {
    validationOptions.push(...textValidationOptions);
  }

  if (localFormField.type == FORM_TYPES.NUMBER) {
    validationOptions.push(...numberValidationOptions);
  }

  useEffect(() => {
    setShow(isOpen);
    setLocalFormField(formField); // Update local state when formField prop changes
  }, [isOpen, formField]);

  const handleClose = () => {
    setShow(false);
    onClose();
  };

  const onLabelChange = (name: string, value: string) => {
    // Update the local state with the new label value
    setLocalFormField({
      ...localFormField,
      label: value,
      name: generateInputName(value),
    });
  };

  const onTypeChange = (name: string, value: string) => {
    // Update the local state with the new type value
    setLocalFormField({ ...localFormField, type: value });
  };

  const onValidationChange = (name: string, value: string, index: number) => {
    // Update the local state with the new type value
    const updatedValidation: Validation = { name: value, value: '' };
    setFormValidations((prevValidations) => {
      const newValidations = [...prevValidations];
      newValidations[index] = { ...updatedValidation };
      return newValidations;
    });
  };

  const onValidationValueChange = (name: string, value: string, index: number) => {
    // Update the local state with the new type value
    let updatedValidation: Validation = { ...formValidations[index], value };

    if (name === 'min') {
      updatedValidation = { ...formValidations[index], min: parseInt(value, 10) };
    }

    if (name === 'max') {
      updatedValidation = { ...formValidations[index], max: parseInt(value, 10) };
    }

    setFormValidations((prevValidations) => {
      const newValidations = [...prevValidations];
      newValidations[index] = { ...updatedValidation };
      return newValidations;
    });
  };

  const addValidationOption = () => {
    const newValidation = { ...defaultValidation };
    setFormValidations((prevValidations) => [...prevValidations, newValidation]);
  };

  const removeValidationOption = (index: number) => {
    setFormValidations((prevValidations) =>
      prevValidations.filter((_, i) => i !== index)
    );
  };

  useEffect(() => {
    setLocalFormField({ ...localFormField, validations: formValidations });
  }, [formValidations]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Input detail</Modal.Title>
      </Modal.Header>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(() => onConfirm(localFormField))}>
          <Modal.Body>
            <FormField
              name="label"
              type={FORM_TYPES.TEXT}
              label="Label"
              value={localFormField.label} // Use local state value
              onChange={onLabelChange}
            />
            <FormField
              name="type"
              type="select"
              label="Type"
              value={localFormField.type} // Use local state value
              options={typeOptions}
              onChange={onTypeChange}
            />

            {validationOptions.length > 0 && formValidations.map((validation, index) => (
              <div key={index}>
                <div className="d-flex gap-2 align-items-end">
                  <FormField
                    name={`validation-type-${index}`}
                    type="select"
                    label="Validation"
                    value={validation.name}
                    options={validationOptions}
                    onChange={(name, value) => onValidationChange(name, value, index)}
                  />
                  {index !== 0 &&
                    <Button variant="danger" className="mb-2" onClick={() => removeValidationOption(index)}>
                      -
                    </Button>
                  }
                </div>
                {(validation.name === FORM_VALIDATIONS.CONTAINS || validation.name === FORM_VALIDATIONS.STARTS_WITH) && (
                  <FormField
                    name={`validation-value-${index}`}
                    type="text"
                    label="Value"
                    value={validation.value}
                    onChange={(name, value) => onValidationValueChange(name, value, index)}
                  />
                )}
                {(validation.name === FORM_VALIDATIONS.NUMBER_BETWEEN) && (
                  <div className="d-flex gap-2 align-items-end">
                    <FormField
                      name="min"
                      type="number"
                      label="Min"
                      value={validation.min}
                      onChange={(name, value) => onValidationValueChange(name, value, index)}
                    />
                    <FormField
                      name="max"
                      type="number"
                      label="Max"
                      value={validation.max}
                      onChange={(name, value) => onValidationValueChange(name, value, index)}
                    />
                  </div>
                )}
              </div>
            ))}
            <Button variant="success" className="mt-2 w-100" onClick={() => addValidationOption()}>
              Add validation
            </Button>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit" onClick={() => onConfirm(localFormField)}>
              Save Changes
            </Button>
          </Modal.Footer>
        </form>
      </FormProvider>
    </Modal>
  );
};

export default FormFieldDetailModal;
