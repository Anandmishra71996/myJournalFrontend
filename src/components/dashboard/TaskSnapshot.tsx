"use client";

import Link from "next/link";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckSolid } from "@heroicons/react/24/solid";
import { useState } from "react";
import api from "@/lib/api";
import type { TaskStats } from "@/types/dashboard.types";
import type { Task } from "@/types/task.types";

interface Props {
  stats: TaskStats | null;
  todayTasks: Task[];
  onTaskDone: (taskId: string) => void;
}

const PRIORITY_COLORS: Record<string, string> = {
  P1: "bg-red-500/15 text-red-400",
  P2: "bg-orange-500/15 text-orange-400",
  P3: "bg-blue-500/15 text-blue-400",
  P4: "bg-[var(--color-surface-high)] text-[var(--color-text-tertiary)]",
};

export default function TaskSnapshot({ stats, todayTasks, onTaskDone }: Props) {
  const [completing, setCompleting] = useState<string | null>(null);

  const handleDone = async (taskId: string) => {
    setCompleting(taskId);
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: "done" });
      onTaskDone(taskId);
    } catch {
      // silently ignore — user can go to planner
    } finally {
      setCompleting(null);
    }
  };

  const pending = todayTasks.filter((t) => t.status === "pending" || t.status === "in_progress");

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Today's Tasks</h2>
        <Link href="/planner" className="text-xs font-semibold text-[var(--color-primary)] hover:underline">
          Open Planner →
        </Link>
      </div>

      {/* Stats row */}
      {stats && (
        <div className="flex flex-wrap gap-3">
          {stats.overdue > 0 && (
            <Link
              href="/planner"
              className="flex items-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 outline outline-1 outline-red-500/20 hover:bg-red-500/15"
            >
              <ExclamationCircleIcon className="h-4 w-4" />
              {stats.overdue} overdue
            </Link>
          )}
          {(["P1", "P2", "P3", "P4"] as const).map((p) => {
            const count = (stats as any)[p.toLowerCase()] ?? 0;
            if (count === 0) return null;
            return (
              <span key={p} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${PRIORITY_COLORS[p]}`}>
                {p}: {count}
              </span>
            );
          })}
        </div>
      )}

      {/* Today task list */}
      <div className="space-y-1.5">
        {pending.length === 0 ? (
          <div className="rounded-xl bg-[var(--color-surface-low)] p-4 text-center outline outline-1 outline-[color:color-mix(in_srgb,var(--color-outline-variant)_15%,transparent)]">
            <CheckCircleIcon className="mx-auto h-8 w-8 text-emerald-400" />
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">No tasks due today.</p>
          </div>
        ) : (
          pending.map((task) => (
            <div
              key={task._id}
              className="flex items-start gap-3 rounded-xl bg-[var(--color-surface-low)] px-4 py-3 outline outline-1 outline-[color:color-mix(in_srgb,var(--color-outline-variant)_15%,transparent)]"
            >
              <button
                onClick={() => handleDone(task._id)}
                disabled={completing === task._id}
                className="mt-0.5 shrink-0 text-[var(--color-text-tertiary)] transition-colors hover:text-emerald-400 disabled:opacity-50"
                aria-label="Mark done"
              >
                {completing === task._id ? (
                  <CheckSolid className="h-5 w-5 text-emerald-400" />
                ) : (
                  <CheckCircleIcon className="h-5 w-5" />
                )}
              </button>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[var(--color-text-primary)]">{task.title}</p>
                {task.dueTime && (
                  <p className="text-[10px] text-[var(--color-text-tertiary)]">{task.dueTime}</p>
                )}
              </div>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${PRIORITY_COLORS[task.priority]}`}>
                {task.priority}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
