'use client';

import { useEffect, useRef, useState } from 'react';
import { journalService } from '@/services/journal.service';
import { toast } from '@/lib/utils';
import type { Journal } from '@/types/journal.types';
import type { JournalTemplate, TemplateField } from '@/types/journalTemplate.types';
import JournalTooltip from './JournalTooltip';

interface MonthlyViewProps {
  selectedDate: Date;
  onDateClick?: (date: Date) => void;
}

interface MonthEntry {
  date: Date;
  day: number;
  hasEntry: boolean;
  moodScore?: number;
  energyLevel?: number;
  journal?: Journal;
}

const MOOD_KEYWORDS = ['mood'];
const ENERGY_KEYWORDS = ['energy'];

const matchField = (fields: TemplateField[] | undefined, keywords: string[]) => {
  if (!fields) return undefined;
  return fields.find((field) => {
    const label = field.label?.toLowerCase() ?? '';
    return keywords.some((kw) => label.includes(kw));
  });
};

const numericFieldValue = (
  fields: TemplateField[] | undefined,
  values: Record<string, any> | undefined,
  keywords: string[],
): number | undefined => {
  const field = matchField(fields, keywords);
  if (!field) return undefined;
  const raw = values?.[field.id];
  if (raw === undefined || raw === null || raw === '') return undefined;
  const num = Number(raw);
  return Number.isFinite(num) ? num : undefined;
};

const getTemplate = (journal: Journal): JournalTemplate | null => {
  if (!journal.templateId || typeof journal.templateId === 'string') return null;
  return journal.templateId as JournalTemplate;
};

export default function MonthlyView({ selectedDate, onDateClick }: MonthlyViewProps) {
  const [monthData, setMonthData] = useState<MonthEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthSummary, setMonthSummary] = useState({
    totalEntries: 0,
    avgMood: 0,
    avgEnergy: 0,
    bestDay: { date: '', score: 0 },
  });

  const dayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeAnchorRef = useRef<HTMLDivElement | null>(null);
  const [activeJournal, setActiveJournal] = useState<Journal | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    loadMonthData();
    setActiveJournal(null);
    setActiveIndex(null);
  }, [selectedDate]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const adjustedStartDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

    const days: MonthEntry[] = [];

    for (let i = 0; i < adjustedStartDay; i++) {
      days.push({
        date: new Date(0),
        day: 0,
        hasEntry: false,
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        day,
        hasEntry: false,
      });
    }

    return days;
  };

  const loadMonthData = async () => {
    setLoading(true);
    try {
      const days = getDaysInMonth(selectedDate);
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();

      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);
      endDate.setHours(23, 59, 59, 999);

      const response = await journalService.getMonthlyJournals(startDate, endDate);

      let totalEntries = 0;
      let totalMood = 0;
      let totalEnergy = 0;
      let moodCount = 0;
      let energyCount = 0;
      let bestDay = { date: '', score: 0 };

      if (response.success && response.data) {
        const journals: Journal[] = response.data;

        const journalMap = new Map<string, Journal>();
        journals.forEach((journal) => {
          const journalDate = new Date(journal.date);
          journalDate.setHours(0, 0, 0, 0);
          journalMap.set(journalDate.toDateString(), journal);
        });

        for (const day of days) {
          if (day.day > 0) {
            const dateKey = day.date.toDateString();
            const journal = journalMap.get(dateKey);

            if (journal) {
              const template = getTemplate(journal);
              const mood = numericFieldValue(template?.fields, journal.customFieldValues, MOOD_KEYWORDS);
              const energy = numericFieldValue(template?.fields, journal.customFieldValues, ENERGY_KEYWORDS);

              day.hasEntry = true;
              day.moodScore = mood;
              day.energyLevel = energy;
              day.journal = journal;
              totalEntries++;
              if (mood !== undefined) {
                totalMood += mood;
                moodCount++;
              }
              if (energy !== undefined) {
                totalEnergy += energy;
                energyCount++;
              }

              if (mood !== undefined && mood > bestDay.score) {
                bestDay = {
                  date: day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                  score: mood,
                };
              }
            }
          }
        }
      }

      setMonthData(days);
      setMonthSummary({
        totalEntries,
        avgMood: moodCount ? Math.round((totalMood / moodCount) * 10) / 10 : 0,
        avgEnergy: energyCount ? Math.round((totalEnergy / energyCount) * 10) / 10 : 0,
        bestDay,
      });
    } catch (error) {
      console.error('Error loading month data:', error);
      toast.error('Failed to load monthly data');
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = () => {
    return selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getMoodColor = (score?: number) => {
    if (!score) return 'bg-gray-100 dark:bg-gray-700';
    if (score >= 8) return 'bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-emerald-300/50 dark:shadow-emerald-700/50';
    if (score >= 6) return 'bg-gradient-to-br from-blue-400 to-blue-500 shadow-blue-300/50 dark:shadow-blue-700/50';
    if (score >= 4) return 'bg-gradient-to-br from-amber-400 to-amber-500 shadow-amber-300/50 dark:shadow-amber-700/50';
    return 'bg-gradient-to-br from-red-400 to-red-500 shadow-red-300/50 dark:shadow-red-700/50';
  };

  const getCompletionRate = () => {
    const daysInMonth = monthData.filter((d) => d.day > 0).length;
    return daysInMonth > 0 ? Math.round((monthSummary.totalEntries / daysInMonth) * 100) : 0;
  };

  const isDateInFuture = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate > today;
  };

  const handleDayClick = (index: number, entry: MonthEntry) => {
    if (entry.day === 0) return;
    if (isDateInFuture(entry.date)) return;

    if (entry.hasEntry && entry.journal) {
      if (activeIndex === index) {
        setActiveJournal(null);
        setActiveIndex(null);
        activeAnchorRef.current = null;
        return;
      }
      activeAnchorRef.current = dayRefs.current[index] ?? null;
      setActiveJournal(entry.journal);
      setActiveIndex(index);
      return;
    }

    if (onDateClick) {
      onDateClick(entry.date);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading monthly view...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30 dark:from-gray-800 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-3xl shadow-xl border border-indigo-100/50 dark:border-indigo-800/30 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
              {getMonthName()}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Your monthly journey at a glance</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="group relative overflow-hidden bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-indigo-100 dark:border-indigo-800/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 mb-2">Completion</p>
                <p className="text-4xl font-black bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-1">
                  {getCompletionRate()}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {monthSummary.totalEntries} of {monthData.filter((d) => d.day > 0).length} days
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-amber-100 dark:border-amber-800/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-2">Avg Mood</p>
                <p className="text-4xl font-black bg-gradient-to-br from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent mb-1">
                  {monthSummary.avgMood ? monthSummary.avgMood : '—'}
                  <span className="text-2xl text-gray-400">{monthSummary.avgMood ? '/10' : ''}</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {monthSummary.avgMood ? 'Monthly average' : 'No mood field tracked'}
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-rose-100 dark:border-rose-800/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-rose-500/20 to-pink-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <p className="text-sm font-semibold text-rose-700 dark:text-rose-400 mb-2">Energy</p>
                <p className="text-4xl font-black bg-gradient-to-br from-rose-600 to-pink-600 dark:from-rose-400 dark:to-pink-400 bg-clip-text text-transparent mb-1">
                  {monthSummary.avgEnergy ? monthSummary.avgEnergy : '—'}
                  <span className="text-2xl text-gray-400">{monthSummary.avgEnergy ? '/10' : ''}</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {monthSummary.avgEnergy ? 'Monthly average' : 'No energy field tracked'}
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-5 border border-emerald-100 dark:border-emerald-800/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-2">Best Day</p>
                <p className="text-2xl font-black bg-gradient-to-br from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mb-1">
                  {monthSummary.bestDay.date || 'N/A'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {monthSummary.bestDay.score > 0
                    ? `Mood: ${monthSummary.bestDay.score}/10`
                    : 'No mood data yet'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            Calendar Heatmap
          </h2>
          <div className="hidden sm:flex items-center gap-2 text-xs bg-gray-50 dark:bg-gray-700/50 rounded-full px-4 py-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-gray-200 dark:bg-gray-600"></div>
              <span className="text-gray-600 dark:text-gray-400">None</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-gradient-to-br from-red-400 to-red-500"></div>
              <span className="text-gray-600 dark:text-gray-400">Low</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-gradient-to-br from-amber-400 to-amber-500"></div>
              <span className="text-gray-600 dark:text-gray-400">Fair</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-gradient-to-br from-blue-400 to-blue-500"></div>
              <span className="text-gray-600 dark:text-gray-400">Good</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-gradient-to-br from-emerald-400 to-emerald-500"></div>
              <span className="text-gray-600 dark:text-gray-400">Great</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-3">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="text-center text-xs font-bold text-gray-500 dark:text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {monthData.map((entry, index) => {
            const isFuture = entry.day > 0 && isDateInFuture(entry.date);
            const isClickable = entry.day > 0 && !isFuture;
            const isActive = activeIndex === index;

            return (
              <div
                key={index}
                ref={(node) => {
                  dayRefs.current[index] = node;
                }}
                onClick={() => handleDayClick(index, entry)}
                className={`relative group h-12 sm:h-14 md:h-16 rounded-xl flex flex-col items-center justify-center transition-all duration-300 ${
                  entry.day === 0
                    ? 'bg-transparent'
                    : isFuture
                      ? 'bg-gray-50 dark:bg-gray-800/30 border-2 border-dashed border-gray-300 dark:border-gray-600 opacity-50 cursor-not-allowed'
                      : entry.hasEntry
                        ? `${getMoodColor(entry.moodScore)} hover:scale-110 hover:shadow-xl hover:z-10 cursor-pointer ring-2 ${isActive ? 'ring-indigo-500 dark:ring-indigo-400' : 'ring-white dark:ring-gray-800'}`
                        : 'bg-gray-100 dark:bg-gray-700/50 border-2 border-dashed border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:scale-105 cursor-pointer'
                }`}
                title={
                  isFuture
                    ? `${entry.date.toLocaleDateString()}: Future date`
                    : entry.hasEntry
                      ? `${entry.date.toLocaleDateString()}: Click to preview entry`
                      : entry.day > 0
                        ? `${entry.date.toLocaleDateString()}: No entry - Click to create`
                        : ''
                }
              >
                {entry.day > 0 && (
                  <>
                    <span
                      className={`text-sm sm:text-base font-bold transition-all duration-300 ${
                        isFuture
                          ? 'text-gray-400 dark:text-gray-600'
                          : entry.hasEntry
                            ? 'text-white drop-shadow-md'
                            : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200'
                      }`}
                    >
                      {entry.day}
                    </span>
                    {entry.hasEntry && !isFuture && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm">
                        <div className="w-1.5 h-1.5 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                    {!isFuture && isClickable && !entry.hasEntry && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/5 dark:bg-white/5 rounded-xl">
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 drop-shadow">
                          New
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="sm:hidden mt-6 grid grid-cols-5 gap-2 text-xs">
          <div className="flex flex-col items-center gap-1">
            <div className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-gray-700/50 border-2 border-dashed border-gray-200 dark:border-gray-600"></div>
            <span className="text-gray-500 dark:text-gray-500">None</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-red-400 to-red-500"></div>
            <span className="text-gray-500 dark:text-gray-500">Low</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500"></div>
            <span className="text-gray-500 dark:text-gray-500">Fair</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-400 to-blue-500"></div>
            <span className="text-gray-500 dark:text-gray-500">Good</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-500"></div>
            <span className="text-gray-500 dark:text-gray-500">Great</span>
          </div>
        </div>
      </section>

      <JournalTooltip
        journal={activeJournal}
        open={activeJournal !== null}
        anchorRef={activeAnchorRef}
        onClose={() => {
          setActiveJournal(null);
          setActiveIndex(null);
          activeAnchorRef.current = null;
        }}
        onOpenFullView={onDateClick}
      />
    </div>
  );
}
