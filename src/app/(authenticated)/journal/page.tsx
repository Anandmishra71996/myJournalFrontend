'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { journalService } from '@/services/journal.service';
import { journalTemplateService } from '@/services/journalTemplate.service';
import { toastService } from '@/services/toast.service';
import DayView from '@/components/journal/DayView';
import WeeklyView from '@/components/journal/WeeklyView';
import MonthlyView from '@/components/journal/MonthlyView';
import PushNotificationPrompt from '@/components/PushNotificationPrompt';
import type { JournalTemplate } from '@/types/journalTemplate.types';

type ViewType = 'day' | 'weekly' | 'monthly';

export default function JournalPage() {
  const [viewType, setViewType] = useState<ViewType>('day');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [journalId, setJournalId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPushPrompt, setShowPushPrompt] = useState(false);
  const [templates, setTemplates] = useState<JournalTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<JournalTemplate | null>(null);
  const [customFieldValues, setCustomFieldValues] = useState<{ [fieldId: string]: any }>({});
  const [reflection, setReflection] = useState<string>('');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<string>('');

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    if (viewType === 'day') {
      loadJournalByDate(selectedDate);
    }
  }, [selectedDate, viewType]);

  // Update selected template when template ID changes
  useEffect(() => {
    if (selectedTemplateId) {
      const template = templates.find(t => t._id === selectedTemplateId);
      setSelectedTemplate(template || null);
    } else {
      setSelectedTemplate(null);
    }
  }, [selectedTemplateId, templates]);

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

      // Set default template if available
      const defaultTemplate = allTemplates.find(t => t.isDefault);
      if (defaultTemplate) {
        setSelectedTemplateId(defaultTemplate._id);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const loadJournalByDate = async (date: Date) => {
    setLoading(true);
    try {
      const response = await journalService.getJournalByDate(date);
      if (response.success && response.data) {
        const journal = response.data;
        setJournalId(journal._id);
        // Load custom field values
        setCustomFieldValues(journal.customFieldValues || {});
        // Load reflection
        setReflection(journal.reflection || '');
        // Set template if journal has one
        if (journal.templateId) {
          setSelectedTemplateId(journal.templateId);
        }
      } else {
        // Reset form for new entry
        setJournalId(null);
        setCustomFieldValues({});
        setReflection('');
      }
    } catch (error) {
      console.error('Error loading journal:', error);
    } finally {
      setLoading(false);
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
          const hasSeenPrompt = localStorage.getItem('pushNotificationPromptDismissed');
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
          const message = isComplete ? 'Journal saved successfully!' : 'Draft saved!';
          toastService.success(message);
        }
      }
    } catch (error: any) {
      console.error('Error saving journal:', error);
      if (!isSilent) {
        const errorMessage = error.response?.data?.error || 'Failed to save journal';
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
    if (viewType !== 'day') return;

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
    const hasContent = reflection.trim() || Object.keys(customFieldValues).length > 0;
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
  }, [reflection, customFieldValues, selectedDate, selectedTemplateId, viewType]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    if (viewType === 'day') {
      newDate.setDate(newDate.getDate() + days);
    } else if (viewType === 'weekly') {
      newDate.setDate(newDate.getDate() + (days * 7));
    } else if (viewType === 'monthly') {
      newDate.setMonth(newDate.getMonth() + days);
    }
    setSelectedDate(newDate);
  };

  const getDateDisplay = () => {
    if (viewType === 'day') {
      const date = selectedDate;
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } else if (viewType === 'weekly') {
      const weekStart = new Date(selectedDate);
      const dayOfWeek = weekStart.getDay();
      weekStart.setDate(weekStart.getDate() - dayOfWeek);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else {
      return selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
  };

  const getFullDateDisplay = () => {
    return formatDate(selectedDate);
  };

  if (loading && viewType === 'day') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading journal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-x-hidden">
      {/* Header with Date Navigation */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 w-full">
        <div className="max-w-5xl mx-auto px-2 sm:px-4 py-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <img src="/logo.svg" alt="Journal Logo" className="w-8 h-8 sm:w-10 sm:h-10" />
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                My Journal
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
              {/* Template Selector - Only show in day view */}
              {viewType === 'day' && templates.length > 0 && (
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="flex-1 min-w-[140px] px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium text-sm"
                >
                  <option value="">No Template (Free-flow only)</option>
                  {templates.filter(t => t.createdBy === 'user').length > 0 && (
                    <optgroup label="My Templates">
                      {templates
                        .filter(t => t.createdBy === 'user')
                        .map((template) => (
                          <option key={template._id} value={template._id}>
                            {template.icon ? `${template.icon} ` : ''}{template.name}
                          </option>
                        ))}
                    </optgroup>
                  )}
                  {templates.filter(t => t.createdBy === 'system').length > 0 && (
                    <optgroup label="System Templates">
                      {templates
                        .filter(t => t.createdBy === 'system')
                        .map((template) => (
                          <option key={template._id} value={template._id}>
                            {template.icon ? `${template.icon} ` : ''}{template.name}
                          </option>
                        ))}
                    </optgroup>
                  )}
                </select>
              )}
              {/* View Type Selector */}
              <select
                value={viewType}
                onChange={(e) => setViewType(e.target.value as ViewType)}
                className="flex-1 min-w-[120px] px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium text-sm"
              >
                <option value="day">📅 Day View</option>
                <option value="weekly">📊 Weekly View</option>
                <option value="monthly">📆 Monthly View</option>
              </select>
              <button
                onClick={() => changeDate(-1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                title={viewType === 'day' ? 'Previous day' : viewType === 'weekly' ? 'Previous week' : 'Previous month'}
              >
                <ChevronLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div className="text-center min-w-[120px] flex-1">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium" title={viewType === 'day' ? getFullDateDisplay() : undefined}>
                  {getDateDisplay()}
                </p>
              </div>
              <button
                onClick={() => changeDate(1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                title={viewType === 'day' ? 'Next day' : viewType === 'weekly' ? 'Next week' : 'Next month'}
              >
                <ChevronRightIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={() => setSelectedDate(new Date())}
                className="px-3 py-2 text-xs sm:text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
              >
                Today
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {viewType === 'day' && (
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
        )}

        {viewType === 'weekly' && <WeeklyView selectedDate={selectedDate} />}

        {viewType === 'monthly' && <MonthlyView selectedDate={selectedDate} />}
      </main>

      {/* Push Notification Prompt */}
      {showPushPrompt && (
        <PushNotificationPrompt onClose={() => setShowPushPrompt(false)} />
      )}
    </div>
  );
}
