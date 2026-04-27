"use client";

import { useState, useEffect, useCallback } from "react";
import {
  XMarkIcon,
  StarIcon as StarOutline,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { toast } from "sonner";
import {
  ContentType,
  SectionFeedback,
  AiFeedback,
  FEEDBACK_SECTIONS_UI,
} from "@/constants/aiFeedback.constants";
import { journalService } from "@/services/journal.service";

interface AiFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentType: ContentType;
  contentId: string;
  /** Optional context date (e.g. weekStart for insights) stored for reporting. */
  contextDate?: string;
  /** Pre-loaded feedback to populate the form (e.g. after quick rating). */
  initialFeedback?: AiFeedback | null;
  onFeedbackSaved?: (feedback: AiFeedback) => void;
}

function StarPicker({
  value,
  onChange,
}: {
  value: number | undefined;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = (hovered ?? value ?? 0) >= star;
        return (
          <button
            key={star}
            type="button"
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(null)}
            className="rounded p-0.5 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          >
            {filled ? (
              <StarSolid className="h-5 w-5 text-[var(--color-secondary)]" />
            ) : (
              <StarOutline className="h-5 w-5 text-[var(--color-text-tertiary)]" />
            )}
          </button>
        );
      })}
    </div>
  );
}

export default function AiFeedbackModal({
  isOpen,
  onClose,
  contentType,
  contentId,
  contextDate,
  initialFeedback,
  onFeedbackSaved,
}: AiFeedbackModalProps) {
  const sections = FEEDBACK_SECTIONS_UI[contentType] ?? [];

  // Keyed state: section key → { rating?, comment? }
  const [sectionState, setSectionState] = useState<
    Record<string, { rating?: number; comment: string }>
  >({});
  const [submitting, setSubmitting] = useState(false);

  // Populate from initialFeedback whenever it changes or modal opens
  useEffect(() => {
    if (!isOpen) return;

    const next: Record<string, { rating?: number; comment: string }> = {};
    for (const sec of sections) {
      const existing = initialFeedback?.sections?.find(
        (s) => s.key === sec.key,
      );
      next[sec.key] = {
        rating: existing?.rating,
        comment: existing?.comment ?? "",
      };
    }

    // Seed overall rating from quickRating if no explicit rating yet
    if (
      initialFeedback?.quickRating &&
      next["overall"] &&
      !next["overall"].rating
    ) {
      next["overall"] = {
        ...next["overall"],
        rating: initialFeedback.quickRating,
      };
    }

    setSectionState(next);
  }, [isOpen, initialFeedback]);

  const handleRating = useCallback((key: string, rating: number) => {
    setSectionState((prev) => ({
      ...prev,
      [key]: { ...prev[key], rating },
    }));
  }, []);

  const handleComment = useCallback((key: string, comment: string) => {
    setSectionState((prev) => ({
      ...prev,
      [key]: { ...prev[key], comment },
    }));
  }, []);

  const handleSubmit = async () => {
    const filledSections: SectionFeedback[] = Object.entries(sectionState)
      .filter(([, v]) => v.rating !== undefined || v.comment.trim() !== "")
      .map(([key, v]) => ({
        key,
        rating: v.rating,
        comment: v.comment.trim() || undefined,
      }));

    if (filledSections.length === 0) {
      toast.error("Please rate or comment on at least one section");
      return;
    }

    setSubmitting(true);
    try {
      const res = await journalService.submitAiFeedback(
        contentType,
        contentId,
        {
          sections: filledSections,
          contextDate,
        },
      );
      toast.success("Feedback saved — thank you!");
      onFeedbackSaved?.(res.data);
      onClose();
    } catch {
      toast.error("Failed to save feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl bg-[var(--color-surface-low)] outline outline-1 outline-[color:color-mix(in_srgb,var(--color-outline-variant)_20%,transparent)] shadow-2xl">
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-[color:color-mix(in_srgb,var(--color-outline-variant)_15%,transparent)] px-5 py-4">
          <div>
            <h2
              id="feedback-modal-title"
              className="text-lg font-bold text-[var(--color-text-primary)]"
            >
              Rate this Insight
            </h2>
            <p className="mt-0.5 text-xs text-[var(--color-text-tertiary)]">
              Your feedback helps improve AI accuracy
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close feedback"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-high)] disabled:opacity-50"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable section cards */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {sections.map((sec) => {
            const state = sectionState[sec.key] ?? { comment: "" };
            const charCount = state.comment.length;

            return (
              <div
                key={sec.key}
                className="rounded-xl bg-[var(--color-surface-high)] p-4 outline outline-1 outline-[color:color-mix(in_srgb,var(--color-outline-variant)_12%,transparent)]"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                    {sec.label}
                  </span>
                  <StarPicker
                    value={state.rating}
                    onChange={(v) => handleRating(sec.key, v)}
                  />
                </div>
                <textarea
                  rows={2}
                  value={state.comment}
                  onChange={(e) => handleComment(sec.key, e.target.value)}
                  maxLength={500}
                  placeholder={sec.placeholder}
                  className="w-full resize-none rounded-lg bg-[var(--color-surface-low)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] outline outline-1 outline-[color:color-mix(in_srgb,var(--color-outline-variant)_20%,transparent)] transition-colors focus:outline-[var(--color-primary)] focus:ring-0 focus-visible:outline-2"
                />
                <p className="mt-1 text-right text-[10px] text-[var(--color-text-tertiary)]">
                  {charCount}/500
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex flex-shrink-0 items-center justify-end gap-3 border-t border-[color:color-mix(in_srgb,var(--color-outline-variant)_15%,transparent)] px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-xl px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-high)] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-xl bg-gradient-to-br from-[var(--color-primary-dark)] to-[var(--color-primary)] px-5 py-2 text-sm font-bold text-[var(--color-goal-cta-text)] shadow-[0_4px_14px_color-mix(in_srgb,var(--color-primary-dark)_25%,transparent)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Saving…" : "Submit Feedback"}
          </button>
        </div>
      </div>
    </div>
  );
}
