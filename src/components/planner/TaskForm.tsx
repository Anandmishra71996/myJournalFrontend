"use client";

import { useState, useEffect } from "react";
import { TaskFormData, TaskRecurrence, RecurrencePattern } from "@/types/task.types";
import {
  DEFAULT_TASK_FORM,
  PRIORITY_CONFIG,
  RECURRENCE_OPTIONS,
  WEEKDAY_OPTIONS,
  ESTIMATE_OPTIONS,
} from "@/constants/task.constants";
import { Goal } from "@/constants/goal.constants";

interface TaskFormProps {
  initialData?: Partial<TaskFormData>;
  goals: Goal[];
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  isLoading?: boolean;
}

export default function TaskForm({
  initialData,
  goals,
  onSubmit,
  onCancel,
  submitLabel = "Create task",
  isLoading = false,
}: TaskFormProps) {
  const [form, setForm] = useState<TaskFormData>({
    ...DEFAULT_TASK_FORM,
    ...initialData,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showRecurrence, setShowRecurrence] = useState(!!initialData?.recurrence);
  const [recurrencePattern, setRecurrencePattern] = useState<RecurrencePattern>(
    initialData?.recurrence?.pattern ?? "weekly"
  );
  const [selectedDays, setSelectedDays] = useState<number[]>(
    initialData?.recurrence?.days ?? []
  );

  useEffect(() => {
    if (showRecurrence) {
      const recurrence: TaskRecurrence = { pattern: recurrencePattern };
      if (recurrencePattern !== "daily") recurrence.days = selectedDays;
      setForm((f) => ({ ...f, recurrence }));
    } else {
      setForm((f) => ({ ...f, recurrence: null }));
    }
  }, [showRecurrence, recurrencePattern, selectedDays]);

  const set = (field: keyof TaskFormData, value: any) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (form.title.length > 100) newErrors.title = "Title must be under 100 characters";
    if (showRecurrence && recurrencePattern !== "daily" && selectedDays.length === 0) {
      newErrors.recurrence = "Select at least one day";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  const toggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const inputStyle = {
    backgroundColor: "var(--color-surface)",
    borderColor: "var(--color-border)",
    color: "var(--color-text-primary)",
  };

  const labelStyle = { color: "var(--color-text-secondary)" };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-xs font-medium mb-1" style={labelStyle}>
          Task *
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="What needs to be done?"
          autoFocus
          className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
          style={inputStyle}
        />
        {errors.title && (
          <p className="text-xs mt-1" style={{ color: "var(--color-error)" }}>
            {errors.title}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-medium mb-1" style={labelStyle}>
          Details
        </label>
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Add more context (optional)"
          rows={2}
          className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none"
          style={inputStyle}
        />
      </div>

      {/* Priority */}
      <div>
        <label className="block text-xs font-medium mb-1.5" style={labelStyle}>
          Priority
        </label>
        <div className="flex gap-2">
          {(["P1", "P2", "P3", "P4"] as const).map((p) => {
            const cfg = PRIORITY_CONFIG[p];
            const selected = form.priority === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => set("priority", p)}
                className="flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                style={{
                  color: selected ? cfg.color : "var(--color-text-tertiary)",
                  backgroundColor: selected ? cfg.bg : "transparent",
                  borderColor: selected ? cfg.color : "var(--color-border)",
                }}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>

      {/* Due date + time */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium mb-1" style={labelStyle}>
            Due date
          </label>
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => set("dueDate", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
            style={inputStyle}
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1" style={labelStyle}>
            Time
          </label>
          <input
            type="time"
            value={form.dueTime}
            onChange={(e) => set("dueTime", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
            style={inputStyle}
          />
        </div>
      </div>

      {/* Estimate */}
      <div>
        <label className="block text-xs font-medium mb-1.5" style={labelStyle}>
          Time estimate
        </label>
        <div className="flex flex-wrap gap-2">
          {ESTIMATE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() =>
                set("estimatedMinutes", form.estimatedMinutes === opt.value ? "" : opt.value)
              }
              className="px-2.5 py-1 rounded-lg text-xs border transition-all"
              style={{
                color:
                  form.estimatedMinutes === opt.value
                    ? "var(--color-primary)"
                    : "var(--color-text-tertiary)",
                backgroundColor:
                  form.estimatedMinutes === opt.value
                    ? "color-mix(in srgb, var(--color-primary) 12%, transparent)"
                    : "transparent",
                borderColor:
                  form.estimatedMinutes === opt.value
                    ? "var(--color-primary)"
                    : "var(--color-border)",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Link to goal */}
      {goals.length > 0 && (
        <div>
          <label className="block text-xs font-medium mb-1" style={labelStyle}>
            Link to goal
          </label>
          <select
            value={form.linkedGoalId}
            onChange={(e) => set("linkedGoalId", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
            style={inputStyle}
          >
            <option value="">No goal</option>
            {goals.map((g) => (
              <option key={g._id} value={g._id}>
                {g.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Recurrence */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showRecurrence}
            onChange={(e) => setShowRecurrence(e.target.checked)}
            className="rounded"
          />
          <span className="text-xs font-medium" style={labelStyle}>
            Repeat this task
          </span>
        </label>

        {showRecurrence && (
          <div className="mt-2 pl-5 space-y-2">
            <select
              value={recurrencePattern}
              onChange={(e) => setRecurrencePattern(e.target.value as RecurrencePattern)}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
              style={inputStyle}
            >
              {RECURRENCE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {(recurrencePattern === "weekly" || recurrencePattern === "custom") && (
              <div className="flex gap-1.5 flex-wrap">
                {WEEKDAY_OPTIONS.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleDay(day.value)}
                    className="w-9 h-9 rounded-full text-xs font-medium border transition-all"
                    style={{
                      color: selectedDays.includes(day.value)
                        ? "white"
                        : "var(--color-text-secondary)",
                      backgroundColor: selectedDays.includes(day.value)
                        ? "var(--color-primary)"
                        : "transparent",
                      borderColor: selectedDays.includes(day.value)
                        ? "var(--color-primary)"
                        : "var(--color-border)",
                    }}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            )}

            {errors.recurrence && (
              <p className="text-xs" style={{ color: "var(--color-error)" }}>
                {errors.recurrence}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{
            backgroundColor: isLoading
              ? "color-mix(in srgb, var(--color-primary) 60%, transparent)"
              : "var(--color-primary)",
            color: "white",
          }}
        >
          {isLoading ? "Saving..." : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 rounded-xl text-sm font-medium border transition-all"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-text-secondary)",
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
