'use client';

import { useState, useEffect } from 'react';
import { journalService } from '@/services/journal.service';
import { toast } from '@/lib/utils';

interface MonthlyViewProps {
  selectedDate: Date;
}

interface MonthEntry {
  date: Date;
  day: number;
  hasEntry: boolean;
  moodScore?: number;
  energyLevel?: number;
}

export default function MonthlyView({ selectedDate }: MonthlyViewProps) {
  const [monthData, setMonthData] = useState<MonthEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthSummary, setMonthSummary] = useState({
    totalEntries: 0,
    avgMood: 0,
    avgEnergy: 0,
    bestDay: { date: '', score: 0 },
  });

  useEffect(() => {
    loadMonthData();
  }, [selectedDate]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: MonthEntry[] = [];

    // Add empty days for previous month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({
        date: new Date(0),
        day: 0,
        hasEntry: false,
      });
    }

    // Add days of current month
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
      
      // Get first and last day of the month
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);
      endDate.setHours(23, 59, 59, 999);

      // Fetch all journals for the month in one API call
      const response = await journalService.getMonthlyJournals(startDate, endDate);

      let totalEntries = 0;
      let totalMood = 0;
      let totalEnergy = 0;
      let bestDay = { date: '', score: 0 };

      if (response.success && response.data) {
        const journals = response.data;

        // Create a map of journals by date for quick lookup
        const journalMap = new Map();
        journals.forEach((journal: any) => {
          const journalDate = new Date(journal.date);
          journalDate.setHours(0, 0, 0, 0);
          journalMap.set(journalDate.toDateString(), journal);
        });

        // Update days array with journal data
        for (const day of days) {
          if (day.day > 0) {
            const dateKey = day.date.toDateString();
            const journal = journalMap.get(dateKey);

            if (journal) {
              day.hasEntry = true;
              day.moodScore = journal.mood?.score;
              day.energyLevel = journal.mood?.energy;
              totalEntries++;
              totalMood += journal.mood?.score || 0;
              totalEnergy += journal.mood?.energy || 0;

              if (journal.mood?.score && journal.mood.score > bestDay.score) {
                bestDay = {
                  date: day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                  score: journal.mood.score,
                };
              }
            }
          }
        }
      }

      setMonthData(days);
      setMonthSummary({
        totalEntries,
        avgMood: totalEntries > 0 ? Math.round(totalMood / totalEntries) : 0,
        avgEnergy: totalEntries > 0 ? Math.round(totalEnergy / totalEntries) : 0,
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
    if (!score) return 'bg-gray-100';
    if (score >= 8) return 'bg-green-400';
    if (score >= 6) return 'bg-blue-400';
    if (score >= 4) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  const getCompletionRate = () => {
    const daysInMonth = monthData.filter(d => d.day > 0).length;
    return daysInMonth > 0 ? Math.round((monthSummary.totalEntries / daysInMonth) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-text-secondary">Loading monthly view...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Month Summary */}
      <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-text-primary mb-2">📅 {getMonthName()}</h2>
          <p className="text-text-secondary">Your monthly journal overview</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4">
            <p className="text-sm text-indigo-700 font-medium">Completion Rate</p>
            <p className="text-3xl font-bold text-indigo-900">{getCompletionRate()}%</p>
            <p className="text-xs text-indigo-600 mt-1">{monthSummary.totalEntries} days logged</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4">
            <p className="text-sm text-yellow-700 font-medium">Avg Mood</p>
            <p className="text-3xl font-bold text-yellow-900">{monthSummary.avgMood}/10</p>
            <p className="text-xs text-yellow-600 mt-1">This month</p>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4">
            <p className="text-sm text-pink-700 font-medium">Avg Energy</p>
            <p className="text-3xl font-bold text-pink-900">{monthSummary.avgEnergy}/10</p>
            <p className="text-xs text-pink-600 mt-1">This month</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
            <p className="text-sm text-green-700 font-medium">Best Day</p>
            <p className="text-2xl font-bold text-green-900">{monthSummary.bestDay.date || 'N/A'}</p>
            <p className="text-xs text-green-600 mt-1">
              {monthSummary.bestDay.score > 0 ? `Mood: ${monthSummary.bestDay.score}/10` : 'No data'}
            </p>
          </div>
        </div>
      </section>

      {/* Calendar View */}
      <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold text-text-primary mb-6">📊 Calendar Heatmap</h2>
        
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-text-secondary py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {monthData.map((entry, index) => (
            <div
              key={index}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center transition-all ${
                entry.day === 0
                  ? 'bg-transparent'
                  : entry.hasEntry
                  ? `${getMoodColor(entry.moodScore)} hover:shadow-md cursor-pointer`
                  : 'bg-gray-100 border border-gray-200 hover:bg-gray-200'
              }`}
              title={
                entry.hasEntry && entry.moodScore
                  ? `${entry.date.toLocaleDateString()}: Mood ${entry.moodScore}/10, Energy ${entry.energyLevel}/10`
                  : entry.day > 0
                  ? `${entry.date.toLocaleDateString()}: No entry`
                  : ''
              }
            >
              {entry.day > 0 && (
                <span
                  className={`text-sm font-semibold ${
                    entry.hasEntry ? 'text-white' : 'text-gray-600'
                  }`}
                >
                  {entry.day}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-4 text-sm">
          <span className="text-text-secondary">Mood:</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-100 border border-gray-200"></div>
            <span className="text-xs text-text-tertiary">No entry</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-400"></div>
            <span className="text-xs text-text-tertiary">Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-400"></div>
            <span className="text-xs text-text-tertiary">Fair</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-400"></div>
            <span className="text-xs text-text-tertiary">Good</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-400"></div>
            <span className="text-xs text-text-tertiary">Excellent</span>
          </div>
        </div>
      </section>

      {/* Monthly Insights */}
      {monthSummary.totalEntries > 0 && (
        <section className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-text-primary mb-4">💡 Monthly Insights</h2>
          <div className="space-y-3 text-text-secondary">
            <p>
              • You've journaled <span className="font-semibold text-indigo-600">{monthSummary.totalEntries} days</span> this month
            </p>
            <p>
              • Your average mood was <span className="font-semibold text-yellow-600">{monthSummary.avgMood}/10</span>
            </p>
            <p>
              • Your average energy level was <span className="font-semibold text-pink-600">{monthSummary.avgEnergy}/10</span>
            </p>
            {getCompletionRate() >= 80 && (
              <p className="text-green-600 font-semibold">
                🎉 Awesome! You're maintaining a consistent journaling habit!
              </p>
            )}
            {getCompletionRate() < 50 && (
              <p className="text-orange-600 font-semibold">
                💪 Try to journal more consistently to build a better habit!
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
