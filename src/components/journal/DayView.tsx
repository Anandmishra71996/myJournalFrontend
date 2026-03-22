"use client";

import DynamicField from "./DynamicField";
import type { JournalTemplate } from "@/types/journalTemplate.types";

interface DayViewProps {
  saving: boolean;
  journalId: string | null;
  saveJournal: (isComplete: boolean) => Promise<void>;
  selectedTemplate: JournalTemplate | null;
  customFieldValues: { [fieldId: string]: any };
  setCustomFieldValues: React.Dispatch<
    React.SetStateAction<{ [fieldId: string]: any }>
  >;
  reflection: string;
  setReflection: React.Dispatch<React.SetStateAction<string>>;
  lastSyncTime?: Date | null;
  isSyncing?: boolean;
  onManualSync?: () => void;
}

export default function DayView({
  saving,
  journalId,
  saveJournal,
  selectedTemplate,
  customFieldValues,
  setCustomFieldValues,
  reflection,
  setReflection,
  lastSyncTime,
  isSyncing = false,
  onManualSync,
}: DayViewProps) {
  const handleCustomFieldChange = (fieldId: string, value: any) => {
    setCustomFieldValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  // Format last sync time
  const getLastSyncText = () => {
    if (!lastSyncTime) return "Not synced";
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastSyncTime.getTime()) / 1000);

    if (diff < 10) return "Just now";
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return lastSyncTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get sorted template fields
  const templateFields =
    selectedTemplate?.fields?.sort((a, b) => a.order - b.order) || [];

  return (
    <>
      {/* Today's Reflection Section */}
      <section
        className="rounded-2xl p-6 md:p-8"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--color-surface-elevated) 78%, transparent)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.35)",
          border:
            "1px solid color-mix(in srgb, var(--color-border) 22%, transparent)",
        }}
      >
        <div className="mb-6">
          <h2
            className="text-2xl font-bold mb-2"
            style={{ color: "var(--color-text-primary)" }}
          >
            {selectedTemplate?.icon || "📝"}{" "}
            {selectedTemplate?.name || "Today's Journal"}
          </h2>
          <p style={{ color: "var(--color-text-secondary)" }}>
            {selectedTemplate?.description ||
              "Select a template to begin journaling"}
          </p>
        </div>

        <div className="space-y-6">
          {/* Free-flow reflection field - always shown */}
          <div>
            {/* <label htmlFor="reflection" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              What happened today? ✨
            </label> */}
            <textarea
              id="reflection"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Write freely about your day, thoughts, feelings, or anything on your mind..."
              rows={6}
              className="w-full px-4 py-3 rounded-xl text-base transition-colors resize-none focus:outline-none focus:ring-2"
              style={{
                border:
                  "1px solid color-mix(in srgb, var(--color-border) 26%, transparent)",
                backgroundColor:
                  "color-mix(in srgb, var(--color-background) 60%, transparent)",
                color: "var(--color-text-primary)",
                boxShadow:
                  "inset 0 0 0 1px color-mix(in srgb, var(--color-border) 12%, transparent)",
              }}
            />
          </div>

          {/* Template-specific fields */}
          {templateFields.length > 0 ? (
            <>
              <div
                className="pt-6"
                style={{
                  borderTop:
                    "1px solid color-mix(in srgb, var(--color-border) 18%, transparent)",
                }}
              >
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: "var(--color-primary)" }}
                >
                  Template Questions
                </h3>
              </div>
              {templateFields.map((field) => (
                <DynamicField
                  key={field.id}
                  field={field}
                  value={customFieldValues[field.id]}
                  onChange={handleCustomFieldChange}
                />
              ))}
            </>
          ) : (
            <div className="text-center py-12">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--color-primary) 18%, transparent)",
                }}
              >
                <svg
                  className="w-8 h-8"
                  style={{ color: "var(--color-primary)" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: "var(--color-text-primary)" }}
              >
                No Template Selected
              </h3>
              <p
                className="max-w-md mx-auto"
                style={{ color: "var(--color-text-secondary)" }}
              >
                You can still journal in the free-flow section above, or select
                a template for additional structured questions.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Save Button */}
      <div className="flex flex-col xs:flex-row justify-between items-center gap-3 pb-8 mt-6 xs:mt-8">
        {/* Sync Status */}
        <div
          className="flex items-center gap-2 text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {isSyncing ? (
            <>
              <div
                className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent"
                style={{
                  borderColor: "var(--color-primary)",
                  borderTopColor: "transparent",
                }}
              ></div>
              <span>Syncing...</span>
            </>
          ) : (
            <>
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>{getLastSyncText()}</span>
              {onManualSync && (
                <button
                  onClick={onManualSync}
                  disabled={isSyncing}
                  className="ml-2 hover:underline disabled:opacity-50"
                  style={{ color: "var(--color-primary)" }}
                  title="Sync now"
                >
                  Sync now
                </button>
              )}
            </>
          )}
        </div>

        {/* Save Button */}
        <button
          onClick={() => saveJournal(true)}
          disabled={saving}
          className="w-full xs:w-auto px-8 py-3 text-white font-semibold rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in srgb, var(--color-primary-dark) 85%, transparent), var(--color-primary))",
          }}
        >
          {saving ? "Saving..." : journalId ? "Update" : "Save"}
        </button>
      </div>
    </>
  );
}
