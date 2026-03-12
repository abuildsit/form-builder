import { nanoid } from 'nanoid';

export function generateFieldId(): string {
  return `field_${nanoid(8)}`;
}

export function generateFormId(): string {
  return `form_${nanoid(8)}`;
}
