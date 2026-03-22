"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  Goal,
  GOAL_TYPES_OPTIONS,
  MAX_GOALS,
  GoalStats,
} from "@/constants/goal.constants";
import {
  Sparkles,
  Target,
  ChevronDown,
  ChevronUp,
  Circle,
  CheckCircle2,
  Zap,
  Plus,
  WandSparkles,
} from "lucide-react";
import GoalBreakdownModal from "@/components/goals/GoalBreakdownModal";
import { toastService } from "@/services/toast.service";
import ConfirmationModal from "@/components/common/ConfirmationModal";

export default function GoalsPage() {
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [stats, setStats] = useState<GoalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showBreakdownModal, setShowBreakdownModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set());
  const [goalFilter, setGoalFilter] = useState<
    "all" | "active" | "completed" | "past"
  >("all");

  useEffect(() => {
    fetchGoals();
    fetchStats();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await api.get("/goals");
      if (response.data.success) {
        setGoals(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch goals:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get("/goals/stats");
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const handleStatusChange = async (goalId: string, newStatus: string) => {
    setActionLoading(goalId);
    try {
      const response = await api.patch(`/goals/${goalId}/status`, {
        status: newStatus,
      });
      if (response.data.success) {
        setGoals(
          goals.map((g) =>
            g._id === goalId ? { ...g, status: newStatus as any } : g,
          ),
        );
        fetchStats();
      }
    } catch (error: any) {
      toastService.error(
        "Failed to Update Goal",
        error.response?.data?.error || "Could not update goal status",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (goalId: string) => {
    setGoalToDelete(goalId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!goalToDelete) return;

    setActionLoading(goalToDelete);
    try {
      const response = await api.delete(`/goals/${goalToDelete}`);
      if (response.data.success) {
        setGoals(goals.filter((g) => g._id !== goalToDelete));
        fetchStats();
        toastService.success("Goal archived successfully");
      }
    } catch (error: any) {
      toastService.error(
        "Failed to Archive Goal",
        error.response?.data?.error || "Could not archive goal",
      );
    } finally {
      setActionLoading(null);
      setShowDeleteModal(false);
      setGoalToDelete(null);
    }
  };

  const canCreateGoal = (type: string) => {
    if (!stats) return true;
    const typeStats = stats[type as keyof GoalStats];
    if (!typeStats) return true;
    const maxForType = MAX_GOALS[type as keyof typeof MAX_GOALS];
    return typeStats.active < maxForType;
  };

  const getGoalsByType = (type: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return goals.filter((goal) => {
      if (goal.type !== type || goal.status === "archived") {
        return false;
      }

      if (goalFilter === "all") {
        return true;
      }

      if (goalFilter === "active") {
        return goal.status === "active";
      }

      if (goalFilter === "completed") {
        return goal.status === "completed";
      }

      const hasEndDate = !!goal.endDate;
      if (!hasEndDate) {
        return false;
      }

      const endDate = new Date(goal.endDate!);
      if (Number.isNaN(endDate.getTime())) {
        return false;
      }

      endDate.setHours(0, 0, 0, 0);
      return endDate < today;
    });
  };

  const toggleGoalExpanded = (goalId: string) => {
    setExpandedGoals((prev) => {
      const next = new Set(prev);
      if (next.has(goalId)) next.delete(goalId);
      else next.add(goalId);
      return next;
    });
  };

  const hasBreakdownData = (goal: Goal) =>
    (goal.milestones && goal.milestones.length > 0) ||
    (goal.actionSteps && goal.actionSteps.length > 0) ||
    (goal.weeklyPlan && goal.weeklyPlan.length > 0);

  const renderGoalCard = (goal: Goal) => {
    const isLoading = actionLoading === goal._id;
    const isExpanded = expandedGoals.has(goal._id);
    const hasBreakdown = hasBreakdownData(goal);
    const completedMilestones =
      goal.milestones?.filter((m) => m.status === "completed").length ?? 0;
    const totalMilestones = goal.milestones?.length ?? 0;
    const progressPct =
      goal.progress?.completionPercentage ??
      (totalMilestones > 0
        ? Math.round((completedMilestones / totalMilestones) * 100)
        : null);

    return (
      <div
        key={goal._id}
        className="group relative rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-low)] p-6 transition-all duration-200 hover:bg-[var(--color-surface-high)]"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-[var(--color-text-primary)]">
                {goal.title}
              </h3>
              {goal.generatedBy === "agent" && (
                <span
                  title="Generated by AI"
                  className="inline-flex items-center gap-0.5 rounded-full border border-[var(--color-goal-chip-border)] bg-[var(--color-goal-chip-surface)] px-2 py-0.5 text-xs font-semibold text-[var(--color-secondary-dark)] dark:text-[var(--color-secondary-light)]"
                >
                  <Sparkles className="w-3 h-3" />
                  AI
                </span>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="inline-flex items-center rounded-md bg-[var(--color-surface-highest)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-secondary)]">
                {goal.category}
              </span>
              {goal.status === "completed" && (
                <span className="inline-flex items-center rounded-full bg-[var(--color-status-success-soft)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-status-success-text)]">
                  Completed
                </span>
              )}
              {goal.status === "paused" && (
                <span className="inline-flex items-center rounded-full bg-[var(--color-status-warning-soft)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-status-warning-text)]">
                  Paused
                </span>
              )}
            </div>
          </div>
        </div>

        {goal.why && (
          <p className="mb-4 text-sm text-[var(--color-text-secondary)]">
            {goal.why}
          </p>
        )}

        {/* Progress bar for milestone-based goals */}
        {hasBreakdown && progressPct !== null && (
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-[var(--color-text-secondary)]">
                Progress
              </span>
              <span className="text-xs font-semibold text-[var(--color-primary)]">
                {progressPct}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-[var(--color-surface-highest)]">
              <div
                className="h-1.5 rounded-full bg-gradient-to-r from-[var(--color-primary-dark)] to-[var(--color-primary)] transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            {totalMilestones > 0 && (
              <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                {completedMilestones}/{totalMilestones} milestones
              </p>
            )}
          </div>
        )}

        {/* Date Boundary Display */}
        {!goal.isRepetitive && goal.startDate && goal.endDate && (
          <div className="mb-3">
            <p className="text-xs text-[var(--color-text-secondary)]">
              Applies from{" "}
              {new Date(goal.startDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}{" "}
              to{" "}
              {new Date(goal.endDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        )}

        {goal.trackingMethods.length > 0 && (
          <div className="mb-3">
            <p className="mb-1 text-xs font-medium text-[var(--color-text-secondary)]">
              Tracking via:
            </p>
            <div className="flex flex-wrap gap-1">
              {goal.trackingMethods.map((method) => (
                <span
                  key={method}
                  className="rounded bg-[var(--color-surface-highest)] px-2 py-1 text-xs text-[var(--color-text-primary)]"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Breakdown toggle */}
        {hasBreakdown && (
          <button
            onClick={() => toggleGoalExpanded(goal._id)}
            className="mb-3 flex w-full items-center justify-between rounded-lg border border-[var(--color-goal-breakdown-border)] bg-[var(--color-goal-breakdown-bg)] px-3 py-2 text-sm font-medium text-[var(--color-goal-breakdown-text)] transition-colors hover:bg-[var(--color-goal-breakdown-hover)]"
          >
            <span className="flex items-center gap-1.5">
              <Target className="w-4 h-4" />
              View Breakdown Plan
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Expanded breakdown details */}
        {hasBreakdown && isExpanded && (
          <div className="mb-4 space-y-4 border-t border-[var(--color-outline-variant)] pt-3">
            {/* Milestones */}
            {goal.milestones && goal.milestones.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Milestones
                </p>
                <div className="space-y-1.5">
                  {goal.milestones.map((m, i) => (
                    <div key={i} className="flex items-start gap-2">
                      {m.status === "completed" ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--color-status-success-text)]" />
                      ) : (
                        <Circle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--color-text-tertiary)]" />
                      )}
                      <div>
                        <p
                          className={`text-sm ${m.status === "completed" ? "line-through text-[var(--color-text-tertiary)]" : "text-[var(--color-text-primary)]"}`}
                        >
                          {m.title}
                        </p>
                        {m.targetDate && (
                          <p className="text-xs text-[var(--color-secondary)]">
                            by{" "}
                            {new Date(m.targetDate).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" },
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Week 1 focus */}
            {goal.weeklyPlan && goal.weeklyPlan.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Week 1 Focus
                </p>
                <div className="rounded-lg bg-[var(--color-surface-highest)] p-3">
                  <p className="mb-1 text-xs font-medium text-[var(--color-primary)]">
                    {goal.weeklyPlan[0].focus}
                  </p>
                  <ul className="space-y-1">
                    {goal.weeklyPlan[0].actions.map((action, ai) => (
                      <li
                        key={ai}
                        className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]"
                      >
                        <span className="h-1 w-1 flex-shrink-0 rounded-full bg-[var(--color-primary)]" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Action steps */}
            {goal.actionSteps && goal.actionSteps.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Daily & Weekly Actions
                </p>
                <div className="space-y-1.5">
                  {goal.actionSteps.map((step, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-lg bg-[var(--color-surface-highest)] px-3 py-2"
                    >
                      <Zap className="h-3.5 w-3.5 flex-shrink-0 text-[var(--color-secondary)]" />
                      <span className="flex-1 text-xs text-[var(--color-text-primary)]">
                        {step.title}
                      </span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${
                          step.frequency === "daily"
                            ? "bg-[var(--color-status-warning-soft)] text-[var(--color-status-warning-text)]"
                            : "bg-[var(--color-status-info-soft)] text-[var(--color-status-info-text)]"
                        }`}
                      >
                        {step.frequency}
                      </span>
                      {step.estimatedMinutes && (
                        <span className="flex-shrink-0 text-xs text-[var(--color-text-tertiary)]">
                          {step.estimatedMinutes}m
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => router.push(`/goals/${goal._id}/edit`)}
            disabled={isLoading}
            className="flex-1 rounded-lg border border-[var(--color-outline-variant)] bg-[var(--color-surface)] px-3 py-2 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-surface-highest)] disabled:opacity-50"
          >
            Edit
          </button>

          {goal.status === "active" && (
            <>
              <button
                onClick={() => handleStatusChange(goal._id, "paused")}
                disabled={isLoading}
                className="flex-1 rounded-lg bg-[var(--color-status-warning-soft)] px-3 py-2 text-sm font-medium text-[var(--color-status-warning-text)] hover:bg-[var(--color-status-warning-soft)]/80 disabled:opacity-50"
              >
                Pause
              </button>
              <button
                onClick={() => handleStatusChange(goal._id, "completed")}
                disabled={isLoading}
                className="flex-1 rounded-lg bg-[var(--color-primary-dark)]/20 px-3 py-2 text-sm font-medium text-[var(--color-secondary-light)] hover:bg-[var(--color-primary-dark)]/30 disabled:opacity-50"
              >
                Complete
              </button>
            </>
          )}

          {goal.status === "paused" && (
            <button
              onClick={() => handleStatusChange(goal._id, "active")}
              disabled={isLoading}
              className="flex-1 rounded-lg bg-[var(--color-status-success-soft)] px-3 py-2 text-sm font-medium text-[var(--color-status-success-text)] hover:bg-[var(--color-status-success-soft)]/80 disabled:opacity-50"
            >
              Resume
            </button>
          )}

          {goal.status === "completed" && (
            <button
              onClick={() => handleDelete(goal._id)}
              disabled={isLoading}
              className="flex-1 rounded-lg bg-[var(--color-status-danger-soft)] px-3 py-2 text-sm font-medium text-[var(--color-status-danger-text)] hover:bg-[var(--color-status-danger-soft)]/80 disabled:opacity-50"
            >
              Archive
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderGoalSection = (type: string, label: string) => {
    const typeGoals = getGoalsByType(type);
    const canCreate = canCreateGoal(type);
    const maxForType = MAX_GOALS[type as keyof typeof MAX_GOALS];
    const activeCount = stats?.[type as keyof GoalStats]?.active || 0;
    const completedCount = stats?.[type as keyof GoalStats]?.completed || 0;
    const pausedCount = stats?.[type as keyof GoalStats]?.paused || 0;

    return (
      <div key={type} className="mb-8">
        <div className="mb-5 flex items-center gap-4">
          <h2 className="text-sm font-bold uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
            {label}
          </h2>
          <div className="h-px flex-1 bg-[var(--color-outline-variant)]" />
        </div>
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => router.push(`/goals/create?type=${type}`)}
            disabled={!canCreate}
            className="rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface)] px-4 py-2 text-sm font-semibold text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-surface-highest)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {canCreate ? `Add ${label}` : `Limit Reached`}
          </button>
        </div>

        {typeGoals.length === 0 ? (
          <div className="rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-low)] p-8 text-center">
            <p className="mb-2 text-[var(--color-text-secondary)]">
              No {label.toLowerCase()} in this view
            </p>
            <p className="text-sm text-[var(--color-text-tertiary)]">
              {goalFilter === "all"
                ? `Create your first ${label.toLowerCase()} to get started`
                : `Try a different filter to view more ${label.toLowerCase()}`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {typeGoals.map(renderGoalCard)}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] p-8 text-[var(--color-text-primary)]">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="mb-8 h-8 w-1/4 rounded bg-[var(--color-surface-highest)]"></div>
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <div className="mb-4 h-6 w-1/6 rounded bg-[var(--color-surface-highest)]"></div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2].map((j) => (
                      <div
                        key={j}
                        className="h-48 rounded-xl bg-[var(--color-surface-highest)]"
                      ></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] p-8 text-[var(--color-text-primary)]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <div className="mb-2 flex items-center justify-center gap-3 md:justify-start">
            <img src="/logo.svg" alt="Journal Logo" className="h-10 w-10" />
            <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-text-primary)] md:text-5xl">
              My Goals
            </h1>
          </div>
          <p className="mx-auto mb-6 max-w-2xl text-center text-[var(--color-text-secondary)] md:mx-0 md:text-left">
            Orchestrate your evolution through intentional deep work and
            periodic reflection.
          </p>

          <div className="mb-6 flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <button
              onClick={() => router.push("/goals/create")}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-low)] px-5 py-2.5 font-semibold text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-surface-high)]"
            >
              <Plus className="h-4 w-4" />
              Add Goal
            </button>
            <button
              onClick={() => setShowBreakdownModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-[var(--color-secondary-dark)] to-[var(--color-secondary)] px-5 py-2.5 font-bold text-[var(--color-goal-cta-text)] transition-all hover:shadow-[0_0_20px_var(--color-goal-ai-glow)]"
            >
              <WandSparkles className="h-4 w-4" />
              Generate with AI
            </button>
          </div>

          <section className="relative mb-8 overflow-hidden rounded-2xl border border-[var(--color-goal-ai-border)] bg-[var(--color-goal-ai-surface)] p-6 backdrop-blur-xl md:p-8">
            <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-[var(--color-goal-ai-glow)] blur-3xl" />
            <div className="relative z-10 flex flex-col items-start gap-4 md:flex-row md:items-center">
              <div className="rounded-2xl bg-[var(--color-goal-chip-surface)] p-3">
                <Sparkles className="h-8 w-8 text-[var(--color-secondary)]" />
              </div>
              <div className="flex-1">
                <h3 className="mb-1 text-xl font-bold text-[var(--color-secondary)]">
                  AI Goal Architect
                </h3>
                <p className="mb-3 text-sm text-[var(--color-text-secondary)] md:text-base">
                  You currently have {stats?.yearly?.active || 0} active yearly
                  goals. Generate a realistic breakdown with daily time
                  commitment and linked weekly checkpoints.
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setShowBreakdownModal(true)}
                    className="rounded-full border border-[var(--color-goal-chip-border)] bg-[var(--color-goal-chip-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--color-secondary)] transition-colors hover:bg-[var(--color-secondary)]/18"
                  >
                    Break down goal
                  </button>
                  <button
                    onClick={() => setShowBreakdownModal(true)}
                    className="rounded-full border border-[var(--color-goal-chip-border)] bg-[var(--color-goal-chip-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--color-secondary)] transition-colors hover:bg-[var(--color-secondary)]/18"
                  >
                    Optimize timeline
                  </button>
                </div>
              </div>
            </div>
          </section>

          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {[
              { value: "all", label: "All Goals" },
              { value: "active", label: "Active" },
              { value: "completed", label: "Completed" },
              { value: "past", label: "Past" },
            ].map((filter) => {
              const isActive = goalFilter === filter.value;
              return (
                <button
                  key={filter.value}
                  onClick={() =>
                    setGoalFilter(
                      filter.value as "all" | "active" | "completed" | "past",
                    )
                  }
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[var(--color-goal-filter-active-bg)] text-[var(--color-goal-filter-active-text)]"
                      : "border border-[var(--color-outline-variant)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-high)]"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {GOAL_TYPES_OPTIONS.map((type) =>
          renderGoalSection(type.value, type.label),
        )}

        {/* Goal Breakdown Modal */}
        {showBreakdownModal && (
          <GoalBreakdownModal
            onClose={() => setShowBreakdownModal(false)}
            onPlanCreated={() => {
              fetchGoals();
              fetchStats();
            }}
          />
        )}

        {/* Confirmation Modal for Delete */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setGoalToDelete(null);
          }}
          onConfirm={confirmDelete}
          title="Archive Goal?"
          message="Are you sure you want to archive this goal? This action can be undone by restoring the goal later."
          confirmText="Archive"
          cancelText="Cancel"
          confirmVariant="danger"
          isLoading={actionLoading === goalToDelete}
        />
      </div>
    </div>
  );
}
