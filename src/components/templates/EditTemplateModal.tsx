import { useState } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { JournalTemplate, UpdateTemplateData, TemplateField, FieldType } from '@/types/journalTemplate.types';

interface EditTemplateModalProps {
  template: JournalTemplate;
  onClose: () => void;
  onSave: (templateId: string, updates: UpdateTemplateData) => void;
}

export default function EditTemplateModal({ template, onClose, onSave }: EditTemplateModalProps) {
  const [formData, setFormData] = useState<UpdateTemplateData>({
    name: template.name,
    description: template.description || '',
    icon: template.icon || '',
    fields: template.fields,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(template._id, formData);
  };

  const handleFieldChange = (index: number, field: Partial<TemplateField>) => {
    const updatedFields = [...(formData.fields || [])];
    updatedFields[index] = { ...updatedFields[index], ...field };
    setFormData({ ...formData, fields: updatedFields });
  };

  const addField = () => {
    const newField: TemplateField = {
      id: Date.now().toString(),
      label: 'New Field',
      type: 'text',
      placeholder: '',
      required: false,
      order: (formData.fields?.length || 0),
    };
    setFormData({ ...formData, fields: [...(formData.fields || []), newField] });
  };

  const removeField = (index: number) => {
    const updatedFields = (formData.fields || []).filter((_, i) => i !== index);
    setFormData({ ...formData, fields: updatedFields });
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto backdrop-blur-[24px]"
      style={{
        backgroundColor: 'rgba(8, 10, 14, 0.58)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
    >
      <div
        className="w-full max-w-4xl h-[100dvh] sm:h-auto sm:max-h-[90vh] overflow-hidden rounded-none sm:rounded-2xl"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--color-surface-elevated) 86%, transparent)',
          border: '1px solid color-mix(in srgb, var(--color-border) 24%, transparent)',
          boxShadow: '0 28px 70px rgba(0,0,0,0.5)',
        }}
      >
        <div
          className="flex items-center justify-between px-5 sm:px-8 py-4 sm:py-6 sticky top-0 z-10"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--color-surface-elevated) 90%, transparent)',
            borderBottom: '1px solid color-mix(in srgb, var(--color-border) 16%, transparent)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            Edit Template
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-5 sm:px-8 py-5 sm:py-6 overflow-y-auto max-h-[calc(100dvh-142px)] sm:max-h-[calc(90vh-88px)]">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                Template Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl focus:outline-none"
                style={{
                  color: 'var(--color-text-primary)',
                  backgroundColor: 'color-mix(in srgb, var(--color-background) 60%, black)',
                  border: '1px solid color-mix(in srgb, var(--color-border) 30%, transparent)',
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl focus:outline-none"
                style={{
                  color: 'var(--color-text-primary)',
                  backgroundColor: 'color-mix(in srgb, var(--color-background) 60%, black)',
                  border: '1px solid color-mix(in srgb, var(--color-border) 30%, transparent)',
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                Icon (emoji)
              </label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                maxLength={2}
                className="w-full px-4 py-2.5 rounded-xl focus:outline-none"
                style={{
                  color: 'var(--color-text-primary)',
                  backgroundColor: 'color-mix(in srgb, var(--color-background) 60%, black)',
                  border: '1px solid color-mix(in srgb, var(--color-border) 30%, transparent)',
                }}
              />
            </div>
          </div>

          {/* Fields Section */}
          <div className="pt-6" style={{ borderTop: '1px solid color-mix(in srgb, var(--color-border) 22%, transparent)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-2xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                Template Fields
              </h3>
              <button
                type="button"
                onClick={addField}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white"
                style={{
                  background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary-dark) 90%, transparent), var(--color-primary))',
                }}
              >
                <PlusIcon className="w-4 h-4" />
                Add Field
              </button>
            </div>

            <div className="space-y-4">
              {formData.fields?.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 rounded-xl"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--color-surface) 55%, var(--color-surface-elevated))',
                    border: '1px solid color-mix(in srgb, var(--color-border) 22%, transparent)',
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold" style={{ color: 'var(--color-text-tertiary)' }}>
                      Field #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeField(index)}
                      className="p-1.5 rounded transition-colors"
                      style={{ color: 'var(--color-error)' }}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                        Label *
                      </label>
                      <input
                        type="text"
                        required
                        value={field.label}
                        onChange={(e) => handleFieldChange(index, { label: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-xl focus:outline-none"
                        style={{
                          color: 'var(--color-text-primary)',
                          backgroundColor: 'color-mix(in srgb, var(--color-background) 58%, black)',
                          border: '1px solid color-mix(in srgb, var(--color-border) 28%, transparent)',
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                        Type *
                      </label>
                      <select
                        value={field.type}
                        onChange={(e) => handleFieldChange(index, { type: e.target.value as FieldType })}
                        className="w-full px-3 py-2 text-sm rounded-xl focus:outline-none"
                        style={{
                          color: 'var(--color-text-primary)',
                          backgroundColor: 'color-mix(in srgb, var(--color-background) 58%, black)',
                          border: '1px solid color-mix(in srgb, var(--color-border) 28%, transparent)',
                        }}
                      >
                        <option value="text">Text</option>
                        <option value="textarea">Long Text</option>
                        <option value="number">Number</option>
                        <option value="rating">Rating</option>
                        <option value="select">Select</option>
                        <option value="multiselect">Multi-Select</option>
                        <option value="boolean">Yes/No</option>
                        <option value="date">Date</option>
                        <option value="time">Time</option>
                      </select>
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                        Placeholder
                      </label>
                      <input
                        type="text"
                        value={field.placeholder}
                        onChange={(e) => handleFieldChange(index, { placeholder: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-xl focus:outline-none"
                        style={{
                          color: 'var(--color-text-primary)',
                          backgroundColor: 'color-mix(in srgb, var(--color-background) 58%, black)',
                          border: '1px solid color-mix(in srgb, var(--color-border) 28%, transparent)',
                        }}
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`required-${index}`}
                        checked={field.required}
                        onChange={(e) => handleFieldChange(index, { required: e.target.checked })}
                        className="w-4 h-4 rounded"
                        style={{ accentColor: 'var(--color-primary)' }}
                      />
                      <label htmlFor={`required-${index}`} className="ml-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        Required
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div
            className="flex gap-3 pt-4 sticky bottom-0"
            style={{
              borderTop: '1px solid color-mix(in srgb, var(--color-border) 22%, transparent)',
              backgroundColor: 'color-mix(in srgb, var(--color-surface-elevated) 92%, transparent)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              paddingBottom: 'max(0.25rem, env(safe-area-inset-bottom))',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl transition-colors font-medium"
              style={{
                color: 'var(--color-text-secondary)',
                border: '1px solid color-mix(in srgb, var(--color-border) 28%, transparent)',
                backgroundColor: 'color-mix(in srgb, var(--color-surface) 68%, transparent)',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 text-white rounded-xl transition-colors font-medium"
              style={{
                background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary-dark) 90%, transparent), var(--color-primary))',
              }}
            >
              Update Template
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
