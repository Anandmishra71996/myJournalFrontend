"use client";

import { useEffect, useState, useMemo } from "react";
import { Task, TaskFormData, TaskStats } from "@/types/task.types";
import { taskService } from "@/services/task.service";
import { toastService } from "@/services/toast.service";
import { Goal } from "@/constants/goal.constants";
import api from "@/lib/api";
import TaskCard from "@/components/planner/TaskCard";
import CreateTaskModal from "@/components/planner/CreateTaskModal";
import CalendarView from "@/components/planner/CalendarView";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import {
  Plus,
  LayoutList,
  CalendarDays,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertCircle,
  ListTodo,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type ViewMode = "list" | "calendar";
type StatusFilter = "all" | "pending" | "done";

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getFocusLabel(focus: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (isSameDay(focus, today)) return "Today";
  if (isSameDay(focus, tomorrow)) return "Tomorrow";
  return focus.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function groupTasksByDate(tasks: Task[], focusDate: Date): Record<string, Task[]> {
  const focus = new Date(focusDate);
  focus.setHours(0, 0, 0, 0);
  const focusLabel = getFocusLabel(focus);

  const groups: Record<string, Task[]> = {
    Overdue: [],
    [focusLabel]: [],
    "No date": [],
  };

  for (const task of tasks) {
    if (!task.dueDate) {
      groups["No date"].push(task);
      continue;
    }
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);

    if (due < focus && task.status !== "done") {
      groups["Overdue"].push(task);
    } else if (isSameDay(due, focus)) {
      groups[focusLabel].push(task);
    }
    // tasks after focus date are not shown — navigate forward to find them
  }

  return groups;
}

function isCompletedToday(task: Task): boolean {
  if (!task.completedAt) return false;
  const completed = new Date(task.completedAt);
  const today = new Date();
  return isSameDay(completed, today);
}

export default function PlannerPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>("list");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [populating, setPopulating] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | null>(null);
  const [selectedListDate, setSelectedListDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [tasksRes, goalsRes, statsRes] = await Promise.all([
        taskService.getTasks(),
        api.get("/goals"),
        taskService.getStats(),
      ]);
      setTasks(tasksRes);
      if (goalsRes.data.success) setGoals(goalsRes.data.data);
      setStats(statsRes);
    } catch {
      toastService.error("Error", "Failed to load planner");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDone = async (task: Task, completionNote?: string) => {
    const isDone =
      task.status === "done" && (!task.isOccurrence || isCompletedToday(task));

    const newStatus = isDone ? "pending" : "done";
    try {
      const updated = await taskService.updateStatus(task._id, newStatus, completionNote);
      setTasks((prev) => prev.map((t) => (t._id === task._id ? updated : t)));
      if (newStatus === "done") {
        toastService.success("Done!", completionNote ? `"${completionNote}"` : undefined);
      }
      fetchStats();
    } catch {
      toastService.error("Error", "Failed to update task");
    }
  };

  const fetchStats = async () => {
    try {
      const statsRes = await taskService.getStats();
      setStats(statsRes);
    } catch {}
  };

  const handleStatusChange = async (task: Task, status: Task["status"]) => {
    try {
      const updated = await taskService.updateStatus(task._id, status as any);
      setTasks((prev) => prev.map((t) => (t._id === task._id ? updated : t)));
      fetchStats();
    } catch {
      toastService.error("Error", "Failed to update task status");
    }
  };

  const handleOpenCreate = () => {
    setEditTask(null);
    setModalOpen(true);
  };

  const handleOpenEdit = async (task: Task) => {
    if (task.isOccurrence && task.parentTaskId) {
      try {
        const parent = await taskService.getTaskById(task.parentTaskId);
        setEditTask(parent);
      } catch {
        toastService.error("Error", "Could not load recurring task series");
        return;
      }
    } else {
      setEditTask(task);
    }
    setModalOpen(true);
  };

  const handleModalSubmit = async (data: TaskFormData) => {
    setSubmitting(true);
    try {
      if (editTask) {
        await taskService.updateTask(editTask._id, data);
        toastService.success("Task updated");
        // Re-fetch all so pruned/spawned occurrences reflect immediately
        await fetchAll();
      } else {
        await taskService.createTask(data);
        toastService.success("Task created");
        await fetchAll();
      }
      setModalOpen(false);
      setEditTask(null);
    } catch (err: any) {
      toastService.error("Error", err.response?.data?.error || "Failed to save task");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await taskService.deleteTask(deleteTarget._id);
      setTasks((prev) => prev.filter((t) => t._id !== deleteTarget._id));
      toastService.success("Task deleted");
      fetchStats();
    } catch {
      toastService.error("Error", "Failed to delete task");
    } finally {
      setDeleteTarget(null);
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (statusFilter === "pending") return t.status === "pending" || t.status === "in_progress";
      if (statusFilter === "done") return t.status === "done";
      return true;
    });
  }, [tasks, statusFilter]);

  const calendarTasks = useMemo(() => {
    if (!selectedCalendarDate) return filteredTasks;
    return filteredTasks.filter((t) => {
      if (!t.dueDate) return false;
      return isSameDay(new Date(t.dueDate), selectedCalendarDate);
    });
  }, [filteredTasks, selectedCalendarDate]);

  const focusLabel = useMemo(() => getFocusLabel(selectedListDate), [selectedListDate]);
  const groups = useMemo(() => groupTasksByDate(filteredTasks, selectedListDate), [filteredTasks, selectedListDate]);
  const SECTION_ORDER = useMemo(() => ["Overdue", focusLabel, "No date"], [focusLabel]);

  const isListDateToday = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return isSameDay(selectedListDate, today);
  }, [selectedListDate]);

  const navigateListDate = (delta: number) => {
    setSelectedListDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + delta);
      return d;
    });
  };

  const goToListToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    setSelectedListDate(d);
  };

  // Show populate button when any recurring occurrences are loaded
  const hasOpenRecurring = useMemo(
    () => tasks.some((t) => t.isOccurrence),
    [tasks]
  );

  const handlePopulate = async () => {
    setPopulating(true);
    try {
      const result = await taskService.populateRecurring();
      if (result.populated > 0) {
        await fetchAll();
        toastService.success("Upcoming tasks loaded", `Extended ${result.populated} recurring series`);
      } else {
        toastService.success("Already up to date", "No open-ended recurring tasks to extend");
      }
    } catch {
      toastService.error("Error", "Failed to populate recurring tasks");
    } finally {
      setPopulating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            Planner
          </h1>
          {stats && (
            <p className="text-sm mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
              {stats.completedToday} done today · {stats.pending + stats.in_progress} remaining
              {stats.overdue > 0 && (
                <span style={{ color: "var(--color-error)" }}> · {stats.overdue} overdue</span>
              )}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div
            className="flex rounded-xl border overflow-hidden"
            style={{ borderColor: "var(--color-border)" }}
          >
            {(["list", "calendar"] as ViewMode[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-all"
                style={{
                  backgroundColor:
                    view === v
                      ? "color-mix(in srgb, var(--color-primary) 14%, transparent)"
                      : "transparent",
                  color: view === v ? "var(--color-primary)" : "var(--color-text-secondary)",
                }}
              >
                {v === "list" ? (
                  <LayoutList className="w-3.5 h-3.5" />
                ) : (
                  <CalendarDays className="w-3.5 h-3.5" />
                )}
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{ backgroundColor: "var(--color-primary)", color: "white" }}
          >
            <Plus className="w-4 h-4" />
            Add task
          </button>
        </div>
      </div>

      {/* Stats strip */}
      {stats && (
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "Pending", value: stats.pending, icon: ListTodo, color: "var(--color-text-secondary)" },
            { label: "In progress", value: stats.in_progress, icon: Clock, color: "#3b82f6" },
            { label: "Done today", value: stats.completedToday, icon: CheckCircle2, color: "#22c55e" },
            { label: "Overdue", value: stats.overdue, icon: AlertCircle, color: "var(--color-error)" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="rounded-xl border p-3 text-center"
              style={{
                backgroundColor: "var(--color-surface-elevated)",
                borderColor: "color-mix(in srgb, var(--color-border) 60%, transparent)",
              }}
            >
              <Icon className="w-4 h-4 mx-auto mb-1" style={{ color }} />
              <p className="text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>
                {value}
              </p>
              <p className="text-[10px]" style={{ color: "var(--color-text-tertiary)" }}>
                {label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-5">
        {(["all", "pending", "done"] as StatusFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
            style={{
              color: statusFilter === f ? "var(--color-primary)" : "var(--color-text-tertiary)",
              backgroundColor:
                statusFilter === f
                  ? "color-mix(in srgb, var(--color-primary) 10%, transparent)"
                  : "transparent",
              borderColor:
                statusFilter === f ? "var(--color-primary)" : "var(--color-border)",
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-16 rounded-xl animate-pulse"
              style={{ backgroundColor: "var(--color-surface-elevated)" }}
            />
          ))}
        </div>
      ) : view === "list" ? (
        /* ── List View ── */
        <div className="space-y-6">
          {/* Date navigator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigateListDate(-1)}
                className="p-1.5 rounded-lg transition-colors hover:opacity-70"
                style={{ color: "var(--color-text-secondary)" }}
                aria-label="Previous day"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span
                className="text-sm font-semibold px-2 min-w-[120px] text-center"
                style={{ color: "var(--color-text-primary)" }}
              >
                {selectedListDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <button
                onClick={() => navigateListDate(1)}
                className="p-1.5 rounded-lg transition-colors hover:opacity-70"
                style={{ color: "var(--color-text-secondary)" }}
                aria-label="Next day"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              {!isListDateToday && (
                <button
                  onClick={goToListToday}
                  className="text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors"
                  style={{
                    color: "var(--color-primary)",
                    borderColor: "var(--color-primary)",
                    backgroundColor: "color-mix(in srgb, var(--color-primary) 8%, transparent)",
                  }}
                >
                  Today
                </button>
              )}
              {hasOpenRecurring && (
                <button
                  onClick={handlePopulate}
                  disabled={populating}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors"
                  style={{
                    color: populating ? "var(--color-text-tertiary)" : "var(--color-text-secondary)",
                    borderColor: "var(--color-border)",
                    backgroundColor: "transparent",
                  }}
                >
                  <RefreshCw className={`w-3 h-3 ${populating ? "animate-spin" : ""}`} />
                  {populating ? "Loading..." : "Load upcoming"}
                </button>
              )}
            </div>
          </div>

          {SECTION_ORDER.map((section) => {
            const sectionTasks = groups[section] ?? [];
            if (sectionTasks.length === 0) return null;
            const isOverdue = section === "Overdue";

            return (
              <div key={section}>
                <h2
                  className="text-xs font-semibold uppercase tracking-wider mb-2.5 flex items-center gap-2"
                  style={{
                    color: isOverdue ? "var(--color-error)" : "var(--color-text-tertiary)",
                  }}
                >
                  {section === "Recurring" && <RefreshCw className="w-3 h-3" />}
                  {section}
                  <span
                    className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                    style={{
                      backgroundColor: isOverdue
                        ? "rgba(239,68,68,0.12)"
                        : "color-mix(in srgb, var(--color-border) 80%, transparent)",
                      color: isOverdue ? "var(--color-error)" : "var(--color-text-tertiary)",
                    }}
                  >
                    {sectionTasks.length}
                  </span>
                </h2>
                <div className="space-y-2">
                  {sectionTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onToggleDone={handleToggleDone}
                      onStatusChange={handleStatusChange}
                      onEdit={handleOpenEdit}
                      onDelete={setDeleteTarget}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {SECTION_ORDER.every((s) => (groups[s] ?? []).length === 0) && (
            <div className="text-center py-16">
              <ListTodo
                className="w-12 h-12 mx-auto mb-3"
                style={{ color: "var(--color-text-tertiary)" }}
              />
              <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
                No tasks for {focusLabel.toLowerCase()}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--color-text-tertiary)" }}>
                {isListDateToday ? "Add your first task to get started" : "Navigate to another day or add a task"}
              </p>
              <button
                onClick={handleOpenCreate}
                className="mt-4 px-4 py-2 rounded-xl text-sm font-medium"
                style={{ backgroundColor: "var(--color-primary)", color: "white" }}
              >
                Add task
              </button>
            </div>
          )}
        </div>
      ) : (
        /* ── Calendar View ── */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div
            className="rounded-2xl border p-5"
            style={{
              backgroundColor: "var(--color-surface-elevated)",
              borderColor: "color-mix(in srgb, var(--color-border) 60%, transparent)",
            }}
          >
            <CalendarView
              tasks={filteredTasks}
              onDaySelect={(date) =>
                setSelectedCalendarDate((prev) =>
                  prev && isSameDay(prev, date) ? null : date
                )
              }
              selectedDate={selectedCalendarDate}
            />
          </div>

          <div>
            {selectedCalendarDate ? (
              <>
                <h3
                  className="text-sm font-semibold mb-3"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {selectedCalendarDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>
                {calendarTasks.length > 0 ? (
                  <div className="space-y-2">
                    {calendarTasks.map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onToggleDone={handleToggleDone}
                        onStatusChange={handleStatusChange}
                        onEdit={handleOpenEdit}
                        onDelete={setDeleteTarget}
                      />
                    ))}
                  </div>
                ) : (
                  <div
                    className="rounded-xl border p-6 text-center"
                    style={{
                      backgroundColor: "var(--color-surface-elevated)",
                      borderColor: "color-mix(in srgb, var(--color-border) 60%, transparent)",
                    }}
                  >
                    <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
                      No tasks for this day
                    </p>
                    <button
                      onClick={handleOpenCreate}
                      className="mt-3 text-xs px-3 py-1.5 rounded-lg"
                      style={{ backgroundColor: "var(--color-primary)", color: "white" }}
                    >
                      Add task
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div
                className="rounded-xl border p-6 text-center"
                style={{
                  backgroundColor: "var(--color-surface-elevated)",
                  borderColor: "color-mix(in srgb, var(--color-border) 60%, transparent)",
                }}
              >
                <CalendarDays
                  className="w-8 h-8 mx-auto mb-2"
                  style={{ color: "var(--color-text-tertiary)" }}
                />
                <p className="text-sm" style={{ color: "var(--color-text-tertiary)" }}>
                  Select a day to see tasks
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateTaskModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditTask(null);
        }}
        onSubmit={handleModalSubmit}
        goals={goals}
        editTask={editTask}
        isLoading={submitting}
      />

      <ConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete task"
        message={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
      />
    </div>
  );
}
