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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full p-8 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {template.icon && (
                <span className="text-4xl">{template.icon}</span>
              )}
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {template.name}
              </h2>
            </div>
            {template.description && (
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {template.description}
              </p>
            )}
            <div className="flex gap-4 mt-4 text-sm">
              <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full font-medium">
                {isSystem ? '🌟 System Template' : '👤 User Template'}
              </span>
              {template.isDefault && (
                <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full font-medium">
                  ⭐ Default
                </span>
              )}
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                {template.fields.length} fields
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors ml-4"
          >
            <XMarkIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Fields Section */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            Template Fields
          </h3>
          <div className="space-y-4">
            {template.fields
              .sort((a, b) => a.order - b.order)
              .map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                        #{index + 1}
                      </span>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                        {field.label}
                        {field.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </h4>
                    </div>
                    <span className="px-2.5 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded text-sm font-medium">
                      {getFieldTypeLabel(field.type)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {field.placeholder && (
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 font-medium">Placeholder:</span>
                        <p className="text-gray-700 dark:text-gray-300 mt-1">{field.placeholder}</p>
                      </div>
                    )}
                    {field.options && field.options.length > 0 && (
                      <div className="col-span-2">
                        <span className="text-gray-500 dark:text-gray-400 font-medium">Options:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {field.options.map((option, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded border border-gray-300 dark:border-gray-500"
                            >
                              {option}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {field.min !== undefined && (
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 font-medium">Min:</span>
                        <p className="text-gray-700 dark:text-gray-300 mt-1">{field.min}</p>
                      </div>
                    )}
                    {field.max !== undefined && (
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 font-medium">Max:</span>
                        <p className="text-gray-700 dark:text-gray-300 mt-1">{field.max}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 font-medium">Required:</span>
                      <p className="text-gray-700 dark:text-gray-300 mt-1">
                        {field.required ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Metadata Section */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Template Information
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400 font-medium">Created:</span>
              <p className="text-gray-700 dark:text-gray-300 mt-1">
                {new Date(template.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400 font-medium">Last Updated:</span>
              <p className="text-gray-700 dark:text-gray-300 mt-1">
                {new Date(template.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400 font-medium">Status:</span>
              <p className="text-gray-700 dark:text-gray-300 mt-1">
                {template.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400 font-medium">Template ID:</span>
              <p className="text-gray-700 dark:text-gray-300 mt-1 font-mono text-xs">
                {template._id}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-3 justify-end">
          {isSystem ? (
            onClone && (
              <button
                onClick={() => {
                  onClose();
                  onClone(template);
                }}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
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
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Edit Template
              </button>
            )
          )}
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
