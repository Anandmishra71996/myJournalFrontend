import { TaskPriority, TaskStatus, RecurrencePattern, TaskFormData } from '@/types/task.types';

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; bg: string }> = {
    P1: { label: 'P1', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
    P2: { label: 'P2', color: '#f97316', bg: 'rgba(249,115,22,0.12)' },
    P3: { label: 'P3', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
    P4: { label: 'P4', color: '#6b7280', bg: 'rgba(107,114,128,0.12)' },
};

export const STATUS_CONFIG: Record<TaskStatus, { label: string }> = {
    pending: { label: 'Pending' },
    in_progress: { label: 'In Progress' },
    done: { label: 'Done' },
    skipped: { label: 'Skipped' },
};

export const RECURRENCE_OPTIONS: { value: RecurrencePattern; label: string }[] = [
    { value: 'daily', label: 'Every day' },
    { value: 'weekly', label: 'On specific days' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'custom', label: 'Custom' },
];

export const WEEKDAY_OPTIONS = [
    { value: 0, label: 'Sun' },
    { value: 1, label: 'Mon' },
    { value: 2, label: 'Tue' },
    { value: 3, label: 'Wed' },
    { value: 4, label: 'Thu' },
    { value: 5, label: 'Fri' },
    { value: 6, label: 'Sat' },
];

export const ESTIMATE_OPTIONS = [
    { value: '15', label: '15 min' },
    { value: '30', label: '30 min' },
    { value: '45', label: '45 min' },
    { value: '60', label: '1 hr' },
    { value: '90', label: '1.5 hr' },
    { value: '120', label: '2 hr' },
];

export const DEFAULT_TASK_FORM: TaskFormData = {
    title: '',
    description: '',
    priority: 'P3',
    dueDate: '',
    dueTime: '',
    estimatedMinutes: '',
    linkedGoalId: '',
    recurrence: null,
    tags: [],
    reminderMinutes: '',
};
