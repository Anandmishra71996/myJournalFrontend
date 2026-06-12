"use client";

import { useEffect } from "react";
import { Task, TaskFormData } from "@/types/task.types";
import { Goal } from "@/constants/goal.constants";
import TaskForm from "./TaskForm";
import { X } from "lucide-react";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<void>;
  goals: Goal[];
  editTask?: Task | null;
  isLoading?: boolean;
}

function taskToFormData(task: Task): Partial<TaskFormData> {
  return {
    title: task.title,
    description: task.description ?? "",
    priority: task.priority,
    dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
    dueTime: task.dueTime ?? "",
    estimatedMinutes: task.estimatedMinutes?.toString() ?? "",
    linkedGoalId: task.linkedGoalId ?? "",
    recurrence: task.recurrence ?? null,
    tags: task.tags ?? [],
    reminderMinutes: task.reminderMinutes?.toString() ?? "",
  };
}

export default function CreateTaskModal({
  isOpen,
  onClose,
  onSubmit,
  goals,
  editTask,
  isLoading,
}: CreateTaskModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-lg rounded-2xl border shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: "var(--color-surface-elevated)",
          borderColor: "color-mix(in srgb, var(--color-border) 60%, transparent)",
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2
            className="text-base font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {editTask ? "Edit task" : "New task"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <TaskForm
          initialData={editTask ? taskToFormData(editTask) : undefined}
          goals={goals}
          onSubmit={onSubmit}
          onCancel={onClose}
          submitLabel={editTask ? "Save changes" : "Create task"}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
