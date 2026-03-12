import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import { FormSchema, FormField, FieldType } from '@/types/form';
import { ClientRecord } from '@/types/client';
import { generateFieldId, generateFormId } from '@/lib/id-generator';
import { getDefaultField } from '@/lib/field-defaults';
import { validateFormSchema } from '@/lib/form-schema-validator';
import clientsData from '@/data/clients.json';
import onboardingData from '@/../samples/client-onboarding.json';

interface FormBuilderState {
  form: FormSchema;
  selectedFieldId: string | null;
  isDragging: boolean;
  clients: ClientRecord[];
  selectedClientId: string | null;
  previewValues: Record<string, unknown>;
  importError: string | null;

  setFormTitle: (title: string) => void;
  setFormDescription: (desc: string) => void;
  addField: (type: FieldType, index?: number) => void;
  removeField: (fieldId: string) => void;
  updateField: (fieldId: string, updates: Partial<FormField>) => void;
  reorderFields: (activeIndex: number, overIndex: number) => void;
  duplicateField: (fieldId: string) => void;
  selectField: (fieldId: string | null) => void;
  setDragging: (isDragging: boolean) => void;
  selectClient: (clientId: string | null) => void;
  setPreviewValue: (fieldId: string, value: unknown) => void;
  resetPreviewValues: () => void;
  exportForm: () => string;
  importForm: (json: string) => boolean;
  loadSampleForm: (form: FormSchema) => void;
  resetForm: () => void;
}

const createEmptyForm = (): FormSchema => ({
  id: generateFormId(),
  title: 'Untitled Form',
  description: '',
  fields: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const useFormBuilderStore = create<FormBuilderState>()(
  devtools(
    immer((set, get) => ({
      form: onboardingData as unknown as FormSchema,
      selectedFieldId: null,
      isDragging: false,
      clients: clientsData as ClientRecord[],
      selectedClientId: null,
      previewValues: {},
      importError: null,

      setFormTitle: (title) =>
        set((state) => {
          state.form.title = title;
          state.form.updatedAt = new Date().toISOString();
        }),

      setFormDescription: (desc) =>
        set((state) => {
          state.form.description = desc;
          state.form.updatedAt = new Date().toISOString();
        }),

      addField: (type, index) =>
        set((state) => {
          const newField: FormField = {
            id: generateFieldId(),
            ...getDefaultField(type),
          };
          if (index !== undefined && index >= 0) {
            state.form.fields.splice(index, 0, newField);
          } else {
            state.form.fields.push(newField);
          }
          state.form.updatedAt = new Date().toISOString();
          state.selectedFieldId = newField.id;
        }),

      removeField: (fieldId) =>
        set((state) => {
          state.form.fields = state.form.fields.filter((f) => f.id !== fieldId);
          if (state.selectedFieldId === fieldId) {
            state.selectedFieldId = null;
          }
          state.form.updatedAt = new Date().toISOString();
        }),

      updateField: (fieldId, updates) =>
        set((state) => {
          const field = state.form.fields.find((f) => f.id === fieldId);
          if (field) {
            Object.assign(field, updates);
            state.form.updatedAt = new Date().toISOString();
          }
        }),

      reorderFields: (activeIndex, overIndex) =>
        set((state) => {
          const [moved] = state.form.fields.splice(activeIndex, 1);
          state.form.fields.splice(overIndex, 0, moved);
          state.form.updatedAt = new Date().toISOString();
        }),

      duplicateField: (fieldId) =>
        set((state) => {
          const field = state.form.fields.find((f) => f.id === fieldId);
          if (field) {
            const index = state.form.fields.findIndex((f) => f.id === fieldId);
            const duplicate: FormField = {
              ...JSON.parse(JSON.stringify(field)),
              id: generateFieldId(),
              label: `${field.label} (copy)`,
            };
            state.form.fields.splice(index + 1, 0, duplicate);
            state.form.updatedAt = new Date().toISOString();
            state.selectedFieldId = duplicate.id;
          }
        }),

      selectField: (fieldId) =>
        set((state) => {
          state.selectedFieldId = fieldId;
        }),

      setDragging: (isDragging) =>
        set((state) => {
          state.isDragging = isDragging;
        }),

      selectClient: (clientId) =>
        set((state) => {
          state.selectedClientId = clientId;
          // Auto-populate linked read fields
          if (clientId) {
            const client = state.clients.find((c) => c.id === clientId);
            if (client) {
              state.form.fields.forEach((field) => {
                if (field.linkedField?.direction === 'read') {
                  const clientKey = field.linkedField.source.replace('client.', '') as keyof ClientRecord;
                  state.previewValues[field.id] = client[clientKey];
                }
              });
            }
          } else {
            // Clear pre-populated values
            state.form.fields.forEach((field) => {
              if (field.linkedField?.direction === 'read') {
                delete state.previewValues[field.id];
              }
            });
          }
        }),

      setPreviewValue: (fieldId, value) =>
        set((state) => {
          state.previewValues[fieldId] = value;
        }),

      resetPreviewValues: () =>
        set((state) => {
          state.previewValues = {};
        }),

      exportForm: () => {
        return JSON.stringify(get().form, null, 2);
      },

      importForm: (json) => {
        try {
          const parsed = JSON.parse(json);
          const result = validateFormSchema(parsed);
          if (result.valid && result.form) {
            set((state) => {
              state.form = result.form!;
              state.selectedFieldId = null;
              state.previewValues = {};
              state.importError = null;
            });
            return true;
          } else {
            set((state) => {
              state.importError = result.errors.join('\n');
            });
            return false;
          }
        } catch {
          set((state) => {
            state.importError = 'Invalid JSON format';
          });
          return false;
        }
      },

      loadSampleForm: (form) =>
        set((state) => {
          state.form = form;
          state.selectedFieldId = null;
          state.previewValues = {};
          state.importError = null;
        }),

      resetForm: () =>
        set((state) => {
          state.form = createEmptyForm();
          state.selectedFieldId = null;
          state.selectedClientId = null;
          state.previewValues = {};
          state.importError = null;
        }),
    }))
  )
);
