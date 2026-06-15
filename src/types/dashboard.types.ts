export interface ActivityDay {
  date: string;
  count: number;
  types: ('morning' | 'evening' | 'anytime')[];
}

export interface JournalStats {
  byType: { morning: number; evening: number; anytime: number };
  topTags: { tag: string; count: number }[];
  templateUsage: { templateId: string; name: string; count: number }[];
  voiceNoteCount: number;
  totalVoiceSeconds: number;
}

export interface TaskStats {
  pending: number;
  in_progress: number;
  done: number;
  skipped: number;
  overdue: number;
  completedToday: number;
}

export interface BehavioralMetrics {
  metrics: {
    weekStart: string;
    weekEnd: string;
    totalEntriesAnalyzed: number;
    avgActionRatio: number;
    avgEmotionalIntensity: number;
    growthMindsetRatio: number;
    fixedMindsetRatio: number;
    mixedMindsetRatio: number;
    internalLocusRatio: number;
    externalLocusRatio: number;
    procrastinationFrequency: number;
    burnoutFrequency: number;
    resilienceFrequency: number;
    trend: {
      actionTrend: 'improving' | 'declining' | 'stable';
      emotionTrend: 'improving' | 'declining' | 'stable';
      motivationTrend: 'improving' | 'declining' | 'stable';
    };
  } | null;
  aiProfile: {
    executionConsistencyScore?: number;
    resilienceIndex?: number;
    agencyScore?: number;
    volatilityIndex?: number;
    dominantMindset?: 'growth' | 'fixed' | 'mixed';
    dominantLocus?: 'internal' | 'external' | 'mixed';
    contradictionFlags?: string[];
    lastProfileUpdate?: string;
  } | null;
}

export interface MemoryPattern {
  _id: string;
  patternType: string;
  content: string;
  category?: string;
  confidence: number;
  evidenceCount: number;
  status: 'active' | 'fading' | 'historical' | 'invalidated';
  firstDetected: string;
  lastSeen: string;
}

export interface DashboardGoal {
  _id: string;
  title: string;
  type: 'weekly' | 'monthly' | 'yearly';
  category: string;
  status: 'active' | 'completed' | 'paused' | 'archived';
  progress?: {
    completionPercentage?: number;
    lastActivityDate?: string;
    signalHitRate?: number;
  };
}

export interface LatestInsight {
  _id: string;
  weekStart: string;
  weekEnd: string;
  journalCount: number;
  reflection: string[];
  suggestion?: string;
  challengesFaced: {
    challengeType: string;
    title: string;
    evidence: string;
  }[];
  goalSummaries: {
    goalId: string;
    goalTitle: string;
    status: 'aligned' | 'partially_aligned' | 'needs_adjustment';
    explanation: string;
  }[];
}

export interface DashboardFilters {
  timeRange: '7d' | '30d' | '90d';
  journalType: 'all' | 'morning' | 'evening' | 'anytime';
  goalCategory: 'all' | 'Health' | 'Career' | 'Learning' | 'Mindset' | 'Relationships' | 'Personal';
}
