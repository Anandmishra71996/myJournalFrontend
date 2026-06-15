"use client";

import { useState, useEffect, useCallback } from "react";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { dashboardService } from "@/services/dashboard.service";
import HeroStrip from "@/components/dashboard/HeroStrip";
import GlobalFilters from "@/components/dashboard/GlobalFilters";
import JournalActivity from "@/components/dashboard/JournalActivity";
import GoalSection from "@/components/dashboard/GoalSection";
import BehavioralIntelligence from "@/components/dashboard/BehavioralIntelligence";
import InsightSnapshot from "@/components/dashboard/InsightSnapshot";
import TaskSnapshot from "@/components/dashboard/TaskSnapshot";
import SubscriptionUsage from "@/components/dashboard/SubscriptionUsage";
import type {
  ActivityDay,
  JournalStats,
  TaskStats,
  BehavioralMetrics,
  MemoryPattern,
  DashboardGoal,
  LatestInsight,
  DashboardFilters,
} from "@/types/dashboard.types";
import type { Task } from "@/types/task.types";

const TIME_RANGE_DAYS: Record<DashboardFilters["timeRange"], number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

export default function DashboardPage() {
  const { featureLimits, fetchSubscription } = useSubscriptionStore();

  const [filters, setFilters] = useState<DashboardFilters>({
    timeRange: "30d",
    journalType: "all",
    goalCategory: "all",
  });

  const [activity, setActivity] = useState<ActivityDay[]>([]);
  const [journalStats, setJournalStats] = useState<JournalStats | null>(null);
  const [goals, setGoals] = useState<DashboardGoal[]>([]);
  const [latestInsight, setLatestInsight] = useState<LatestInsight | null>(null);
  const [behavioralData, setBehavioralData] = useState<BehavioralMetrics | null>(null);
  const [memories, setMemories] = useState<MemoryPattern[]>([]);
  const [taskStats, setTaskStats] = useState<TaskStats | null>(null);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const days = TIME_RANGE_DAYS[filters.timeRange];
  const hasAdvancedAccess = featureLimits.allowAdvancedInsights;

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [
        activityData,
        statsData,
        goalsData,
        insightData,
        taskStatsData,
        todayTasksData,
      ] = await Promise.allSettled([
        dashboardService.getActivity(days, filters.journalType),
        dashboardService.getJournalStats(days),
        dashboardService.getGoals(filters.goalCategory),
        dashboardService.getLatestInsight(),
        dashboardService.getTaskStats(),
        dashboardService.getTodayTasks(),
      ]);

      if (activityData.status === "fulfilled") setActivity(activityData.value);
      if (statsData.status === "fulfilled") setJournalStats(statsData.value);
      if (goalsData.status === "fulfilled") setGoals(goalsData.value);
      if (insightData.status === "fulfilled") setLatestInsight(insightData.value);
      if (taskStatsData.status === "fulfilled") setTaskStats(taskStatsData.value);
      if (todayTasksData.status === "fulfilled") setTodayTasks(todayTasksData.value);

      // Load behavioral data & memory patterns separately (may fail on free tier gracefully)
      if (hasAdvancedAccess) {
        const [behavioralResult, memoriesResult] = await Promise.allSettled([
          dashboardService.getBehavioralMetrics(),
          dashboardService.getMemoryPatterns(),
        ]);
        if (behavioralResult.status === "fulfilled") setBehavioralData(behavioralResult.value);
        if (memoriesResult.status === "fulfilled") setMemories(memoriesResult.value);
      }
    } finally {
      setLoading(false);
    }
  }, [days, filters.journalType, filters.goalCategory, hasAdvancedAccess]);

  useEffect(() => {
    fetchSubscription().catch(() => {});
  }, [fetchSubscription]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleFilterChange = (partial: Partial<DashboardFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  const handleTaskDone = (taskId: string) => {
    setTodayTasks((prev) => prev.filter((t) => t._id !== taskId));
    setTaskStats((prev) =>
      prev
        ? { ...prev, pending: Math.max(0, prev.pending - 1), done: prev.done + 1 }
        : prev
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-[var(--color-surface-low)]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-5">
        <HeroStrip activity={activity} />

        <GlobalFilters filters={filters} onChange={handleFilterChange} />

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Left column: journaling + behavioral */}
          <div className="space-y-5 lg:col-span-5">
            <JournalActivity activity={activity} stats={journalStats} days={days} />
            <BehavioralIntelligence
              data={behavioralData}
              memories={memories}
              hasAccess={hasAdvancedAccess}
            />
          </div>

          {/* Right column: goals + insight + tasks */}
          <div className="space-y-5 lg:col-span-7">
            <GoalSection goals={goals} latestInsight={latestInsight} />
            <InsightSnapshot insight={latestInsight} hasAccess={hasAdvancedAccess} />
            <TaskSnapshot
              stats={taskStats}
              todayTasks={todayTasks}
              onTaskDone={handleTaskDone}
            />
            <SubscriptionUsage />
          </div>
        </div>
      </div>
    </div>
  );
}
