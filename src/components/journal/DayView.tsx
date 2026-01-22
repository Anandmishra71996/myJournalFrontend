'use client';

interface JournalData {
  whatHappened: string;
  moodScore: number;
  keyHighlights: string;
}

interface DayViewProps {
  journalData: JournalData;
  saving: boolean;
  journalId: string | null;
  setJournalData: React.Dispatch<React.SetStateAction<JournalData>>;
  saveJournal: (isComplete: boolean) => Promise<void>;
}

export default function DayView({
  journalData,
  saving,
  journalId,
  setJournalData,
  saveJournal,
}: DayViewProps) {
  return (
    <>
      {/* Today's Reflection Section */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">📝 Today's Reflection</h2>
          <p className="text-gray-600 dark:text-gray-400">Capture your thoughts, feelings, and moments from today</p>
        </div>

        <div className="space-y-6">
          {/* What Happened Today */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              What happened today?
            </label>
            <textarea
              value={journalData.whatHappened}
              onChange={(e) => setJournalData(prev => ({ ...prev, whatHappened: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-400 focus:border-transparent resize-none transition-all"
              rows={4}
              placeholder="Share your day's story, key events, and experiences..."
            />
          </div>

          {/* Mood Score */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
              How was your mood today? {journalData.moodScore}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={journalData.moodScore}
              onChange={(e) => setJournalData(prev => ({ ...prev, moodScore: parseInt(e.target.value) }))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-400"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>Not great</span>
              <span>Excellent</span>
            </div>
          </div>

          {/* Key Highlights - Important Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              ⭐ Key Highlights & Important Notes
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Anything you want to highlight, remember, or that stands out from today
            </p>
            <textarea
              value={journalData.keyHighlights}
              onChange={(e) => setJournalData(prev => ({ ...prev, keyHighlights: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-400 focus:border-transparent resize-none transition-all"
              rows={3}
              placeholder="E.g., Had a great conversation with Sarah, completed the project, learned something new about myself..."
            />
          </div>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex flex-col xs:flex-row justify-end gap-3 pb-8 mt-6 xs:mt-8">
        {/* <button 
          onClick={() => saveJournal(false)}
          disabled={saving}
          className="w-full xs:w-auto px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : journalId ? 'Update Draft' : 'Save Draft'}
        </button> */}
        <button 
          onClick={() => saveJournal(true)}
          disabled={saving}
          className="w-full xs:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {saving ? 'Saving...' : journalId ? 'Update' : 'Save'}
        </button>
      </div>
    </>
  );
}
