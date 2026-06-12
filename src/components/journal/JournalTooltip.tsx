'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Journal } from '@/types/journal.types';
import type { JournalTemplate, TemplateField } from '@/types/journalTemplate.types';

interface JournalTooltipProps {
  journal: Journal | null;
  anchorRef: React.RefObject<HTMLElement | null>;
  open: boolean;
  onClose: () => void;
  onOpenFullView?: (date: Date) => void;
}

const MAX_REFLECTION_CHARS = 320;
const MAX_FIELDS_PREVIEWED = 4;
const PADDING = 10;
const TOOLTIP_WIDTH = 340;

function truncate(text: string, max: number) {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max).trimEnd()}…`;
}

function formatFieldValue(field: TemplateField, value: any): string | null {
  if (value === undefined || value === null || value === '') return null;
  if (Array.isArray(value)) {
    const flat = value.filter((v) => v !== undefined && v !== null && v !== '').join(', ');
    return flat || null;
  }
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (field.type === 'rating' && typeof value === 'number') {
    const max = field.max ?? 10;
    return `${value}/${max}`;
  }
  return String(value);
}

export default function JournalTooltip({
  journal,
  anchorRef,
  open,
  onClose,
  onOpenFullView,
}: JournalTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!open || !anchorRef.current) {
      setCoords(null);
      return;
    }

    const updatePosition = () => {
      const anchor = anchorRef.current;
      if (!anchor) return;
      const rect = anchor.getBoundingClientRect();
      const tooltipHeight = tooltipRef.current?.offsetHeight ?? 240;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let left = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2;
      left = Math.min(Math.max(left, PADDING), viewportWidth - TOOLTIP_WIDTH - PADDING);

      let top = rect.bottom + 8;
      if (top + tooltipHeight + PADDING > viewportHeight) {
        top = rect.top - tooltipHeight - 8;
        if (top < PADDING) {
          top = Math.max(PADDING, viewportHeight - tooltipHeight - PADDING);
        }
      }

      setCoords({ top, left });
    };

    updatePosition();

    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [open, anchorRef, journal]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!mounted || !open || !journal) return null;

  const template =
    journal.templateId && typeof journal.templateId !== 'string'
      ? (journal.templateId as JournalTemplate)
      : null;

  const templateFields: TemplateField[] = template?.fields
    ? [...template.fields].sort((a, b) => a.order - b.order)
    : [];

  const populatedFields = templateFields
    .map((field) => ({ field, value: formatFieldValue(field, journal.customFieldValues?.[field.id]) }))
    .filter((row) => row.value !== null)
    .slice(0, MAX_FIELDS_PREVIEWED);

  const reflectionText = journal.reflection?.trim() || '';
  const voiceCount = journal.voiceRecordings?.length ?? 0;
  const journalDate = new Date(journal.date);

  const tooltipNode = (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-[60]"
        style={{ background: 'transparent' }}
        aria-hidden="true"
      />
      <div
        ref={tooltipRef}
        role="dialog"
        className="fixed z-[70] rounded-2xl p-4 shadow-2xl"
        style={{
          top: coords?.top ?? -9999,
          left: coords?.left ?? -9999,
          width: TOOLTIP_WIDTH,
          backgroundColor: 'var(--color-surface-elevated)',
          border: '1px solid color-mix(in srgb, var(--color-border) 40%, transparent)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.45)',
          color: 'var(--color-text-primary)',
          visibility: coords ? 'visible' : 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <p
              className="text-[11px] uppercase tracking-[0.16em] font-semibold"
              style={{ color: 'var(--color-primary)' }}
            >
              {journalDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </p>
            <p className="text-base font-semibold mt-0.5">
              {template?.icon ? `${template.icon} ` : ''}
              {template?.name || 'Free-flow entry'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 transition-colors"
            style={{ color: 'var(--color-text-tertiary)' }}
            aria-label="Close"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {reflectionText ? (
          <div className="mb-3">
            <p
              className="text-[10px] uppercase tracking-[0.14em] font-semibold mb-1"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              Reflection
            </p>
            <p className="text-sm leading-5" style={{ color: 'var(--color-text-secondary)' }}>
              {truncate(reflectionText, MAX_REFLECTION_CHARS)}
            </p>
          </div>
        ) : (
          <p className="text-sm italic mb-3" style={{ color: 'var(--color-text-tertiary)' }}>
            No reflection text for this day.
          </p>
        )}

        {populatedFields.length > 0 && (
          <div className="mb-3">
            <p
              className="text-[10px] uppercase tracking-[0.14em] font-semibold mb-2"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              Template Answers
            </p>
            <ul className="space-y-1.5">
              {populatedFields.map(({ field, value }) => (
                <li key={field.id} className="flex gap-2 text-sm">
                  <span
                    className="flex-shrink-0 font-medium"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {field.label}:
                  </span>
                  <span className="leading-5" style={{ color: 'var(--color-text-secondary)' }}>
                    {truncate(value!, 90)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {(voiceCount > 0 || (journal.tags?.length ?? 0) > 0) && (
          <div
            className="flex flex-wrap items-center gap-2 pt-3 mb-3"
            style={{ borderTop: '1px solid color-mix(in srgb, var(--color-border) 26%, transparent)' }}
          >
            {voiceCount > 0 && (
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--color-primary) 14%, transparent)',
                  color: 'var(--color-primary)',
                }}
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 11-14 0M12 18v3m0 0H8m4 0h4M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3z" />
                </svg>
                {voiceCount} voice {voiceCount === 1 ? 'note' : 'notes'}
              </span>
            )}
            {journal.tags?.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full px-2.5 py-1 text-xs"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--color-surface) 70%, transparent)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {onOpenFullView && (
          <button
            onClick={() => {
              onOpenFullView(journalDate);
              onClose();
            }}
            className="w-full rounded-lg px-3 py-2 text-sm font-semibold transition-colors"
            style={{
              background:
                'linear-gradient(135deg, color-mix(in srgb, var(--color-primary-dark) 88%, transparent), var(--color-primary))',
              color: '#ffffff',
            }}
          >
            Open full journal
          </button>
        )}
      </div>
    </>
  );

  return createPortal(tooltipNode, document.body);
}
