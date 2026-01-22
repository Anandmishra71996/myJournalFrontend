'use client';

import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { journalService } from '@/services/journal.service';
import { toastService } from '@/services/toast.service';
import DayView from '@/components/journal/DayView';
import WeeklyView from '@/components/journal/WeeklyView';
import MonthlyView from '@/components/journal/MonthlyView';
import PushNotificationPrompt from '@/components/PushNotificationPrompt';

type ViewType = 'day' | 'weekly' | 'monthly';

export default function JournalPage() {
  const [viewType, setViewType] = useState<ViewType>('day');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [journalId, setJournalId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPushPrompt, setShowPushPrompt] = useState(false);
  const [journalData, setJournalData] = useState({
    whatHappened: '',
    moodScore: 5,
    keyHighlights: '',
  });

  useEffect(() => {
    if (viewType === 'day') {
      loadJournalByDate(selectedDate);
    }
  }, [selectedDate, viewType]);

  const loadJournalByDate = async (date: Date) => {
    setLoading(true);
    try {
      const response = await journalService.getJournalByDate(date);
      if (response.success && response.data) {
        const journal = response.data;
        setJournalId(journal._id);
        setJournalData({
          whatHappened: journal.content?.whatHappened || '',
          moodScore: journal.mood?.score || 5,
          keyHighlights: journal.content?.keyHighlights || '',
        });
      } else {
        // Reset form for new entry
        setJournalId(null);
        setJournalData({
          whatHappened: '',
          moodScore: 5,
          keyHighlights: '',
        });
      }
    } catch (error) {
      console.error('Error loading journal:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveJournal = async (isComplete = false) => {
    setSaving(true);
    try {
      const data = {
        date: selectedDate,
        content: {
          whatHappened: journalData.whatHappened,
          keyHighlights: journalData.keyHighlights,
        },
        mood: {
          score: journalData.moodScore,
        },
      };

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
        const message = isComplete ? 'Journal saved successfully!' : 'Draft saved!';
        toastService.success(message);
      }
    } catch (error: any) {
      console.error('Error saving journal:', error);
      const errorMessage = error.response?.data?.error || 'Failed to save journal';
      toastService.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

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
            <h1 className="text-xl sm:text-2xl text-center font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              My Journal
            </h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
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
            journalData={journalData}
            saving={saving}
            journalId={journalId}
            setJournalData={setJournalData}
            saveJournal={saveJournal}
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
