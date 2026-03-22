import {
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  PencilIcon, 
  TrashIcon, 
  DocumentDuplicateIcon,
  StarIcon,
  EyeIcon,
  EllipsisVerticalIcon,
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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  return (
    <div
      className="group rounded-2xl p-4 md:p-5 transition-all duration-200"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--color-surface-elevated) 80%, transparent)',
        border: '1px solid color-mix(in srgb, var(--color-border) 24%, transparent)',
        boxShadow: '0 14px 28px rgba(0, 0, 0, 0.22)',
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5">
            <span
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-lg"
              style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 14%, transparent)' }}
            >
              {template.icon || '📝'}
            </span>
            <h3 className="text-base md:text-lg font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>
              {template.name}
            </h3>
            {template.isDefault && (
              <StarIconSolid className="w-4 h-4 text-yellow-500 flex-shrink-0" title="Default template" />
            )}
          </div>

          <div className="mt-2 flex items-center gap-2">
            <span
              className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em]"
              style={{
                backgroundColor: isSystem
                  ? 'color-mix(in srgb, var(--color-info) 22%, transparent)'
                  : 'color-mix(in srgb, var(--color-primary) 20%, transparent)',
                color: isSystem ? 'var(--color-info)' : 'var(--color-primary)',
              }}
            >
              {isSystem ? 'System' : 'Custom'}
            </span>
            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              {template.fields.length} fields
            </p>
          </div>

          {template.description && (
            <p className="text-sm mt-2 line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
              {template.description}
            </p>
          )}
        </div>

        <div className="hidden md:flex items-center gap-1 md:gap-1.5">
          <button
            onClick={() => onView(template)}
            className="p-2 rounded-lg transition-colors"
            style={{
              color: 'var(--color-success)',
              backgroundColor: 'color-mix(in srgb, var(--color-success) 16%, transparent)',
            }}
            title="View details"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
          {isSystem ? (
            <button
              onClick={() => onClone(template)}
              className="p-2 rounded-lg transition-colors"
              style={{
                color: 'var(--color-primary)',
                backgroundColor: 'color-mix(in srgb, var(--color-primary) 16%, transparent)',
              }}
              title="Clone this template"
            >
              <DocumentDuplicateIcon className="w-4 h-4" />
            </button>
          ) : (
            <>
              {!template.isDefault && (
                <button
                  onClick={() => onSetDefault(template._id)}
                  className="p-2 rounded-lg transition-colors"
                  style={{
                    color: '#eab308',
                    backgroundColor: 'color-mix(in srgb, #eab308 16%, transparent)',
                  }}
                  title="Set as default"
                >
                  <StarIcon className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => onEdit(template)}
                className="p-2 rounded-lg transition-colors"
                style={{
                  color: 'var(--color-info)',
                  backgroundColor: 'color-mix(in srgb, var(--color-info) 16%, transparent)',
                }}
                title="Edit template"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(template._id)}
                className="p-2 rounded-lg transition-colors"
                style={{
                  color: 'var(--color-error)',
                  backgroundColor: 'color-mix(in srgb, var(--color-error) 16%, transparent)',
                }}
                title="Delete template"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        <div className="relative md:hidden flex items-center gap-1.5" ref={menuRef}>
          {!isSystem && (
            <button
              onClick={() => {
                if (!template.isDefault) {
                  onSetDefault(template._id);
                }
              }}
              className="p-2 rounded-lg transition-colors"
              style={{
                color: '#eab308',
                backgroundColor: 'color-mix(in srgb, #eab308 16%, transparent)',
                border: '1px solid color-mix(in srgb, #eab308 24%, transparent)',
                opacity: template.isDefault ? 0.7 : 1,
              }}
              aria-label={template.isDefault ? 'Default template' : 'Set as default'}
              title={template.isDefault ? 'Default template' : 'Set as default'}
            >
              {template.isDefault ? (
                <StarIconSolid className="w-4 h-4" />
              ) : (
                <StarIcon className="w-4 h-4" />
              )}
            </button>
          )}

          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="p-2 rounded-lg transition-colors"
            style={{
              color: 'var(--color-text-secondary)',
              backgroundColor: 'color-mix(in srgb, var(--color-surface) 66%, transparent)',
              border: '1px solid color-mix(in srgb, var(--color-border) 20%, transparent)',
            }}
            aria-label="Open actions menu"
          >
            <EllipsisVerticalIcon className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 top-11 z-20 min-w-[170px] rounded-xl p-1"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--color-surface-elevated) 92%, transparent)',
                border: '1px solid color-mix(in srgb, var(--color-border) 22%, transparent)',
                boxShadow: '0 16px 36px rgba(0,0,0,0.35)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
              }}
            >
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onView(template);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm"
                style={{ color: 'var(--color-text-primary)' }}
              >
                View Details
              </button>

              {isSystem ? (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onClone(template);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm"
                  style={{ color: 'var(--color-primary)' }}
                >
                  Clone Template
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(template);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm"
                    style={{ color: 'var(--color-info)' }}
                  >
                    Edit Template
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(template._id);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm"
                    style={{ color: 'var(--color-error)' }}
                  >
                    Delete Template
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-1.5 pt-1" style={{ borderTop: '1px solid color-mix(in srgb, var(--color-border) 22%, transparent)' }}>
        {template.fields.slice(0, 3).map((field) => (
          <div key={field.id} className="text-sm truncate">
            <span style={{ color: 'var(--color-text-primary)' }}>{field.label}</span>
            <span className="text-xs ml-2" style={{ color: 'var(--color-text-tertiary)' }}>({field.type})</span>
          </div>
        ))}
        {template.fields.length > 3 && (
          <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
            +{template.fields.length - 3} more fields
          </p>
        )}
      </div>
    </div>
  );
}
