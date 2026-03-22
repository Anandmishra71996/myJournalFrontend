'use client';

import {
    CheckCircleIcon,
    SparklesIcon,
    StarIcon,
    Bars3BottomLeftIcon,
    TagIcon,
} from '@heroicons/react/24/outline';
import { TemplateGenerationResult } from '@/services/aiTemplate.service';
import type { JournalTemplate } from '@/types/journalTemplate.types';

interface AITemplateResultModalProps {
    result: TemplateGenerationResult;
    onClose: () => void;
    /** Review/edit the template in the editor */
    onReviewAndEdit: (template: JournalTemplate) => void;
    /** Use an existing template directly (clone or set as default) */
    onUseExisting: (template: JournalTemplate) => void;
}

export default function AITemplateResultModal({
    result,
    onClose,
    onReviewAndEdit,
    onUseExisting,
}: AITemplateResultModalProps) {
    const template = result.template as JournalTemplate;
    const isExisting = result.type === 'existing';

    const getFieldIcon = (fieldType: string) => {
        switch (fieldType) {
            case 'rating':
                return <StarIcon className="w-4 h-4" />;
            case 'textarea':
            case 'text':
                return <Bars3BottomLeftIcon className="w-4 h-4" />;
            case 'multi-select':
            case 'tags':
                return <TagIcon className="w-4 h-4" />;
            case 'boolean':
                return <CheckCircleIcon className="w-4 h-4" />;
            default:
                return <SparklesIcon className="w-4 h-4" />;
        }
    };

    return (
        <div
            className="fixed inset-0 z-[75] overflow-y-auto p-0 md:p-8"
            style={{
                backgroundColor: 'color-mix(in srgb, var(--color-background) 64%, transparent)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
            }}
        >
            <div className="max-w-3xl mx-auto min-h-[100dvh] md:min-h-0 py-5 px-4 md:py-8 md:px-0">
                <section className="mb-6 md:mb-8 text-center">
                    <div className="inline-flex items-center justify-center h-14 w-14 rounded-full relative">
                        <div
                            className="absolute inset-0 rounded-full"
                            style={{
                                backgroundColor: 'color-mix(in srgb, var(--color-primary) 26%, transparent)',
                                filter: 'blur(6px)',
                            }}
                        />
                        <span
                            className="relative h-10 w-10 rounded-full flex items-center justify-center"
                            style={{
                                backgroundColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)',
                            }}
                        >
                            <CheckCircleIcon className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
                        </span>
                    </div>
                    <h2 className="mt-4 text-[1.75rem] md:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
                        {isExisting ? 'Matching Template Found' : 'Template Generated'}
                    </h2>
                    <p className="mt-2 text-sm md:text-base" style={{ color: 'var(--color-text-secondary)' }}>
                        {isExisting ? result.message : `Your template "${template.name}" has been generated and saved.`}
                    </p>
                </section>

                <div
                    className="rounded-2xl md:rounded-2xl p-4 md:p-7"
                    style={{
                        backgroundColor: 'color-mix(in srgb, var(--color-surface-elevated) 70%, transparent)',
                        border: '1px solid color-mix(in srgb, var(--color-border) 16%, transparent)',
                        boxShadow: '0 26px 60px rgba(0, 0, 0, 0.42)',
                    }}
                >
                    <div className="mb-6 md:mb-8 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                            <h3 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
                                {template.name}
                            </h3>
                            {template.description && (
                                <p className="mt-2 max-w-xl text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                                    {template.description}
                                </p>
                            )}
                        </div>
                        <span
                            className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
                            style={{
                                color: 'var(--color-primary)',
                                backgroundColor: 'color-mix(in srgb, var(--color-primary) 16%, transparent)',
                                border: '1px solid color-mix(in srgb, var(--color-primary) 20%, transparent)',
                            }}
                        >
                            {isExisting ? 'Existing Match' : 'AI Crafted'}
                        </span>
                    </div>

                    <div className="space-y-3">
                        <p className="text-[11px] uppercase tracking-[0.18em] font-semibold" style={{ color: 'var(--color-text-tertiary)' }}>
                            Configured Fields
                        </p>
                        {template.fields.map((field) => (
                            <div
                                key={field.id}
                                className="group flex items-center justify-between rounded-xl px-4 py-3"
                                style={{
                                    backgroundColor:
                                        'color-mix(in srgb, var(--color-surface) 58%, var(--color-surface-elevated))',
                                    border: '1px solid color-mix(in srgb, var(--color-border) 12%, transparent)',
                                }}
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <span
                                        className="h-8 w-8 shrink-0 rounded-lg flex items-center justify-center"
                                        style={{
                                            color: 'var(--color-primary)',
                                            backgroundColor:
                                                'color-mix(in srgb, var(--color-primary) 14%, transparent)',
                                        }}
                                    >
                                        {getFieldIcon(field.type)}
                                    </span>
                                    <p
                                        className="text-sm font-medium truncate"
                                        style={{ color: 'var(--color-text-primary)' }}
                                        title={field.label}
                                    >
                                        {field.label}
                                        {field.required && (
                                            <span className="ml-1" style={{ color: 'var(--color-error)' }}>*</span>
                                        )}
                                    </p>
                                </div>
                                <span
                                    className="ml-2 shrink-0 rounded-md px-2 py-1 text-[10px] uppercase tracking-[0.08em]"
                                    style={{
                                        color: 'var(--color-text-tertiary)',
                                        backgroundColor: 'color-mix(in srgb, var(--color-surface-elevated) 78%, transparent)',
                                        border: '1px solid color-mix(in srgb, var(--color-border) 18%, transparent)',
                                    }}
                                >
                                    {field.type}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-7 md:mt-8 flex flex-col-reverse gap-3 md:flex-row md:items-center">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full md:w-auto px-5 py-2.5 rounded-xl font-medium"
                            style={{ color: 'var(--color-text-secondary)' }}
                        >
                            Discard
                        </button>

                        <div className="w-full md:ml-auto md:w-auto flex flex-col sm:flex-row gap-3">
                            {isExisting && (
                                <button
                                    type="button"
                                    onClick={() => onUseExisting(template)}
                                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-medium"
                                    style={{
                                        color: 'var(--color-primary)',
                                        backgroundColor:
                                            'color-mix(in srgb, var(--color-primary) 14%, transparent)',
                                        border: '1px solid color-mix(in srgb, var(--color-primary) 20%, transparent)',
                                    }}
                                >
                                    Use This Template
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={() => onReviewAndEdit(template)}
                                className="w-full sm:min-w-[180px] inline-flex items-center justify-center gap-2 px-5 py-3 md:py-2.5 rounded-xl font-semibold text-white"
                                style={{
                                    background:
                                        'linear-gradient(135deg, color-mix(in srgb, var(--color-primary-dark) 90%, transparent), var(--color-primary))',
                                    boxShadow: '0 12px 28px color-mix(in srgb, var(--color-primary-dark) 34%, transparent)',
                                }}
                            >
                                Review &amp; Edit
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-5 md:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                        className="rounded-xl px-4 py-3"
                        style={{
                            backgroundColor: 'color-mix(in srgb, var(--color-surface-elevated) 72%, transparent)',
                            border: '1px solid color-mix(in srgb, var(--color-border) 14%, transparent)',
                        }}
                    >
                        <span className="block text-[10px] uppercase tracking-[0.16em] mb-1" style={{ color: 'var(--color-text-tertiary)' }}>
                            Generated At
                        </span>
                        <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, Today
                        </span>
                    </div>
                    <div
                        className="rounded-xl px-4 py-3"
                        style={{
                            backgroundColor: 'color-mix(in srgb, var(--color-surface-elevated) 72%, transparent)',
                            border: '1px solid color-mix(in srgb, var(--color-border) 14%, transparent)',
                        }}
                    >
                        <span className="block text-[10px] uppercase tracking-[0.16em] mb-1" style={{ color: 'var(--color-text-tertiary)' }}>
                            Model Used
                        </span>
                        <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                            Archive-A1 Obsidian
                        </span>
                    </div>
                </div>

                <footer
                    className="mt-4 md:mt-5 flex items-center justify-between text-xs px-1"
                    style={{ color: 'var(--color-text-tertiary)' }}
                >
                    <div className="inline-flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
                        Reviewing Template Output
                    </div>
                    <div className="inline-flex items-center gap-4">
                        <span>Privacy</span>
                        <span>Terms</span>
                    </div>
                </footer>
            </div>
        </div>
    );
}
