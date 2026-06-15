export type TaskPriority = 'P1' | 'P2' | 'P3' | 'P4';
export type TaskStatus = 'pending' | 'in_progress' | 'done' | 'skipped';
export type RecurrencePattern = 'daily' | 'weekly' | 'monthly' | 'custom';

export interface TaskRecurrence {
    pattern: RecurrencePattern;
    days?: number[];
    endsAt?: string;
}

export interface Task {
    _id: string;
    userId: string;
    title: string;
    description?: string;
    priority: TaskPriority;
    status: TaskStatus;
    dueDate?: string;
    dueTime?: string;
    estimatedMinutes?: number;
    linkedGoalId?: string;
    linkedGoal?: { _id: string; title: string; category: string };
    recurrence?: TaskRecurrence;
    isTemplate?: boolean;
    isOccurrence?: boolean;
    parentTaskId?: string;
    completedAt?: string;
    completionNote?: string;
    tags?: string[];
    reminderMinutes?: number;
    createdAt: string;
    updatedAt: string;
}

export interface TaskFormData {
    title: string;
    description: string;
    priority: TaskPriority;
    dueDate: string;
    dueTime: string;
    estimatedMinutes: string;
    linkedGoalId: string;
    recurrence: TaskRecurrence | null;
    tags: string[];
    reminderMinutes: string;
}

export interface TaskStats {
    pending: number;
    in_progress: number;
    done: number;
    skipped: number;
    overdue: number;
    completedToday: number;
}
