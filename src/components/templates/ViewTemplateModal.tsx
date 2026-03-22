import { XMarkIcon } from '@heroicons/react/24/outline';
import type { JournalTemplate } from '@/types/journalTemplate.types';

interface ViewTemplateModalProps {
  template: JournalTemplate;
  onClose: () => void;
  onClone?: (template: JournalTemplate) => void;
  onEdit?: (template: JournalTemplate) => void;
}

export default function ViewTemplateModal({ template, onClose, onClone, onEdit }: ViewTemplateModalProps) {
  const isSystem = template.createdBy === 'system';

  const getFieldTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      text: 'Text',
      textarea: 'Long Text',
      number: 'Number',
      rating: 'Rating',
      select: 'Select',
      multiselect: 'Multi-Select',
      boolean: 'Yes/No',
      date: 'Date',
      time: 'Time',
    };
    return labels[type] || type;
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
      style={{
        backgroundColor: 'rgba(8, 10, 14, 0.58)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
      }}
    >
      <div
        className="w-full max-w-4xl h-[100dvh] sm:h-auto sm:max-h-[90vh] overflow-hidden rounded-none sm:rounded-2xl"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--color-surface-elevated) 88%, transparent)',
          border: '1px solid color-mix(in srgb, var(--color-border) 20%, transparent)',
          boxShadow: '0 30px 70px rgba(0,0,0,0.48)',
        }}
      >
        <div
          className="sticky top-0 z-10 px-5 sm:px-8 py-4 sm:py-6"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--color-surface-elevated) 92%, transparent)',
            borderBottom: '1px solid color-mix(in srgb, var(--color-border) 16%, transparent)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                {template.icon && (
                  <span
                    className="inline-flex items-center justify-center h-10 w-10 rounded-xl text-2xl"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 16%, transparent)' }}
                  >
                    {template.icon}
                  </span>
                )}
                <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight" style={{ color: 'var(--color-text-primary)' }}>
                  {template.name}
                </h2>
              </div>

              {template.description && (
                <p className="text-base sm:text-lg" style={{ color: 'var(--color-text-secondary)' }}>
                  {template.description}
                </p>
              )}

              <div className="flex flex-wrap gap-2 mt-4 text-sm">
                <span
                  className="px-3 py-1 rounded-full font-medium"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)',
                    color: 'var(--color-primary)',
                  }}
                >
                  {isSystem ? 'System Template' : 'User Template'}
                </span>
                {template.isDefault && (
                  <span
                    className="px-3 py-1 rounded-full font-medium"
                    style={{
                      backgroundColor: 'color-mix(in srgb, #eab308 18%, transparent)',
                      color: '#facc15',
                    }}
                  >
                    Default
                  </span>
                )}
                <span
                  className="px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--color-surface) 75%, transparent)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {template.fields.length} fields
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--color-text-tertiary)' }}
              aria-label="Close"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="px-5 sm:px-8 py-5 sm:py-6 overflow-y-auto max-h-[calc(100dvh-210px)] sm:max-h-[calc(90vh-170px)]">
          <div className="mt-1">
            <h3 className="text-2xl font-semibold mb-4 pb-2" style={{ color: 'var(--color-text-primary)', borderBottom: '1px solid color-mix(in srgb, var(--color-border) 18%, transparent)' }}>
              Template Fields
            </h3>
            <div className="space-y-4">
              {template.fields
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((field, index) => (
                  <div
                    key={field.id}
                    className="p-4 sm:p-5 rounded-xl"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--color-surface) 64%, var(--color-surface-elevated))',
                      border: '1px solid color-mix(in srgb, var(--color-border) 20%, transparent)',
                    }}
                  >
                    <div className="mb-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold" style={{ color: 'var(--color-text-tertiary)' }}>
                          #{index + 1}
                        </span>
                        <span
                          className="px-3 py-1 rounded-lg text-sm font-semibold"
                          style={{
                            backgroundColor: 'color-mix(in srgb, var(--color-primary) 22%, transparent)',
                            color: 'var(--color-primary-light)',
                          }}
                        >
                          {getFieldTypeLabel(field.type)}
                        </span>
                      </div>
                      <span
                        className="block font-bold text-2xl leading-snug mt-2"
                        style={{ color: 'var(--color-text-primary)' }}
                      >
                        {field.label}
                        {field.required && (
                          <span style={{ color: 'var(--color-error)' }}> *</span>
                        )}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3 text-sm">
                      {field.placeholder && (
                        <div>
                          <span style={{ color: 'var(--color-text-tertiary)' }}>Placeholder:</span>
                          <p className="mt-1 text-base" style={{ color: 'var(--color-text-primary)' }}>{field.placeholder}</p>
                        </div>
                      )}

                      {field.min !== undefined && (
                        <div>
                          <span style={{ color: 'var(--color-text-tertiary)' }}>Min:</span>
                          <p className="mt-1 text-base" style={{ color: 'var(--color-text-primary)' }}>{field.min}</p>
                        </div>
                      )}

                      {field.max !== undefined && (
                        <div>
                          <span style={{ color: 'var(--color-text-tertiary)' }}>Max:</span>
                          <p className="mt-1 text-base" style={{ color: 'var(--color-text-primary)' }}>{field.max}</p>
                        </div>
                      )}

                      <div>
                        <span style={{ color: 'var(--color-text-tertiary)' }}>Required:</span>
                        <p className="mt-1 text-base" style={{ color: 'var(--color-text-primary)' }}>
                          {field.required ? 'Yes' : 'No'}
                        </p>
                      </div>

                      {field.options && field.options.length > 0 && (
                        <div className="sm:col-span-2">
                          <span style={{ color: 'var(--color-text-tertiary)' }}>Options:</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {field.options.map((option, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-1 rounded-md text-sm"
                                style={{
                                  color: 'var(--color-text-primary)',
                                  backgroundColor: 'color-mix(in srgb, var(--color-surface-elevated) 82%, transparent)',
                                  border: '1px solid color-mix(in srgb, var(--color-border) 20%, transparent)',
                                }}
                              >
                                {option}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="mt-8 pt-5" style={{ borderTop: '1px solid color-mix(in srgb, var(--color-border) 18%, transparent)' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              Template Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span style={{ color: 'var(--color-text-tertiary)' }}>Created:</span>
                <p className="mt-1" style={{ color: 'var(--color-text-primary)' }}>
                  {new Date(template.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-tertiary)' }}>Last Updated:</span>
                <p className="mt-1" style={{ color: 'var(--color-text-primary)' }}>
                  {new Date(template.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-tertiary)' }}>Status:</span>
                <p className="mt-1" style={{ color: 'var(--color-text-primary)' }}>
                  {template.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-tertiary)' }}>Template ID:</span>
                <p className="mt-1 text-xs break-all" style={{ color: 'var(--color-text-primary)' }}>
                  {template._id}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="sticky bottom-0 z-10 px-5 sm:px-8 py-4 flex flex-col sm:flex-row gap-3 sm:justify-end"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--color-surface-elevated) 92%, transparent)',
            borderTop: '1px solid color-mix(in srgb, var(--color-border) 16%, transparent)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
          }}
        >
          {isSystem ? (
            onClone && (
              <button
                onClick={() => {
                  onClose();
                  onClone(template);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-white font-medium"
                style={{
                  background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary-dark) 90%, transparent), var(--color-primary))',
                }}
              >
                Clone Template
              </button>
            )
          ) : (
            onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(template);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-white font-medium"
                style={{
                  background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary-dark) 90%, transparent), var(--color-primary))',
                }}
              >
                Edit Template
              </button>
            )
          )}
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-medium"
            style={{
              color: 'var(--color-text-secondary)',
              border: '1px solid color-mix(in srgb, var(--color-border) 28%, transparent)',
              backgroundColor: 'color-mix(in srgb, var(--color-surface) 72%, transparent)',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
