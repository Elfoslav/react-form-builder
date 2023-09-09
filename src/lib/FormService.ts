import { v4 as uuidv4 } from 'uuid';
import { FormFieldProps } from "./types";

interface FormProps {
  id?: string;
  name: string;
  fields: FormFieldProps[];
}

class FormService {
  private readonly storageKey = 'forms';

  constructor() {
    // Initialize local storage if it doesn't exist
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    }
  }

  // Create a new form
  createForm(form: FormProps): string {
    const forms = this.getAllForms();
    const id = uuidv4();
    const newForm = { ...form, id }; // Generate a unique ID
    forms.push(newForm);
    this.saveForms(forms);
    return id;
  }

  // Retrieve all forms
  getAllForms(): FormProps[] {
    return this.retrieveForms();
  }

  getFormById(id: string): FormProps | undefined {
    const forms = this.getAllForms();
    return forms.find((form) => form.id === id);
  }

  // Update a form by ID
  updateForm(id: string, updatedForm: FormProps): void {
    const forms = this.getAllForms();
    const index = forms.findIndex((form) => form.id === id);
    if (index !== -1) {
      forms[index] = updatedForm;
      this.saveForms(forms);
    }
  }

  // Delete a form by ID
  deleteForm(id: string): void {
    const forms = this.getAllForms();
    const index = forms.findIndex((form) => form.id === id);
    if (index !== -1) {
      forms.splice(index, 1);
      this.saveForms(forms);
    }
  }

  // Retrieve forms from local storage
  private retrieveForms(): FormProps[] {
    const storedData = localStorage.getItem(this.storageKey);
    return storedData ? JSON.parse(storedData) : [];
  }

  // Save forms to local storage
  private saveForms(forms: FormProps[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(forms));
  }
}

export default new FormService();
