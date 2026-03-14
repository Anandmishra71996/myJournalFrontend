'use client';

import { XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';
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

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full p-6 my-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <SparklesIcon className="w-6 h-6 text-indigo-500" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            {isExisting ? 'Existing Template Found' : 'Template Generated'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <XMarkIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Result banner */}
                <div
                    className={`p-4 rounded-lg mb-5 text-sm ${
                        isExisting
                            ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-300'
                            : 'bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 text-indigo-800 dark:text-indigo-300'
                    }`}
                >
                    {result.message}
                </div>

                {/* Template preview */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden mb-5">
                    <div className="bg-gray-50 dark:bg-gray-700/50 px-5 py-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{template.icon || '📝'}</span>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">
                                    {template.name}
                                </h3>
                                {template.description && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                        {template.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {template.fields.map((field, idx) => (
                            <div key={field.id} className="px-5 py-3 flex items-center gap-4">
                                <span className="text-xs text-gray-400 w-5 shrink-0">
                                    {idx + 1}
                                </span>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                        {field.label}
                                        {field.required && (
                                            <span className="ml-1 text-red-500 text-xs">*</span>
                                        )}
                                    </p>
                                    {field.placeholder && (
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {field.placeholder}
                                        </p>
                                    )}
                                </div>
                                <span className="text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-1 rounded-full shrink-0">
                                    {field.type}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                    >
                        Discard
                    </button>
                    <div className="flex-1 flex gap-3 justify-end">
                        {isExisting ? (
                            <>
                                <button
                                    type="button"
                                    onClick={() => onReviewAndEdit(template)}
                                    className="px-4 py-2.5 border border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors font-medium"
                                >
                                    Edit a Copy
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onUseExisting(template)}
                                    className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                                >
                                    Use This Template
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={() => onReviewAndEdit(template)}
                                className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                            >
                                Review &amp; Edit
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
