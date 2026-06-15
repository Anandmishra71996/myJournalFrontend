"use client";

import { useState } from "react";
import { Task, TaskStatus } from "@/types/task.types";
import { PRIORITY_CONFIG } from "@/constants/task.constants";
import {
  Check,
  Pencil,
  Trash2,
  RefreshCw,
  Target,
  Clock,
  ChevronDown,
  ChevronUp,
  Play,
  RotateCcw,
} from "lucide-react";

interface TaskCardProps {
  task: Task;
  onToggleDone: (task: Task, completionNote?: string) => void;
  onStatusChange: (task: Task, status: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

function isCompletedToday(task: Task): boolean {
  if (!task.completedAt) return false;
  const completed = new Date(task.completedAt);
  const today = new Date();
  return (
    completed.getFullYear() === today.getFullYear() &&
    completed.getMonth() === today.getMonth() &&
    completed.getDate() === today.getDate()
  );
}

function formatDueDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const taskDay = new Date(date);
  taskDay.setHours(0, 0, 0, 0);

  if (taskDay.getTime() === today.getTime()) return "Today";
  if (taskDay.getTime() === tomorrow.getTime()) return "Tomorrow";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function isOverdue(task: Task): boolean {
  if (!task.dueDate || task.status === "done") return false;
  const due = new Date(task.dueDate);
  due.setHours(23, 59, 59, 999);
  return due < new Date();
}

export default function TaskCard({
  task,
  onToggleDone,
  onStatusChange,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [completionNote, setCompletionNote] = useState("");
  const [expanded, setExpanded] = useState(false);

  const priority = PRIORITY_CONFIG[task.priority];
  const isDone =
    task.status === "done" &&
    (!task.isOccurrence || isCompletedToday(task));
  const isInProgress = task.status === "in_progress";
  const isPending = task.status === "pending";
  const overdue = isOverdue(task);

  const handleCheckClick = () => {
    if (isDone) {
      onToggleDone(task);
      return;
    }
    setShowNoteInput(true);
  };

  const handleConfirmDone = () => {
    onToggleDone(task, completionNote || undefined);
    setShowNoteInput(false);
    setCompletionNote("");
  };

  const handleCancelNote = () => {
    setShowNoteInput(false);
    setCompletionNote("");
  };

  // Circle button border/fill based on status
  const circleBorderColor = isDone
    ? "var(--color-primary)"
    : isInProgress
    ? "#f59e0b"
    : priority.color;
  const circleBg = isDone
    ? "var(--color-primary)"
    : isInProgress
    ? "rgba(245,158,11,0.12)"
    : "transparent";

  return (
    <div
      className="rounded-xl border p-4 transition-all duration-200"
      style={{
        backgroundColor: isDone
          ? "color-mix(in srgb, var(--color-surface-elevated) 60%, transparent)"
          : "var(--color-surface-elevated)",
        borderColor: isInProgress
          ? "rgba(245,158,11,0.35)"
          : "color-mix(in srgb, var(--color-border) 60%, transparent)",
        opacity: isDone ? 0.7 : 1,
      }}
    >
      <div className="flex items-start gap-3">
        {/* Status circle */}
        <button
          onClick={handleCheckClick}
          className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200"
          style={{ borderColor: circleBorderColor, backgroundColor: circleBg }}
          aria-label={isDone ? "Mark pending" : "Mark done"}
        >
          {isDone && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
          {isInProgress && (
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "#f59e0b" }}
            />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-xs font-semibold px-1.5 py-0.5 rounded"
              style={{ color: priority.color, backgroundColor: priority.bg }}
            >
              {priority.label}
            </span>

            <span
              className="text-sm font-medium leading-snug"
              style={{
                color: "var(--color-text-primary)",
                textDecoration: isDone ? "line-through" : "none",
              }}
            >
              {task.title}
            </span>

            {/* In progress badge */}
            {isInProgress && (
              <span
                className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                style={{ color: "#f59e0b", backgroundColor: "rgba(245,158,11,0.12)" }}
              >
                In progress
              </span>
            )}

            {/* Recurring label chip — non-interactive */}
            {task.isOccurrence && (
              <span
                className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full border select-none"
                style={{
                  color: "var(--color-text-tertiary)",
                  borderColor: "var(--color-border)",
                }}
              >
                <RefreshCw className="w-2.5 h-2.5" />
                Recurring
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            {task.dueDate && (
              <span
                className="flex items-center gap-1 text-xs"
                style={{ color: overdue ? "var(--color-error)" : "var(--color-text-tertiary)" }}
              >
                <Clock className="w-3 h-3" />
                {overdue ? "Overdue · " : ""}
                {formatDueDate(task.dueDate)}
                {task.dueTime && ` · ${task.dueTime}`}
              </span>
            )}

            {task.estimatedMinutes && (
              <span className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                ~{task.estimatedMinutes >= 60
                  ? `${task.estimatedMinutes / 60}h`
                  : `${task.estimatedMinutes}m`}
              </span>
            )}

            {task.linkedGoal && (
              <span
                className="flex items-center gap-1 text-xs"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                <Target className="w-3 h-3" />
                {task.linkedGoal.title}
              </span>
            )}
          </div>

          {task.description && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 mt-1.5 text-xs"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {expanded ? "Hide" : "Details"}
            </button>
          )}

          {expanded && task.description && (
            <p className="mt-1.5 text-sm" style={{ color: "var(--color-text-secondary)" }}>
              {task.description}
            </p>
          )}

          {task.completionNote && isDone && (
            <p className="mt-1.5 text-xs italic" style={{ color: "var(--color-text-tertiary)" }}>
              "{task.completionNote}"
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* In-progress toggle */}
          {isPending && !isDone && (
            <button
              onClick={() => onStatusChange(task, "in_progress")}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: "#f59e0b" }}
              aria-label="Mark in progress"
              title="Mark in progress"
            >
              <Play className="w-3.5 h-3.5" />
            </button>
          )}
          {isInProgress && (
            <button
              onClick={() => onStatusChange(task, "pending")}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: "var(--color-text-tertiary)" }}
              aria-label="Back to pending"
              title="Back to pending"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "var(--color-text-tertiary)" }}
            aria-label="Edit task"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(task)}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "var(--color-text-tertiary)" }}
            aria-label="Delete task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {showNoteInput && (
        <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--color-border)" }}>
          <p className="text-xs mb-2" style={{ color: "var(--color-text-secondary)" }}>
            Add a quick note (optional)
          </p>
          <input
            type="text"
            value={completionNote}
            onChange={(e) => setCompletionNote(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleConfirmDone()}
            placeholder="What did you learn or accomplish?"
            autoFocus
            className="w-full text-sm px-3 py-2 rounded-lg border outline-none"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-primary)",
            }}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleConfirmDone}
              className="text-xs px-3 py-1.5 rounded-lg font-medium"
              style={{ backgroundColor: "var(--color-primary)", color: "white" }}
            >
              Mark done
            </button>
            <button
              onClick={handleCancelNote}
              className="text-xs px-3 py-1.5 rounded-lg"
              style={{
                color: "var(--color-text-secondary)",
                backgroundColor: "var(--color-surface)",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
