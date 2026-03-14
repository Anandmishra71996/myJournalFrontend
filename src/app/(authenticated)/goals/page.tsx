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
} from "lucide-react";
import GoalGeneratorChat from "@/components/goals/GoalGeneratorChat";
import GoalBreakdownModal from "@/components/goals/GoalBreakdownModal";
import { toastService } from "@/services/toast.service";
import ConfirmationModal from "@/components/common/ConfirmationModal";

export default function GoalsPage() {
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [stats, setStats] = useState<GoalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showChatDrawer, setShowChatDrawer] = useState(false);
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
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {goal.title}
              </h3>
              {goal.generatedBy === "agent" && (
                <span
                  title="Generated by AI"
                  className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
                >
                  <Sparkles className="w-3 h-3" />
                  AI
                </span>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {goal.category}
              </span>
              {goal.status === "completed" && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Completed
                </span>
              )}
              {goal.status === "paused" && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Paused
                </span>
              )}
            </div>
          </div>
        </div>

        {goal.why && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {goal.why}
          </p>
        )}

        {/* Progress bar for milestone-based goals */}
        {hasBreakdown && progressPct !== null && (
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Progress
              </span>
              <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                {progressPct}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            {totalMilestones > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {completedMilestones}/{totalMilestones} milestones
              </p>
            )}
          </div>
        )}

        {/* Date Boundary Display */}
        {!goal.isRepetitive && goal.startDate && goal.endDate && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">
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
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Tracking via:
            </p>
            <div className="flex flex-wrap gap-1">
              {goal.trackingMethods.map((method) => (
                <span
                  key={method}
                  className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
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
            className="w-full flex items-center justify-between py-2 px-3 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg transition-colors mb-3 text-sm font-medium text-indigo-700 dark:text-indigo-300"
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
          <div className="mb-4 space-y-4 border-t border-gray-100 dark:border-gray-700 pt-3">
            {/* Milestones */}
            {goal.milestones && goal.milestones.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Milestones
                </p>
                <div className="space-y-1.5">
                  {goal.milestones.map((m, i) => (
                    <div key={i} className="flex items-start gap-2">
                      {m.status === "completed" ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p
                          className={`text-sm ${m.status === "completed" ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-700 dark:text-gray-300"}`}
                        >
                          {m.title}
                        </p>
                        {m.targetDate && (
                          <p className="text-xs text-purple-600 dark:text-purple-400">
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
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Week 1 Focus
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                  <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">
                    {goal.weeklyPlan[0].focus}
                  </p>
                  <ul className="space-y-1">
                    {goal.weeklyPlan[0].actions.map((action, ai) => (
                      <li
                        key={ai}
                        className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1.5"
                      >
                        <span className="w-1 h-1 rounded-full bg-blue-400 flex-shrink-0" />
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
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Daily & Weekly Actions
                </p>
                <div className="space-y-1.5">
                  {goal.actionSteps.map((step, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 rounded-lg px-3 py-2"
                    >
                      <Zap className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                      <span className="text-xs text-gray-700 dark:text-gray-300 flex-1">
                        {step.title}
                      </span>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${
                          step.frequency === "daily"
                            ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                            : "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400"
                        }`}
                      >
                        {step.frequency}
                      </span>
                      {step.estimatedMinutes && (
                        <span className="text-xs text-gray-400 flex-shrink-0">
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
            className="flex-1 px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 disabled:opacity-50"
          >
            Edit
          </button>

          {goal.status === "active" && (
            <>
              <button
                onClick={() => handleStatusChange(goal._id, "paused")}
                disabled={isLoading}
                className="flex-1 px-3 py-2 text-sm font-medium text-yellow-600 bg-yellow-50 rounded-lg hover:bg-yellow-100 disabled:opacity-50"
              >
                Pause
              </button>
              <button
                onClick={() => handleStatusChange(goal._id, "completed")}
                disabled={isLoading}
                className="flex-1 px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 disabled:opacity-50"
              >
                Complete
              </button>
            </>
          )}

          {goal.status === "paused" && (
            <button
              onClick={() => handleStatusChange(goal._id, "active")}
              disabled={isLoading}
              className="flex-1 px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 disabled:opacity-50"
            >
              Resume
            </button>
          )}

          {goal.status === "completed" && (
            <button
              onClick={() => handleDelete(goal._id)}
              disabled={isLoading}
              className="flex-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 disabled:opacity-50"
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
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {label}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {activeCount} of {maxForType} active goals • {completedCount}{" "}
              completed • {pausedCount} paused
            </p>
          </div>
          <button
            onClick={() => router.push(`/goals/create?type=${type}`)}
            disabled={!canCreate}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {canCreate ? `Add ${label}` : `Limit Reached`}
          </button>
        </div>

        {typeGoals.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              No {label.toLowerCase()} in this view
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {goalFilter === "all"
                ? `Create your first ${label.toLowerCase()} to get started`
                : `Try a different filter to view more ${label.toLowerCase()}`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {typeGoals.map(renderGoalCard)}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/6 mb-4"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2].map((j) => (
                      <div
                        key={j}
                        className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img src="/logo.svg" alt="Journal Logo" className="w-10 h-10" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              My Goals
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
            Track your weekly, monthly, and yearly goals
          </p>

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
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          {/* AI Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setShowChatDrawer(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Sparkles className="w-4 h-4" />
              Generate Goals with AI
            </button>
            <button
              onClick={() => setShowBreakdownModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-medium rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all shadow-md hover:shadow-lg"
            >
              <Target className="w-4 h-4" />
              Break Down Goal with AI
            </button>
          </div>
        </div>

        {GOAL_TYPES_OPTIONS.map((type) =>
          renderGoalSection(type.value, type.label),
        )}

        {/* Chat Drawer for Goal Generation */}
        {showChatDrawer && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowChatDrawer(false)}
            />

            {/* Drawer */}
            <div className="relative w-full sm:w-[500px] h-[80vh] sm:h-[90vh] bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-l-3xl sm:rounded-r-none shadow-2xl overflow-hidden">
              <GoalGeneratorChat
                onClose={() => setShowChatDrawer(false)}
                onGoalsCreated={() => {
                  fetchGoals();
                  fetchStats();
                }}
              />
            </div>
          </div>
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
