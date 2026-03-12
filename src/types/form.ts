export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'phone'
  | 'date'
  | 'select'
  | 'multi-select'
  | 'checkbox'
  | 'radio'
  | 'rating'
  | 'slider'
  | 'richtext'
  | 'address'
  | 'signature'
  | 'file'
  | 'header'
  | 'divider'
  | 'content';

export type LinkDirection = 'read' | 'write';

export type ClientFieldKey =
  | 'name'
  | 'email'
  | 'phone'
  | 'manager'
  | 'industry'
  | 'revenueTier'
  | 'address'
  | 'contractStartDate';

export interface LinkedField {
  source: `client.${ClientFieldKey}`;
  direction: LinkDirection;
}

export interface ValidationRule {
  type: 'minLength' | 'maxLength' | 'min' | 'max' | 'pattern' | 'fileTypes' | 'maxFileSize';
  value: string | number;
  message?: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  required: boolean;
  defaultValue?: string | number | boolean | string[];
  validation?: ValidationRule[];
  options?: SelectOption[];
  linkedField?: LinkedField;
  min?: number;
  max?: number;
  step?: number;
  maxRating?: number;
  accept?: string;
  headingLevel?: 1 | 2 | 3;
  content?: string;
  width?: 'full' | 'half';
}

export interface FormSchema {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
}
