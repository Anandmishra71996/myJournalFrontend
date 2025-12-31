'use client';

import { useState, useEffect } from 'react';
import { journalService } from '@/services/journal.service';
import { toast } from '@/lib/utils';

interface WeeklyViewProps {
  selectedDate: Date;
}

interface DayEntry {
  date: Date;
  dayName: string;
  moodScore?: number;
  energyLevel?: number;
  wins: string[];
  challenges: string[];
  hasEntry: boolean;
  journalId?: string;
}

export default function WeeklyView({ selectedDate }: WeeklyViewProps) {
  const [weekData, setWeekData] = useState<DayEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekSummary, setWeekSummary] = useState({
    totalWins: 0,
    totalChallenges: 0,
    avgMood: 0,
    avgEnergy: 0,
    daysWithEntries: 0,
  });

  useEffect(() => {
    loadWeekData();
  }, [selectedDate]);

  const getWeekDates = (date: Date) => {
    const week: Date[] = [];
    const current = new Date(date);
    const day = current.getDay();
    const diff = current.getDate() - day; // Start from Sunday
    
    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(current.setDate(diff + i));
      week.push(new Date(weekDate));
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
              wins: journal.content?.wins || [],
              challenges: journal.content?.challenges || [],
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
              wins: [],
              challenges: [],
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
          wins: [],
          challenges: [],
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
    if (!score) return 'bg-gray-200';
    if (score >= 8) return 'bg-green-500';
    if (score >= 6) return 'bg-blue-500';
    if (score >= 4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-text-secondary">Loading weekly view...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Week Summary */}
      <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-text-primary mb-2">📊 Week Overview</h2>
          <p className="text-text-secondary">{getWeekRange()}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
            <p className="text-sm text-green-700 font-medium">Days Logged</p>
            <p className="text-3xl font-bold text-green-900">{weekSummary.daysWithEntries}/7</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
            <p className="text-sm text-blue-700 font-medium">Total Wins</p>
            <p className="text-3xl font-bold text-blue-900">{weekSummary.totalWins}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
            <p className="text-sm text-purple-700 font-medium">Challenges</p>
            <p className="text-3xl font-bold text-purple-900">{weekSummary.totalChallenges}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4">
            <p className="text-sm text-yellow-700 font-medium">Avg Mood</p>
            <p className="text-3xl font-bold text-yellow-900">{weekSummary.avgMood}/10</p>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4">
            <p className="text-sm text-pink-700 font-medium">Avg Energy</p>
            <p className="text-3xl font-bold text-pink-900">{weekSummary.avgEnergy}/10</p>
          </div>
        </div>
      </section>

      {/* Daily Entries */}
      <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold text-text-primary mb-6">📅 Daily Entries</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {weekData.map((day, index) => (
            <div
              key={index}
              className={`rounded-xl p-5 border-2 transition-all ${
                day.hasEntry
                  ? 'border-indigo-200 bg-indigo-50/50 hover:shadow-md'
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg text-text-primary">{day.dayName}</h3>
                  <p className="text-xs text-text-secondary">
                    {day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                {day.hasEntry && (
                  <div className="flex gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${getMoodColor(day.moodScore)}`}
                      title={`Mood: ${day.moodScore}/10`}
                    />
                  </div>
                )}
              </div>

              {day.hasEntry ? (
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-xs font-medium text-text-secondary">Wins</p>
                    <p className="font-semibold text-green-700">{day.wins.length}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-text-secondary">Challenges</p>
                    <p className="font-semibold text-orange-700">{day.challenges.length}</p>
                  </div>
                  {day.moodScore && (
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="text-xs text-text-secondary">Mood: {day.moodScore}/10</span>
                      <span className="text-xs text-text-secondary">Energy: {day.energyLevel}/10</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-text-tertiary italic">No entry for this day</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Week Insights */}
      <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold text-text-primary mb-6">💡 Week Insights</h2>
        <div className="space-y-4">
          {weekData.filter(d => d.hasEntry && d.wins.length > 0).length > 0 ? (
            <div>
              <h3 className="font-semibold text-text-primary mb-2">🎉 This Week's Wins</h3>
              <ul className="space-y-2">
                {weekData
                  .filter(d => d.hasEntry && d.wins.length > 0)
                  .slice(0, 5)
                  .map((day, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <div>
                        <p className="text-sm text-text-secondary">{day.dayName}</p>
                        {day.wins.slice(0, 2).map((win, winIdx) => (
                          <p key={winIdx} className="text-text-primary">{win}</p>
                        ))}
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          ) : (
            <p className="text-text-tertiary italic">No wins recorded this week yet</p>
          )}
        </div>
      </section>
    </div>
  );
}
