import { FormSchema, FieldType, FormField } from '@/types/form';

const VALID_FIELD_TYPES: FieldType[] = [
  'text', 'textarea', 'number', 'email', 'phone', 'date',
  'select', 'multi-select', 'checkbox', 'radio',
  'rating', 'slider', 'richtext', 'address', 'signature', 'file',
  'header', 'divider', 'content',
];

const VALID_CLIENT_FIELDS = [
  'name', 'email', 'phone', 'manager', 'industry',
  'revenueTier', 'address', 'contractStartDate',
];

export function validateFormSchema(json: unknown): { valid: boolean; errors: string[]; form?: FormSchema } {
  const errors: string[] = [];

  if (!json || typeof json !== 'object') {
    return { valid: false, errors: ['Input must be a JSON object'] };
  }

  const obj = json as Record<string, unknown>;

  if (typeof obj.title !== 'string' || !obj.title) {
    errors.push('Missing or invalid "title" (must be a non-empty string)');
  }

  if (!Array.isArray(obj.fields)) {
    errors.push('Missing or invalid "fields" (must be an array)');
    return { valid: false, errors };
  }

  obj.fields.forEach((field: unknown, index: number) => {
    if (!field || typeof field !== 'object') {
      errors.push(`Field ${index}: must be an object`);
      return;
    }

    const f = field as Record<string, unknown>;

    if (typeof f.type !== 'string' || !VALID_FIELD_TYPES.includes(f.type as FieldType)) {
      errors.push(`Field ${index}: invalid type "${f.type}". Must be one of: ${VALID_FIELD_TYPES.join(', ')}`);
    }

    if (typeof f.label !== 'string' || !f.label) {
      errors.push(`Field ${index}: missing or invalid "label"`);
    }

    if (f.linkedField) {
      const link = f.linkedField as Record<string, unknown>;
      if (typeof link.source !== 'string' || !link.source.startsWith('client.')) {
        errors.push(`Field ${index}: linkedField.source must start with "client."`);
      } else {
        const clientField = link.source.replace('client.', '');
        if (!VALID_CLIENT_FIELDS.includes(clientField)) {
          errors.push(`Field ${index}: invalid client field "${clientField}"`);
        }
      }
      if (link.direction !== 'read' && link.direction !== 'write') {
        errors.push(`Field ${index}: linkedField.direction must be "read" or "write"`);
      }
    }

    const needsOptions = ['select', 'multi-select', 'checkbox', 'radio'];
    if (needsOptions.includes(f.type as string) && (!Array.isArray(f.options) || f.options.length === 0)) {
      errors.push(`Field ${index}: type "${f.type}" requires non-empty "options" array`);
    }
  });

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Build a valid FormSchema, filling in defaults
  const form: FormSchema = {
    id: (obj.id as string) || `form_imported`,
    title: obj.title as string,
    description: (obj.description as string) || undefined,
    fields: (obj.fields as Record<string, unknown>[]).map((f, i) => ({
      id: (f.id as string) || `field_${i + 1}`,
      type: f.type as FieldType,
      label: f.label as string,
      placeholder: (f.placeholder as string) || undefined,
      helpText: (f.helpText as string) || undefined,
      required: (f.required as boolean) ?? false,
      defaultValue: f.defaultValue as FormField['defaultValue'],
      validation: f.validation as FormField['validation'],
      options: f.options as FormField['options'],
      linkedField: f.linkedField as FormField['linkedField'],
      min: f.min as number | undefined,
      max: f.max as number | undefined,
      step: f.step as number | undefined,
      maxRating: f.maxRating as number | undefined,
      accept: f.accept as string | undefined,
    })),
    createdAt: (obj.createdAt as string) || new Date().toISOString(),
    updatedAt: (obj.updatedAt as string) || new Date().toISOString(),
  };

  return { valid: true, errors: [], form };
}
