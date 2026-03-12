import { FieldType, FormField } from '@/types/form';

export function getDefaultField(type: FieldType): Omit<FormField, 'id'> {
  const base = {
    type,
    label: getDefaultLabel(type),
    required: false,
    width: 'full' as const,
  };

  switch (type) {
    case 'text':
      return { ...base, placeholder: 'Enter text...' };
    case 'textarea':
      return { ...base, placeholder: 'Enter your response...' };
    case 'number':
      return { ...base, placeholder: '0' };
    case 'email':
      return { ...base, placeholder: 'email@example.com' };
    case 'phone':
      return { ...base, placeholder: '+1 (555) 000-0000' };
    case 'date':
      return { ...base };
    case 'select':
      return {
        ...base,
        placeholder: 'Select an option...',
        options: [
          { label: 'Option 1', value: 'option_1' },
          { label: 'Option 2', value: 'option_2' },
          { label: 'Option 3', value: 'option_3' },
        ],
      };
    case 'multi-select':
      return {
        ...base,
        options: [
          { label: 'Option 1', value: 'option_1' },
          { label: 'Option 2', value: 'option_2' },
          { label: 'Option 3', value: 'option_3' },
        ],
      };
    case 'checkbox':
      return {
        ...base,
        options: [
          { label: 'Option 1', value: 'option_1' },
          { label: 'Option 2', value: 'option_2' },
        ],
      };
    case 'radio':
      return {
        ...base,
        options: [
          { label: 'Option 1', value: 'option_1' },
          { label: 'Option 2', value: 'option_2' },
          { label: 'Option 3', value: 'option_3' },
        ],
      };
    case 'rating':
      return { ...base, maxRating: 5 };
    case 'slider':
      return { ...base, min: 0, max: 100, step: 1 };
    case 'richtext':
      return { ...base, placeholder: 'Enter formatted text...' };
    case 'address':
      return { ...base };
    case 'signature':
      return { ...base };
    case 'file':
      return { ...base, accept: '.pdf,.doc,.docx,.png,.jpg' };
    case 'header':
      return { ...base, label: 'Section Header', headingLevel: 2 };
    case 'divider':
      return { ...base, label: 'Divider' };
    case 'content':
      return { ...base, label: 'Content Block', content: 'Enter your content here...' };
    default:
      return base;
  }
}

function getDefaultLabel(type: FieldType): string {
  const labels: Record<FieldType, string> = {
    text: 'Text Field',
    textarea: 'Text Area',
    number: 'Number Field',
    email: 'Email Address',
    phone: 'Phone Number',
    date: 'Date',
    select: 'Dropdown Select',
    'multi-select': 'Multi Select',
    checkbox: 'Checkbox Group',
    radio: 'Radio Group',
    rating: 'Rating',
    slider: 'Slider',
    richtext: 'Rich Text',
    address: 'Address',
    signature: 'Signature',
    file: 'File Upload',
    header: 'Section Header',
    divider: 'Divider',
    content: 'Content Block',
  };
  return labels[type];
}
