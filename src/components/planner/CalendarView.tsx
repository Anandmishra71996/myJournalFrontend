"use client";

import { useState } from "react";
import { Task } from "@/types/task.types";
import { PRIORITY_CONFIG } from "@/constants/task.constants";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarViewProps {
  tasks: Task[];
  onDaySelect: (date: Date) => void;
  selectedDate: Date | null;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function daysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function CalendarView({ tasks, onDaySelect, selectedDate }: CalendarViewProps) {
  const [viewDate, setViewDate] = useState(new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = startOfMonth(viewDate).getDay();
  const totalDays = daysInMonth(viewDate);
  const today = new Date();

  const tasksByDay: Record<number, Task[]> = {};
  for (const task of tasks) {
    if (!task.dueDate) continue;
    const due = new Date(task.dueDate);
    if (due.getFullYear() === year && due.getMonth() === month) {
      const day = due.getDate();
      if (!tasksByDay[day]) tasksByDay[day] = [];
      tasksByDay[day].push(task);
    }
  }

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 rounded-lg transition-colors"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h3 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
          {MONTH_NAMES[month]} {year}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 rounded-lg transition-colors"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map((d) => (
          <div
            key={d}
            className="text-center text-xs font-medium py-1"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Cells */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;

          const cellDate = new Date(year, month, day);
          const isToday = isSameDay(cellDate, today);
          const isSelected = selectedDate ? isSameDay(cellDate, selectedDate) : false;
          const dayTasks = tasksByDay[day] ?? [];
          const doneTasks = dayTasks.filter((t) => t.status === "done").length;
          const pendingTasks = dayTasks.filter((t) => t.status !== "done").length;

          return (
            <button
              key={day}
              onClick={() => onDaySelect(cellDate)}
              className="relative flex flex-col items-center py-1.5 rounded-lg transition-all min-h-[52px]"
              style={{
                backgroundColor: isSelected
                  ? "color-mix(in srgb, var(--color-primary) 16%, transparent)"
                  : isToday
                  ? "color-mix(in srgb, var(--color-primary) 8%, transparent)"
                  : "transparent",
                border: isSelected ? `1px solid var(--color-primary)` : "1px solid transparent",
              }}
            >
              <span
                className="text-xs font-medium"
                style={{
                  color: isSelected || isToday
                    ? "var(--color-primary)"
                    : "var(--color-text-primary)",
                }}
              >
                {day}
              </span>

              {dayTasks.length > 0 && (
                <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center max-w-full px-1">
                  {pendingTasks > 0 && (
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: "var(--color-primary)" }}
                    />
                  )}
                  {doneTasks > 0 && (
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: "var(--color-text-tertiary)" }}
                    />
                  )}
                </div>
              )}

              {dayTasks.length > 0 && (
                <span
                  className="text-[10px] leading-none"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  {dayTasks.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 pt-2 px-1">
        <div className="flex items-center gap-1">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: "var(--color-primary)" }}
          />
          <span className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
            Pending
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: "var(--color-text-tertiary)" }}
          />
          <span className="text-xs" style={{ color: "var(--color-text-tertiary)" }}>
            Done
          </span>
        </div>
      </div>
    </div>
  );
}
