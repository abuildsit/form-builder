import { ClientFieldKey, FieldType } from '@/types/form';

export const CLIENT_FIELD_COMPATIBLE_TYPES: Record<ClientFieldKey, FieldType[]> = {
  name: ['text'],
  email: ['text', 'email'],
  phone: ['text', 'phone'],
  manager: ['text'],
  industry: ['text', 'select', 'radio'],
  revenueTier: ['select', 'radio'],
  address: ['address'],
  contractStartDate: ['date'],
};

export const CLIENT_FIELD_LABELS: Record<ClientFieldKey, string> = {
  name: 'Client Name',
  email: 'Client Email',
  phone: 'Client Phone',
  manager: 'Client Manager',
  industry: 'Industry',
  revenueTier: 'Revenue Tier',
  address: 'Client Address',
  contractStartDate: 'Contract Start Date',
};

export function getCompatibleClientFields(fieldType: FieldType): ClientFieldKey[] {
  return (Object.entries(CLIENT_FIELD_COMPATIBLE_TYPES) as [ClientFieldKey, FieldType[]][])
    .filter(([, types]) => types.includes(fieldType))
    .map(([key]) => key);
}
