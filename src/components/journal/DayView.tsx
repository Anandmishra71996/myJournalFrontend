'use client';

interface JournalData {
  whatHappened: string;
  wins: string[];
  challenges: string[];
  gratitude: string[];
  lessonsLearned: string;
  moodScore: number;
  energyLevel: number;
}

interface PlanData {
  tasks: { title: string; priority: 'high' | 'medium' | 'low' }[];
  intentions: string[];
  focusAreas: string[];
}

interface DayViewProps {
  journalData: JournalData;
  planData: PlanData;
  saving: boolean;
  setJournalData: React.Dispatch<React.SetStateAction<JournalData>>;
  setPlanData: React.Dispatch<React.SetStateAction<PlanData>>;
  saveJournal: (isComplete: boolean) => Promise<void>;
  addArrayItem: (field: string, isJournal: boolean) => void;
  updateArrayItem: (field: string, index: number, value: any, isJournal: boolean) => void;
}

export default function DayView({
  journalData,
  planData,
  saving,
  setJournalData,
  setPlanData,
  saveJournal,
  addArrayItem,
  updateArrayItem,
}: DayViewProps) {
  return (
    <>
      {/* Today's Log Section */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">📝 Today's Reflection</h2>
          <p className="text-gray-600 dark:text-gray-400">Capture your day, thoughts, and feelings</p>
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
              placeholder="Share your day's story..."
            />
          </div>

          {/* Mood & Energy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Mood Score: {journalData.moodScore}/10
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
                <span>Difficult</span>
                <span>Excellent</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Energy Level: {journalData.energyLevel}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={journalData.energyLevel}
                onChange={(e) => setJournalData(prev => ({ ...prev, energyLevel: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600 dark:accent-purple-400"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>Drained</span>
                <span>Energized</span>
              </div>
            </div>
          </div>

          {/* Wins */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              🎉 Today's Wins
            </label>
            {journalData.wins.map((win, index) => (
              <input
                key={index}
                type="text"
                value={win}
                onChange={(e) => updateArrayItem('wins', index, e.target.value, true)}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-400 focus:border-transparent mb-2"
                placeholder={`Win #${index + 1}`}
              />
            ))}
            <button
              onClick={() => addArrayItem('wins', true)}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
            >
              + Add another win
            </button>
          </div>

          {/* Challenges */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              🎯 Challenges Faced
            </label>
            {journalData.challenges.map((challenge, index) => (
              <input
                key={index}
                type="text"
                value={challenge}
                onChange={(e) => updateArrayItem('challenges', index, e.target.value, true)}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-400 focus:border-transparent mb-2"
                placeholder={`Challenge #${index + 1}`}
              />
            ))}
            <button
              onClick={() => addArrayItem('challenges', true)}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
            >
              + Add another challenge
            </button>
          </div>

          {/* Gratitude */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              🙏 Grateful For
            </label>
            {journalData.gratitude.map((item, index) => (
              <input
                key={index}
                type="text"
                value={item}
                onChange={(e) => updateArrayItem('gratitude', index, e.target.value, true)}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-400 focus:border-transparent mb-2"
                placeholder={`Gratitude #${index + 1}`}
              />
            ))}
            <button
              onClick={() => addArrayItem('gratitude', true)}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
            >
              + Add more gratitude
            </button>
          </div>

          {/* Lessons Learned */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              💡 Lessons Learned
            </label>
            <textarea
              value={journalData.lessonsLearned}
              onChange={(e) => setJournalData(prev => ({ ...prev, lessonsLearned: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-400 focus:border-transparent resize-none"
              rows={3}
              placeholder="What insights did you gain today?"
            />
          </div>
        </div>
      </section>

      {/* Tomorrow's Plan Section */}
      <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">🌅 Tomorrow's Plan</h2>
          <p className="text-gray-600 dark:text-gray-400">Set intentions and prepare for success</p>
        </div>

        <div className="space-y-6">
          {/* Tasks */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              ✅ Tasks to Complete
            </label>
            {planData.tasks.map((task, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={task.title}
                  onChange={(e) => updateArrayItem('tasks', index, { ...task, title: e.target.value }, false)}
                  className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-400 focus:border-transparent"
                  placeholder={`Task #${index + 1}`}
                />
                <select
                  value={task.priority}
                  onChange={(e) => updateArrayItem('tasks', index, { ...task, priority: e.target.value as 'high' | 'medium' | 'low' }, false)}
                  className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-400 focus:border-transparent"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            ))}
            <button
              onClick={() => addArrayItem('tasks', false)}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
            >
              + Add another task
            </button>
          </div>

          {/* Intentions */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              🎯 Daily Intentions
            </label>
            {planData.intentions.map((intention, index) => (
              <input
                key={index}
                type="text"
                value={intention}
                onChange={(e) => updateArrayItem('intentions', index, e.target.value, false)}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-400 focus:border-transparent mb-2"
                placeholder={`Intention #${index + 1}`}
              />
            ))}
            <button
              onClick={() => addArrayItem('intentions', false)}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
            >
              + Add another intention
            </button>
          </div>

          {/* Focus Areas */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              🔍 Focus Areas
            </label>
            {planData.focusAreas.map((area, index) => (
              <input
                key={index}
                type="text"
                value={area}
                onChange={(e) => updateArrayItem('focusAreas', index, e.target.value, false)}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-400 focus:border-transparent mb-2"
                placeholder={`Focus area #${index + 1}`}
              />
            ))}
            <button
              onClick={() => addArrayItem('focusAreas', false)}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
            >
              + Add another focus area
            </button>
          </div>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex flex-col xs:flex-row justify-end gap-3 pb-8 mt-6 xs:mt-8">
        <button 
          onClick={() => saveJournal(false)}
          disabled={saving}
          className="w-full xs:w-auto px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Draft'}
        </button>
        <button 
          onClick={() => saveJournal(true)}
          disabled={saving}
          className="w-full xs:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {saving ? 'Saving...' : 'Save & Complete'}
        </button>
      </div>
    </>
  );
}
