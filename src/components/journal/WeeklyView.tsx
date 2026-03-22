'use client';

import { useState, useEffect } from 'react';
import { journalService } from '@/services/journal.service';
import { toast } from '@/lib/utils';
import type { WeeklyInsight } from '@/constants/insight.constants';

interface WeeklyViewProps {
  selectedDate: Date;
}

interface DayEntry {
  date: Date;
  dayName: string;
  moodScore?: number;
  energyLevel?: number;
  reflectionSnippet?: string;
  hasEntry: boolean;
  journalId?: string;
}

const TEMPLATE_USAGE_PLACEHOLDER = [
  { name: 'Deep Reflection', uses: 4, percent: 57 },
  { name: 'Morning Vitality', uses: 3, percent: 43 },
  { name: 'Evening Reset', uses: 2, percent: 28 },
];

const TOP_CHALLENGES_PLACEHOLDER = [
  'Creative Blockade: Deep work felt harder due to interruptions.',
  'Energy Dip Midweek: Sleep inconsistency reduced focus on Thursday.',
  'Context Switching: Multiple parallel tasks reduced flow quality.',
];

const WEEKLY_INSIGHTS_PLACEHOLDER = [
  {
    title: 'Consistency Trend',
    text: 'Reflection consistency is up 15 percent from last week. Your journaling habit is becoming steadier.',
  },
  {
    title: 'Mood Correlation',
    text: 'Higher mood scores appeared on days you journaled earlier in the day with a clear intent.',
  },
  {
    title: 'AI Synthesis',
    text: 'Your strongest entries combine reflection with one concrete action for the next day.',
  },
];

export default function WeeklyView({ selectedDate }: WeeklyViewProps) {
  const [weekData, setWeekData] = useState<DayEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [weeklyInsight, setWeeklyInsight] = useState<WeeklyInsight | null>(null);
  const [generatingInsight, setGeneratingInsight] = useState(false);
  const [weekSummary, setWeekSummary] = useState({
    totalWins: 0,
    totalChallenges: 0,
    avgMood: 0,
    avgEnergy: 0,
    daysWithEntries: 0,
  });

  useEffect(() => {
    loadWeekData();
    loadWeeklyInsight();
  }, [selectedDate]);

  const getWeekStartISO = (date: Date) => {
    const current = new Date(date);
    const day = current.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    current.setDate(current.getDate() + diff);
    current.setHours(0, 0, 0, 0);

    // Format using local date parts to avoid UTC offset shifting weekStart (e.g. 9 -> 8).
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const dayOfMonth = String(current.getDate()).padStart(2, '0');
    return `${year}-${month}-${dayOfMonth}`;
  };

  const getReflectionSnippet = (reflection?: string, words = 4) => {
    if (!reflection) return 'No reflection yet';
    const trimmed = reflection.trim();
    if (!trimmed) return 'No reflection yet';
    const parts = trimmed.split(/\s+/).slice(0, words);
    return `${parts.join(' ')}...`;
  };

  const loadWeeklyInsight = async () => {
    try {
      const weekStart = getWeekStartISO(selectedDate);
      const response = await journalService.getWeeklyInsight(weekStart);
      if (response?.success && response.data) {
        setWeeklyInsight(response.data);
      } else {
        setWeeklyInsight(null);
      }
    } catch {
      setWeeklyInsight(null);
    }
  };

  const handleGenerateInsight = async () => {
    setGeneratingInsight(true);
    try {
      const weekStart = getWeekStartISO(selectedDate);
      const response = await journalService.generateWeeklyInsight(weekStart);
      if (response?.success && response.data) {
        setWeeklyInsight(response.data);
        toast.success('Weekly insights generated');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Failed to generate weekly insights');
    } finally {
      setGeneratingInsight(false);
    }
  };

  const getWeekDates = (date: Date) => {
    const week: Date[] = [];
    const current = new Date(date);
    const day = current.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const diff = day === 0 ? -6 : 1 - day; // If Sunday, go back 6 days; otherwise go to Monday
    current.setDate(current.getDate() + diff);
    
    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(current);
      weekDate.setDate(current.getDate() + i);
      week.push(weekDate);
    }
    return week;
  };

  const loadWeekData = async () => {
    setLoading(true);
    try {
      const weekDates = getWeekDates(selectedDate);
      const startDate = weekDates[0];
      const endDate = weekDates[6];

      // Fetch all journals for the week in one API call
      const response = await journalService.getWeeklyJournals(startDate, endDate);
      
      if (response.success && response.data) {
        const journals = response.data;
        const entries: DayEntry[] = [];
        let totalWins = 0;
        let totalChallenges = 0;
        let totalMood = 0;
        let totalEnergy = 0;
        let daysWithEntries = 0;

        // Create a map of journals by date for quick lookup
        const journalMap = new Map();
        journals.forEach((journal: any) => {
          const journalDate = new Date(journal.date);
          journalDate.setHours(0, 0, 0, 0);
          journalMap.set(journalDate.toDateString(), journal);
        });

        // Build entries for each day of the week
        for (const date of weekDates) {
          const dateKey = date.toDateString();
          const journal = journalMap.get(dateKey);

          if (journal) {
            entries.push({
              date,
              dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
              moodScore: journal.mood?.score,
              energyLevel: journal.mood?.energy,
              reflectionSnippet: getReflectionSnippet(journal.reflection),
              hasEntry: true,
              journalId: journal._id,
            });
            totalWins += journal.content?.wins?.length || 0;
            totalChallenges += journal.content?.challenges?.length || 0;
            totalMood += journal.mood?.score || 0;
            totalEnergy += journal.mood?.energy || 0;
            daysWithEntries++;
          } else {
            entries.push({
              date,
              dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
              reflectionSnippet: '',
              hasEntry: false,
            });
          }
        }

        setWeekData(entries);
        setWeekSummary({
          totalWins,
          totalChallenges,
          avgMood: daysWithEntries > 0 ? Math.round(totalMood / daysWithEntries) : 0,
          avgEnergy: daysWithEntries > 0 ? Math.round(totalEnergy / daysWithEntries) : 0,
          daysWithEntries,
        });
      } else {
        // No journals found, create empty entries
        const entries: DayEntry[] = weekDates.map(date => ({
          date,
          dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
          reflectionSnippet: '',
          hasEntry: false,
        }));
        setWeekData(entries);
      }
    } catch (error) {
      console.error('Error loading week data:', error);
      toast.error('Failed to load weekly data');
    } finally {
      setLoading(false);
    }
  };

  const getWeekRange = () => {
    const weekDates = getWeekDates(selectedDate);
    const start = weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const end = weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${start} - ${end}`;
  };

  const getMoodColor = (score?: number) => {
    if (!score) return 'color-mix(in srgb, var(--color-border) 50%, transparent)';
    if (score >= 8) return 'var(--color-success)';
    if (score >= 6) return 'var(--color-info)';
    if (score >= 4) return 'var(--color-warning)';
    return 'var(--color-error)';
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: 'var(--color-primary)' }}></div>
        <p className="mt-4" style={{ color: 'var(--color-text-secondary)' }}>Loading weekly view...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      <section className="space-y-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] font-semibold" style={{ color: 'var(--color-primary)' }}>
              Weekly Review
            </p>
            <h2 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
              Template Insights
            </h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {getWeekRange()}
            </p>
          </div>
          <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
            Static preview sections for upcoming API integrations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div
            className="md:col-span-1 rounded-xl p-5"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--color-surface-elevated) 84%, transparent)',
              border: '1px solid color-mix(in srgb, var(--color-border) 24%, transparent)',
            }}
          >
            <p className="text-xs uppercase tracking-[0.14em] font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
              Days Logged
            </p>
            <p className="mt-3 text-4xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {weekSummary.daysWithEntries}<span className="text-lg" style={{ color: 'var(--color-text-tertiary)' }}>/7</span>
            </p>
            <p className="mt-2 text-xs" style={{ color: 'var(--color-primary)' }}>
              {weeklyInsight ? `${weeklyInsight.journalCount} entries this week` : `Avg mood ${weekSummary.avgMood}/10`}
            </p>
          </div>

          <div
            className="md:col-span-2 rounded-xl p-5"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--color-surface-elevated) 78%, transparent)',
              border: '1px solid color-mix(in srgb, var(--color-border) 24%, transparent)',
            }}
          >
            <h3 className="text-sm uppercase tracking-[0.14em] font-semibold mb-3" style={{ color: 'var(--color-text-secondary)' }}>
              Template Usage
            </h3>
            <div className="space-y-3">
              {TEMPLATE_USAGE_PLACEHOLDER.map((template) => (
                <div key={template.name}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span style={{ color: 'var(--color-text-primary)' }}>{template.name}</span>
                    <span style={{ color: 'var(--color-text-secondary)' }}>{template.uses} uses</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ backgroundColor: 'color-mix(in srgb, var(--color-border) 35%, transparent)' }}>
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${template.percent}%`,
                        background: 'linear-gradient(90deg, color-mix(in srgb, var(--color-primary-dark) 88%, transparent), var(--color-primary))',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="md:col-span-2 rounded-xl p-5"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--color-surface-elevated) 78%, transparent)',
              border: '1px solid color-mix(in srgb, var(--color-border) 24%, transparent)',
            }}
          >
            <h3 className="text-sm uppercase tracking-[0.14em] font-semibold mb-3" style={{ color: 'var(--color-text-secondary)' }}>
              Top Challenges
            </h3>
            <ul className="space-y-2.5">
              {TOP_CHALLENGES_PLACEHOLDER.map((challenge, idx) => (
                <li key={challenge} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
                  <span style={{ color: idx === 0 ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>{challenge}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              Live challenge ranking will be connected once weekly analysis API is available.
            </p>
          </div>
        </div>
      </section>

      {/* Daily Entries */}
      <section
        className="rounded-2xl p-6 md:p-8"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--color-surface-elevated) 78%, transparent)',
          border: '1px solid color-mix(in srgb, var(--color-border) 22%, transparent)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.28)',
        }}
      >
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
          Daily Entries
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {weekData.map((day, index) => (
            <div
              key={index}
              className="rounded-xl p-4 transition-all"
              style={{
                backgroundColor: day.hasEntry
                  ? 'color-mix(in srgb, var(--color-surface) 84%, transparent)'
                  : 'color-mix(in srgb, var(--color-surface) 62%, transparent)',
                border: day.hasEntry
                  ? '1px solid color-mix(in srgb, var(--color-primary) 24%, transparent)'
                  : '1px solid color-mix(in srgb, var(--color-border) 20%, transparent)',
                opacity: day.hasEntry ? 1 : 0.7,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold text-base" style={{ color: 'var(--color-text-primary)' }}>{day.dayName}</h3>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    {day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                {day.hasEntry && (
                  <div className="flex gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getMoodColor(day.moodScore) }}
                      title={`Mood: ${day.moodScore}/10`}
                    />
                  </div>
                )}
              </div>

              {day.hasEntry ? (
                <div className="space-y-2 text-sm">
                  <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
                    {day.reflectionSnippet}
                  </p>
                  {day.moodScore && (
                    <div className="flex justify-between pt-2" style={{ borderTop: '1px solid color-mix(in srgb, var(--color-border) 24%, transparent)' }}>
                      <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Mood: {day.moodScore}/10</span>
                      <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Energy: {day.energyLevel}/10</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm italic" style={{ color: 'var(--color-text-tertiary)' }}>No entry for this day</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Week Insights */}
      <section
        className="rounded-2xl p-6 md:p-8"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--color-surface-elevated) 76%, transparent)',
          border: '1px solid color-mix(in srgb, var(--color-border) 22%, transparent)',
        }}
      >
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>
          Week Insights
        </h2>
        {!weeklyInsight ? (
          <div
            className="rounded-xl p-6 text-center"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--color-surface) 82%, transparent)',
              border: '1px solid color-mix(in srgb, var(--color-border) 18%, transparent)',
            }}
          >
            <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
              No insights available for this week yet.
            </p>
            <button
              onClick={handleGenerateInsight}
              disabled={generatingInsight}
              className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-primary-dark) 88%, transparent), var(--color-primary))',
                color: '#ffffff',
              }}
            >
              {generatingInsight ? 'Generating...' : 'Generate Insights'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {(weeklyInsight.reflection?.length ? weeklyInsight.reflection.slice(0, 3).map((text, index) => ({
              title: index === 0 ? 'Reflection' : index === 1 ? 'Pattern' : 'Focus',
              text,
            })) : WEEKLY_INSIGHTS_PLACEHOLDER).map((insight) => (
              <article
                key={insight.title}
                className="rounded-xl p-4"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--color-surface) 82%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--color-border) 18%, transparent)',
                }}
              >
                <p className="text-xs uppercase tracking-[0.14em] font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>
                  {insight.title}
                </p>
                <p className="text-sm leading-6" style={{ color: 'var(--color-text-secondary)' }}>
                  {insight.text}
                </p>
              </article>
            ))}
          </div>
        )}
        {weeklyInsight?.suggestion && (
          <div
            className="mt-6 rounded-xl p-4"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
              border: '1px solid color-mix(in srgb, var(--color-primary) 22%, transparent)',
            }}
          >
            <p className="text-xs uppercase tracking-[0.14em] font-semibold mb-2" style={{ color: 'var(--color-primary)' }}>
              Suggestion
            </p>
            <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>{weeklyInsight.suggestion}</p>
          </div>
        )}
      </section>
    </div>
  );
}
