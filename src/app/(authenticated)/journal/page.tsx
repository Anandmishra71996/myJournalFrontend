"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { journalService } from "@/services/journal.service";
import { journalTemplateService } from "@/services/journalTemplate.service";
import { toastService } from "@/services/toast.service";
import DayView from "@/components/journal/DayView";
import WeeklyView from "@/components/journal/WeeklyView";
import MonthlyView from "@/components/journal/MonthlyView";
import PushNotificationPrompt from "@/components/PushNotificationPrompt";
import type { JournalTemplate } from "@/types/journalTemplate.types";

type ViewType = "day" | "weekly" | "monthly";

export default function JournalPage() {
  const [viewType, setViewType] = useState<ViewType>("day");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [journalId, setJournalId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPushPrompt, setShowPushPrompt] = useState(false);
  const [templates, setTemplates] = useState<JournalTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] =
    useState<JournalTemplate | null>(null);
  const [customFieldValues, setCustomFieldValues] = useState<{
    [fieldId: string]: any;
  }>({});
  const [reflection, setReflection] = useState<string>("");
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [templatesLoaded, setTemplatesLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<string>("");
  const isLoadingJournalRef = useRef(false);
  const previousTemplateIdRef = useRef<string>("");

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Wait for templates to load before fetching journal
    if (viewType === "day" && templatesLoaded) {
      loadJournalByDate(selectedDate, selectedTemplateId);
    }
  }, [selectedDate, viewType, templatesLoaded]);

  // Update selected template when template ID changes
  useEffect(() => {
    if (selectedTemplateId) {
      const template = templates.find((t) => t._id === selectedTemplateId);
      setSelectedTemplate(template || null);
    } else {
      setSelectedTemplate(null);
    }
  }, [selectedTemplateId, templates]);

  // Handle template change: save current data and load new template's data
  useEffect(() => {
    // Skip if we're loading a journal from database
    if (isLoadingJournalRef.current) {
      return;
    }

    // Skip on initial mount when previousTemplateIdRef is empty
    if (previousTemplateIdRef.current === "" && selectedTemplateId !== "") {
      previousTemplateIdRef.current = selectedTemplateId;
      return;
    }

    // If template changed, save current data and load new template's data
    if (previousTemplateIdRef.current !== selectedTemplateId) {
      const handleTemplateChange = async () => {
        // Save current data if there's any content
        const hasContent =
          reflection.trim() || Object.keys(customFieldValues).length > 0;
        if (hasContent && journalId) {
          try {
            await saveJournal(false, true); // Silent save
          } catch (error) {
            console.error("Error saving before template change:", error);
          }
        }

        // Update the previous template reference
        previousTemplateIdRef.current = selectedTemplateId;

        // Load journal for the new template + current date
        await loadJournalByDate(selectedDate, selectedTemplateId);
      };

      handleTemplateChange();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTemplateId]);

  const loadTemplates = async () => {
    try {
      const [systemRes, userRes] = await Promise.all([
        journalTemplateService.getSystemTemplates(),
        journalTemplateService.getUserTemplates(),
      ]);

      const allTemplates = [
        ...(systemRes.success ? systemRes.data : []),
        ...(userRes.success ? userRes.data : []),
      ];

      setTemplates(allTemplates);

      // Set default template if available (on initial load)
      const defaultTemplate = allTemplates.find((t) => t.isDefault);
      if (defaultTemplate && selectedTemplateId === "") {
        isLoadingJournalRef.current = true;
        setSelectedTemplateId(defaultTemplate._id);
        previousTemplateIdRef.current = defaultTemplate._id;
        setTimeout(() => {
          isLoadingJournalRef.current = false;
        }, 0);
      }

      setTemplatesLoaded(true);
    } catch (error) {
      console.error("Error loading templates:", error);
      setTemplatesLoaded(true); // Set to true even on error to prevent blocking
    }
  };

  const loadJournalByDate = async (date: Date, templateId?: string) => {
    setLoading(true);
    isLoadingJournalRef.current = true; // Mark as loading from database

    try {
      const response = await journalService.getJournalByDate(date, templateId);
      if (response.success && response.data) {
        const journal = response.data;
        setJournalId(journal._id);
        // Load custom field values
        setCustomFieldValues(journal.customFieldValues || {});
        // Load reflection
        setReflection(journal.reflection || "");
        // Set template if journal has one (handle both populated and non-populated)
        if (journal.templateId) {
          const loadedTemplateId =
            typeof journal.templateId === "string"
              ? journal.templateId
              : journal.templateId._id;
          setSelectedTemplateId(loadedTemplateId);
          previousTemplateIdRef.current = loadedTemplateId;
        } else {
          setSelectedTemplateId("");
          previousTemplateIdRef.current = "";
        }
      } else {
        // Reset form for new entry
        setJournalId(null);
        setCustomFieldValues({});
        setReflection("");
        // Keep the currently selected template for new entries
      }
    } catch (error) {
      console.error("Error loading journal:", error);
    } finally {
      setLoading(false);
      // Reset loading flag after state updates
      setTimeout(() => {
        isLoadingJournalRef.current = false;
      }, 0);
    }
  };

  const saveJournal = async (isComplete = false, isSilent = false) => {
    if (isSilent) {
      setIsSyncing(true);
    } else {
      setSaving(true);
    }

    try {
      const data = {
        date: selectedDate,
        reflection,
        templateId: selectedTemplateId || undefined,
        customFieldValues: customFieldValues,
      };

      // Store current data for comparison
      lastSavedDataRef.current = JSON.stringify(data);

      let response;
      if (journalId) {
        response = await journalService.updateJournal(journalId, data);
      } else {
        response = await journalService.createJournal(data);
        if (response.success && response.data) {
          setJournalId(response.data._id);

          // Check if this is the user's first journal entry
          const hasSeenPrompt = localStorage.getItem(
            "pushNotificationPromptDismissed",
          );
          const isFirstJournal = !hasSeenPrompt;

          if (isFirstJournal && isComplete) {
            // Show push notification prompt after a short delay
            setTimeout(() => {
              setShowPushPrompt(true);
            }, 1000);
          }
        }
      }

      if (response.success) {
        setLastSyncTime(new Date());
        if (!isSilent) {
          const message = isComplete
            ? "Journal saved successfully!"
            : "Draft saved!";
          toastService.success(message);
        }
      }
    } catch (error: any) {
      console.error("Error saving journal:", error);
      if (!isSilent) {
        const errorMessage =
          error.response?.data?.error || "Failed to save journal";
        toastService.error(errorMessage);
      }
    } finally {
      if (isSilent) {
        setIsSyncing(false);
      } else {
        setSaving(false);
      }
    }
  };

  // Manual sync function
  const handleManualSync = useCallback(() => {
    saveJournal(false, true);
  }, []);

  // Auto-save with 10-second interval
  useEffect(() => {
    // Only auto-save for day view
    if (viewType !== "day") return;

    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    // Check if data has changed
    const currentData = JSON.stringify({
      date: selectedDate,
      reflection,
      templateId: selectedTemplateId || undefined,
      customFieldValues: customFieldValues,
    });

    // Only auto-save if there's content and data has changed
    const hasContent =
      reflection.trim() || Object.keys(customFieldValues).length > 0;
    const dataChanged = currentData !== lastSavedDataRef.current;

    if (hasContent && dataChanged) {
      autoSaveTimerRef.current = setTimeout(() => {
        saveJournal(false, true); // Silent auto-save
      }, 10000); // 10 seconds
    }

    // Cleanup on unmount
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [
    reflection,
    customFieldValues,
    selectedDate,
    selectedTemplateId,
    viewType,
  ]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    if (viewType === "day") {
      newDate.setDate(newDate.getDate() + days);
    } else if (viewType === "weekly") {
      newDate.setDate(newDate.getDate() + days * 7);
    } else if (viewType === "monthly") {
      newDate.setMonth(newDate.getMonth() + days);
    }
    setSelectedDate(newDate);
  };

  const getDateDisplay = () => {
    if (viewType === "day") {
      const date = selectedDate;
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } else if (viewType === "weekly") {
      const weekStart = new Date(selectedDate);
      const dayOfWeek = weekStart.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // If Sunday, go back 6 days; otherwise go to Monday
      weekStart.setDate(weekStart.getDate() + diff);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6); // Monday + 6 days = Sunday
      return `${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    } else {
      return selectedDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    }
  };

  const getFullDateDisplay = () => {
    return formatDate(selectedDate);
  };

  const isSelectedDateToday = () => {
    const today = new Date();
    return (
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  };

  const userTemplates = templates.filter((t) => t.createdBy === "user");
  const systemTemplates = templates.filter((t) => t.createdBy === "system");

  const viewTabs: Array<{ key: ViewType; label: string }> = [
    { key: "day", label: "Day" },
    { key: "weekly", label: "Weekly" },
    { key: "monthly", label: "Monthly" },
  ];

  if (loading && viewType === "day") {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--color-background)" }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
            style={{ borderColor: "var(--color-primary)" }}
          ></div>
          <p className="mt-4" style={{ color: "var(--color-text-secondary)" }}>
            Loading journal...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Header with Date Navigation */}
      <header className="sticky top-0 z-20 w-full px-3 sm:px-6 pt-3 sm:pt-4">
        <div className="max-w-6xl mx-auto">
          <div className="px-3 sm:px-5 py-3 sm:py-4 space-y-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="px-0 py-0">
                <p
                  className="text-xl sm:text-4xl font-bold tracking-tight"
                  style={{
                    color: "var(--color-text-primary)",
                    textShadow:
                      viewType === "day" && isSelectedDateToday()
                        ? "0 0 24px color-mix(in srgb, var(--color-primary) 24%, transparent)"
                        : "none",
                  }}
                >
                  {viewType === "day"
                    ? selectedDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : getDateDisplay()}
                </p>
                <p
                  className="text-xs sm:text-sm mt-1 inline-flex items-center gap-1.5"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  <ClockIcon
                    className="w-3.5 h-3.5"
                    style={{ color: "var(--color-primary)" }}
                  />
                  {currentTime.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                {/* Template Selector - Mobile only */}
                {viewType === "day" && templates.length > 0 && (
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => setSelectedTemplateId(e.target.value)}
                    className="md:hidden flex-1 min-w-[170px] px-3 py-2.5 border rounded-xl text-sm font-medium focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor:
                        "color-mix(in srgb, var(--color-surface-elevated) 72%, transparent)",
                      borderColor:
                        "color-mix(in srgb, var(--color-border) 45%, transparent)",
                      color: "var(--color-text-primary)",
                      outlineColor: "var(--color-primary)",
                    }}
                  >
                    <option value="">No Template (Free-flow only)</option>
                    {userTemplates.length > 0 && (
                      <optgroup label="My Templates">
                        {userTemplates.map((template) => (
                          <option key={template._id} value={template._id}>
                            {template.icon ? `${template.icon} ` : ""}
                            {template.name}
                          </option>
                        ))}
                      </optgroup>
                    )}
                    {systemTemplates.length > 0 && (
                      <optgroup label="System Templates">
                        {systemTemplates.map((template) => (
                          <option key={template._id} value={template._id}>
                            {template.icon ? `${template.icon} ` : ""}
                            {template.name}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                )}
                <div className="hidden md:inline-flex items-center gap-5">
                  {viewTabs.map((tab) => {
                    const isActive = viewType === tab.key;
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setViewType(tab.key)}
                        className="pb-1 text-sm font-semibold transition-all border-b-2"
                        style={{
                          borderColor: isActive
                            ? "var(--color-primary)"
                            : "transparent",
                          color: isActive
                            ? "var(--color-primary)"
                            : "var(--color-text-secondary)",
                        }}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => changeDate(-1)}
                  className="p-2.5 rounded-xl transition-colors"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--color-surface-elevated) 55%, transparent)",
                  }}
                  title={
                    viewType === "day"
                      ? "Previous day"
                      : viewType === "weekly"
                        ? "Previous week"
                        : "Previous month"
                  }
                >
                  <ChevronLeftIcon
                    className="w-5 h-5"
                    style={{ color: "var(--color-text-secondary)" }}
                  />
                </button>
                <div
                  className="text-center min-w-[126px] flex-1 rounded-xl px-2 py-2 md:hidden"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--color-surface-elevated) 60%, transparent)",
                  }}
                >
                  <p
                    className="text-xs sm:text-sm font-medium"
                    style={{ color: "var(--color-text-primary)" }}
                    title={
                      viewType === "day" ? getFullDateDisplay() : undefined
                    }
                  >
                    {getDateDisplay()}
                  </p>
                </div>
                <button
                  onClick={() => changeDate(1)}
                  className="p-2.5 rounded-xl transition-colors"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--color-surface-elevated) 55%, transparent)",
                  }}
                  title={
                    viewType === "day"
                      ? "Next day"
                      : viewType === "weekly"
                        ? "Next week"
                        : "Next month"
                  }
                >
                  <ChevronRightIcon
                    className="w-5 h-5"
                    style={{ color: "var(--color-text-secondary)" }}
                  />
                </button>
                <button
                  onClick={() => setSelectedDate(new Date())}
                  className="px-3.5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-colors"
                  style={{
                    backgroundColor:
                      "color-mix(in srgb, var(--color-primary) 18%, transparent)",
                    color: "var(--color-primary)",
                  }}
                >
                  Today
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-3 sm:px-6 py-5 sm:py-7 pb-28 md:pb-7">
        {viewType === "day" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            <aside className="hidden lg:block lg:col-span-3 lg:sticky lg:top-24 space-y-4">
              <section className="rounded-2xl p-0">
                <h2
                  className="text-sm font-semibold mb-3"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Templates
                </h2>
                <div
                  className="space-y-2 max-h-[calc(100vh-20rem)] overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  <button
                    onClick={() => setSelectedTemplateId("")}
                    className="w-full text-left rounded-2xl px-4 py-3.5 transition-all"
                    style={{
                      backgroundColor:
                        selectedTemplateId === ""
                          ? "color-mix(in srgb, var(--color-surface-elevated) 88%, var(--color-primary) 12%)"
                          : "color-mix(in srgb, var(--color-surface-elevated) 78%, transparent)",
                      color:
                        selectedTemplateId === ""
                          ? "var(--color-text-primary)"
                          : "var(--color-text-secondary)",
                      borderLeft:
                        selectedTemplateId === ""
                          ? "3px solid var(--color-primary)"
                          : "3px solid transparent",
                      boxShadow:
                        selectedTemplateId === ""
                          ? "0 0 0 1px color-mix(in srgb, var(--color-primary) 22%, transparent), 0 10px 24px rgba(0, 0, 0, 0.28)"
                          : "0 8px 20px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <p className="text-sm font-medium">Free-flow Journal</p>
                    <p
                      className="text-xs mt-1"
                      style={{ color: "var(--color-text-tertiary)" }}
                    >
                      Write without a template
                    </p>
                  </button>

                  {[...userTemplates].map((template) => {
                    const isActive = selectedTemplateId === template._id;
                    return (
                      <button
                        key={template._id}
                        onClick={() => setSelectedTemplateId(template._id)}
                        className="w-full text-left rounded-2xl px-4 py-3.5 transition-all"
                        style={{
                          backgroundColor: isActive
                            ? "color-mix(in srgb, var(--color-surface-elevated) 88%, var(--color-primary) 12%)"
                            : "color-mix(in srgb, var(--color-surface-elevated) 78%, transparent)",
                          color: isActive
                            ? "var(--color-text-primary)"
                            : "var(--color-text-secondary)",
                          borderLeft: isActive
                            ? "3px solid var(--color-primary)"
                            : "3px solid transparent",
                          boxShadow: isActive
                            ? "0 0 0 1px color-mix(in srgb, var(--color-primary) 22%, transparent), 0 10px 24px rgba(0, 0, 0, 0.28)"
                            : "0 8px 20px rgba(0, 0, 0, 0.2)",
                        }}
                      >
                        <p className="text-sm font-medium truncate">
                          {template.icon ? `${template.icon} ` : ""}
                          {template.name}
                        </p>
                        <p
                          className="text-xs mt-1 line-clamp-2"
                          style={{ color: "var(--color-text-tertiary)" }}
                        >
                          {template.description ||
                            "Structured journaling template"}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </section>
            </aside>

            <section className="lg:col-span-9">
              <DayView
                saving={saving}
                journalId={journalId}
                saveJournal={saveJournal}
                selectedTemplate={selectedTemplate}
                customFieldValues={customFieldValues}
                setCustomFieldValues={setCustomFieldValues}
                reflection={reflection}
                setReflection={setReflection}
                lastSyncTime={lastSyncTime}
                isSyncing={isSyncing}
                onManualSync={handleManualSync}
              />
            </section>
          </div>
        )}

        {viewType === "weekly" && <WeeklyView selectedDate={selectedDate} />}

        {viewType === "monthly" && (
          <MonthlyView
            selectedDate={selectedDate}
            onDateClick={(date) => {
              setSelectedDate(date);
              setViewType("day");
            }}
          />
        )}
      </main>

      {/* Push Notification Prompt */}
      {showPushPrompt && (
        <PushNotificationPrompt onClose={() => setShowPushPrompt(false)} />
      )}

      {/* Bottom submenu (mobile) */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden px-4 pt-3 pb-7"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--color-surface-elevated) 92%, transparent)",
          backdropFilter: "blur(16px)",
          borderTop:
            "1px solid color-mix(in srgb, var(--color-border) 55%, transparent)",
        }}
      >
        <div className="max-w-sm mx-auto grid grid-cols-3 gap-2">
          {viewTabs.map((tab) => {
            const isActive = viewType === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setViewType(tab.key)}
                className="py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  backgroundColor: isActive
                    ? "color-mix(in srgb, var(--color-primary) 18%, transparent)"
                    : "transparent",
                  color: isActive
                    ? "var(--color-primary)"
                    : "var(--color-text-secondary)",
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
