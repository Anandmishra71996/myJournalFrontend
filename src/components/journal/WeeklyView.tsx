'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { journalService } from '@/services/journal.service';
import { toast } from '@/lib/utils';
import type { WeeklyInsight } from '@/constants/insight.constants';
import type { Journal } from '@/types/journal.types';
import type { JournalTemplate, TemplateField } from '@/types/journalTemplate.types';
import JournalTooltip from './JournalTooltip';

interface WeeklyViewProps {
  selectedDate: Date;
  onOpenDay?: (date: Date) => void;
}

interface DayEntry {
  date: Date;
  dayName: string;
  moodScore?: number;
  energyLevel?: number;
  reflectionSnippet: string;
  hasEntry: boolean;
  journal?: Journal;
}

interface TemplateUsageRow {
  name: string;
  uses: number;
  percent: number;
  icon?: string;
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

const getReflectionSnippet = (reflection?: string, words = 6) => {
  if (!reflection) return '';
  const trimmed = reflection.trim();
  if (!trimmed) return '';
  const parts = trimmed.split(/\s+/);
  const slice = parts.slice(0, words).join(' ');
  return parts.length > words ? `${slice}…` : slice;
};

export default function WeeklyView({ selectedDate, onOpenDay }: WeeklyViewProps) {
  const [weekData, setWeekData] = useState<DayEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [weeklyInsight, setWeeklyInsight] = useState<WeeklyInsight | null>(null);
  const [generatingInsight, setGeneratingInsight] = useState(false);
  const [templateUsage, setTemplateUsage] = useState<TemplateUsageRow[]>([]);
  const [weekSummary, setWeekSummary] = useState({
    avgMood: 0,
    avgEnergy: 0,
    daysWithEntries: 0,
  });

  const [activeJournal, setActiveJournal] = useState<Journal | null>(null);
  const dayRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeAnchorRef = useRef<HTMLButtonElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    loadWeekData();
    loadWeeklyInsight();
    setActiveJournal(null);
    setActiveIndex(null);
  }, [selectedDate]);

  const getWeekStartISO = (date: Date) => {
    const current = new Date(date);
    const day = current.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    current.setDate(current.getDate() + diff);
    current.setHours(0, 0, 0, 0);

    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const dayOfMonth = String(current.getDate()).padStart(2, '0');
    return `${year}-${month}-${dayOfMonth}`;
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
    const day = current.getDay();
    const diff = day === 0 ? -6 : 1 - day;
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

      const response = await journalService.getWeeklyJournals(startDate, endDate);

      if (response.success && response.data) {
        const journals: Journal[] = response.data;
        const entries: DayEntry[] = [];
        let totalMood = 0;
        let totalEnergy = 0;
        let moodCount = 0;
        let energyCount = 0;
        let daysWithEntries = 0;

        const journalMap = new Map<string, Journal>();
        journals.forEach((journal) => {
          const journalDate = new Date(journal.date);
          journalDate.setHours(0, 0, 0, 0);
          journalMap.set(journalDate.toDateString(), journal);
        });

        const templateCounts = new Map<string, { name: string; uses: number; icon?: string }>();

        for (const date of weekDates) {
          const dateKey = date.toDateString();
          const journal = journalMap.get(dateKey);

          if (journal) {
            const template = getTemplate(journal);
            const mood = numericFieldValue(template?.fields, journal.customFieldValues, MOOD_KEYWORDS);
            const energy = numericFieldValue(template?.fields, journal.customFieldValues, ENERGY_KEYWORDS);

            entries.push({
              date,
              dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
              moodScore: mood,
              energyLevel: energy,
              reflectionSnippet: getReflectionSnippet(journal.reflection),
              hasEntry: true,
              journal,
            });

            if (mood !== undefined) {
              totalMood += mood;
              moodCount++;
            }
            if (energy !== undefined) {
              totalEnergy += energy;
              energyCount++;
            }
            daysWithEntries++;

            if (template) {
              const existing = templateCounts.get(template._id) ?? {
                name: template.name,
                uses: 0,
                icon: template.icon,
              };
              existing.uses += 1;
              templateCounts.set(template._id, existing);
            }
          } else {
            entries.push({
              date,
              dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
              reflectionSnippet: '',
              hasEntry: false,
            });
          }
        }

        const totalTemplateUses = Array.from(templateCounts.values()).reduce(
          (acc, row) => acc + row.uses,
          0,
        );
        const usage: TemplateUsageRow[] = Array.from(templateCounts.values())
          .sort((a, b) => b.uses - a.uses)
          .slice(0, 4)
          .map((row) => ({
            ...row,
            percent: totalTemplateUses
              ? Math.round((row.uses / totalTemplateUses) * 100)
              : 0,
          }));

        setWeekData(entries);
        setTemplateUsage(usage);
        setWeekSummary({
          avgMood: moodCount ? Math.round((totalMood / moodCount) * 10) / 10 : 0,
          avgEnergy: energyCount ? Math.round((totalEnergy / energyCount) * 10) / 10 : 0,
          daysWithEntries,
        });
      } else {
        const entries: DayEntry[] = weekDates.map((date) => ({
          date,
          dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
          reflectionSnippet: '',
          hasEntry: false,
        }));
        setWeekData(entries);
        setTemplateUsage([]);
        setWeekSummary({ avgMood: 0, avgEnergy: 0, daysWithEntries: 0 });
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

  const handleDayClick = (index: number, entry: DayEntry) => {
    if (!entry.hasEntry || !entry.journal) {
      if (onOpenDay) onOpenDay(entry.date);
      return;
    }
    if (activeIndex === index) {
      setActiveJournal(null);
      setActiveIndex(null);
      activeAnchorRef.current = null;
      return;
    }
    activeAnchorRef.current = dayRefs.current[index] ?? null;
    setActiveJournal(entry.journal);
    setActiveIndex(index);
  };

  const insightCards = useMemo(() => {
    if (!weeklyInsight?.reflection?.length) return [];
    return weeklyInsight.reflection.slice(0, 3).map((text, index) => ({
      title: index === 0 ? 'Reflection' : index === 1 ? 'Pattern' : 'Focus',
      text,
    }));
  }, [weeklyInsight]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
          style={{ borderColor: 'var(--color-primary)' }}
        ></div>
        <p className="mt-4" style={{ color: 'var(--color-text-secondary)' }}>
          Loading weekly view...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      <section className="space-y-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p
              className="text-xs uppercase tracking-[0.16em] font-semibold"
              style={{ color: 'var(--color-primary)' }}
            >
              Weekly Review
            </p>
            <h2
              className="text-3xl font-bold tracking-tight"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Your week at a glance
            </h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {getWeekRange()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className="rounded-xl p-5"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--color-surface-elevated) 84%, transparent)',
              border: '1px solid color-mix(in srgb, var(--color-border) 24%, transparent)',
            }}
          >
            <p
              className="text-xs uppercase tracking-[0.14em] font-semibold"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Days Logged
            </p>
            <p className="mt-3 text-4xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {weekSummary.daysWithEntries}
              <span className="text-lg" style={{ color: 'var(--color-text-tertiary)' }}>
                /7
              </span>
            </p>
            <p className="mt-2 text-xs" style={{ color: 'var(--color-primary)' }}>
              {weeklyInsight ? `${weeklyInsight.journalCount} entries indexed` : 'Across this week'}
            </p>
          </div>

          <div
            className="rounded-xl p-5"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--color-surface-elevated) 78%, transparent)',
              border: '1px solid color-mix(in srgb, var(--color-border) 24%, transparent)',
            }}
          >
            <p
              className="text-xs uppercase tracking-[0.14em] font-semibold"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Average Mood
            </p>
            <p className="mt-3 text-4xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {weekSummary.avgMood ? weekSummary.avgMood : '—'}
              <span className="text-lg" style={{ color: 'var(--color-text-tertiary)' }}>
                {weekSummary.avgMood ? '/10' : ''}
              </span>
            </p>
            <p className="mt-2 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              {weekSummary.avgMood
                ? 'Derived from template mood field'
                : 'Add a mood field to your template'}
            </p>
          </div>

          <div
            className="rounded-xl p-5"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--color-surface-elevated) 78%, transparent)',
              border: '1px solid color-mix(in srgb, var(--color-border) 24%, transparent)',
            }}
          >
            <p
              className="text-xs uppercase tracking-[0.14em] font-semibold"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Average Energy
            </p>
            <p className="mt-3 text-4xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {weekSummary.avgEnergy ? weekSummary.avgEnergy : '—'}
              <span className="text-lg" style={{ color: 'var(--color-text-tertiary)' }}>
                {weekSummary.avgEnergy ? '/10' : ''}
              </span>
            </p>
            <p className="mt-2 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              {weekSummary.avgEnergy
                ? 'Derived from template energy field'
                : 'Add an energy field to your template'}
            </p>
          </div>
        </div>

        {templateUsage.length > 0 && (
          <div
            className="rounded-xl p-5"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--color-surface-elevated) 78%, transparent)',
              border: '1px solid color-mix(in srgb, var(--color-border) 24%, transparent)',
            }}
          >
            <h3
              className="text-sm uppercase tracking-[0.14em] font-semibold mb-3"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Template Usage
            </h3>
            <div className="space-y-3">
              {templateUsage.map((template) => (
                <div key={template.name}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span style={{ color: 'var(--color-text-primary)' }}>
                      {template.icon ? `${template.icon} ` : ''}
                      {template.name}
                    </span>
                    <span style={{ color: 'var(--color-text-secondary)' }}>
                      {template.uses} {template.uses === 1 ? 'use' : 'uses'}
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--color-border) 35%, transparent)',
                    }}
                  >
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${template.percent}%`,
                        background:
                          'linear-gradient(90deg, color-mix(in srgb, var(--color-primary-dark) 88%, transparent), var(--color-primary))',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section
        className="rounded-2xl p-6 md:p-8"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--color-surface-elevated) 78%, transparent)',
          border: '1px solid color-mix(in srgb, var(--color-border) 22%, transparent)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.28)',
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            Daily Entries
          </h2>
          <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
            Tap a day to preview the journal
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {weekData.map((day, index) => {
            const isActive = activeIndex === index;
            return (
              <button
                key={index}
                ref={(node) => {
                  dayRefs.current[index] = node;
                }}
                onClick={() => handleDayClick(index, day)}
                disabled={!day.hasEntry && !onOpenDay}
                className="text-left rounded-xl p-4 transition-all focus:outline-none focus:ring-2 disabled:cursor-default"
                style={{
                  backgroundColor: day.hasEntry
                    ? 'color-mix(in srgb, var(--color-surface) 84%, transparent)'
                    : 'color-mix(in srgb, var(--color-surface) 62%, transparent)',
                  border: isActive
                    ? '1px solid var(--color-primary)'
                    : day.hasEntry
                      ? '1px solid color-mix(in srgb, var(--color-primary) 24%, transparent)'
                      : '1px solid color-mix(in srgb, var(--color-border) 20%, transparent)',
                  opacity: day.hasEntry ? 1 : 0.7,
                  boxShadow: isActive
                    ? '0 0 0 1px color-mix(in srgb, var(--color-primary) 35%, transparent)'
                    : 'none',
                }}
                title={
                  day.hasEntry
                    ? `Preview ${day.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`
                    : `No entry · ${onOpenDay ? 'open day view' : 'no entry yet'}`
                }
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3
                      className="font-bold text-base"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {day.dayName}
                    </h3>
                    <p
                      className="text-xs"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  {day.hasEntry && (
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getMoodColor(day.moodScore) }}
                      title={day.moodScore ? `Mood: ${day.moodScore}/10` : 'Entry logged'}
                    />
                  )}
                </div>

                {day.hasEntry ? (
                  <div className="space-y-2 text-sm">
                    <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
                      {day.reflectionSnippet || 'No reflection text'}
                    </p>
                    {(day.moodScore !== undefined || day.energyLevel !== undefined) && (
                      <div
                        className="flex justify-between pt-2"
                        style={{
                          borderTop:
                            '1px solid color-mix(in srgb, var(--color-border) 24%, transparent)',
                        }}
                      >
                        <span
                          className="text-xs"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          Mood: {day.moodScore !== undefined ? `${day.moodScore}/10` : '—'}
                        </span>
                        <span
                          className="text-xs"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          Energy: {day.energyLevel !== undefined ? `${day.energyLevel}/10` : '—'}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p
                    className="text-sm italic"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    No entry for this day
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </section>

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
                background:
                  'linear-gradient(135deg, color-mix(in srgb, var(--color-primary-dark) 88%, transparent), var(--color-primary))',
                color: '#ffffff',
              }}
            >
              {generatingInsight ? 'Generating...' : 'Generate Insights'}
            </button>
          </div>
        ) : insightCards.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {insightCards.map((insight) => (
              <article
                key={insight.title}
                className="rounded-xl p-4"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--color-surface) 82%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--color-border) 18%, transparent)',
                }}
              >
                <p
                  className="text-xs uppercase tracking-[0.14em] font-semibold mb-2"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {insight.title}
                </p>
                <p className="text-sm leading-6" style={{ color: 'var(--color-text-secondary)' }}>
                  {insight.text}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Insights generated, but no reflection text was returned for this week.
          </p>
        )}
        {weeklyInsight?.suggestion && (
          <div
            className="mt-6 rounded-xl p-4"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
              border: '1px solid color-mix(in srgb, var(--color-primary) 22%, transparent)',
            }}
          >
            <p
              className="text-xs uppercase tracking-[0.14em] font-semibold mb-2"
              style={{ color: 'var(--color-primary)' }}
            >
              Suggestion
            </p>
            <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
              {weeklyInsight.suggestion}
            </p>
          </div>
        )}
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
        onOpenFullView={onOpenDay}
      />
    </div>
  );
}
