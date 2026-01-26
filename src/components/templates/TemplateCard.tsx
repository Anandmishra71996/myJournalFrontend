import { 
  PencilIcon, 
  TrashIcon, 
  DocumentDuplicateIcon,
  StarIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import type { JournalTemplate } from '@/types/journalTemplate.types';

interface TemplateCardProps {
  template: JournalTemplate;
  onView: (template: JournalTemplate) => void;
  onClone: (template: JournalTemplate) => void;
  onEdit: (template: JournalTemplate) => void;
  onDelete: (templateId: string) => void;
  onSetDefault: (templateId: string) => void;
}

export default function TemplateCard({
  template,
  onView,
  onClone,
  onEdit,
  onDelete,
  onSetDefault,
}: TemplateCardProps) {
  const isSystem = template.createdBy === 'system';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {template.icon && <span className="mr-2">{template.icon}</span>}
              {template.name}
            </h3>
            {template.isDefault && (
              <StarIconSolid className="w-5 h-5 text-yellow-500" title="Default template" />
            )}
          </div>
          {template.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {template.description}
            </p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            {template.fields.length} fields
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(template)}
            className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
            title="View details"
          >
            <EyeIcon className="w-5 h-5" />
          </button>
          {isSystem ? (
            <button
              onClick={() => onClone(template)}
              className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
              title="Clone this template"
            >
              <DocumentDuplicateIcon className="w-5 h-5" />
            </button>
          ) : (
            <>
              {!template.isDefault && (
                <button
                  onClick={() => onSetDefault(template._id)}
                  className="p-2 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded-lg transition-colors"
                  title="Set as default"
                >
                  <StarIcon className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => onEdit(template)}
                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                title="Edit template"
              >
                <PencilIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete(template._id)}
                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                title="Delete template"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
      <div className="space-y-2">
        {template.fields.slice(0, 3).map((field) => (
          <div key={field.id} className="text-sm">
            <span className="text-gray-700 dark:text-gray-300 font-medium">{field.label}</span>
            <span className="text-gray-500 dark:text-gray-500 text-xs ml-2">({field.type})</span>
          </div>
        ))}
        {template.fields.length > 3 && (
          <p className="text-xs text-gray-500 dark:text-gray-500">
            +{template.fields.length - 3} more fields
          </p>
        )}
      </div>
    </div>
  );
}
