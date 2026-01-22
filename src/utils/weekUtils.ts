/**
 * Get the Sunday of the week for a given date
 */
export function getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = -day; // Get Sunday (0)
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

/**
 * Get the Sunday of the week for a given date
 */
export function getWeekEnd(date: Date): Date {
    const weekStart = getWeekStart(date);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    return weekEnd;
}

/**
 * Format date to YYYY-MM-DD
 */
export function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Get current week boundaries
 */
export function getCurrentWeek(): { weekStart: string; weekEnd: string } {
    const now = new Date();
    return {
        weekStart: formatDate(getWeekStart(now)),
        weekEnd: formatDate(getWeekEnd(now)),
    };
}

/**
 * Get previous week's Monday
 */
export function getPreviousWeek(weekStartStr: string): string {
    const date = new Date(weekStartStr);
    date.setDate(date.getDate() - 7);
    return formatDate(getWeekStart(date));
}

/**
 * Get next week's Monday
 */
export function getNextWeek(weekStartStr: string): string {
    const date = new Date(weekStartStr);
    date.setDate(date.getDate() + 7);
    return formatDate(getWeekStart(date));
}

/**
 * Check if a week is the current week
 */
export function isCurrentWeek(weekStartStr: string): boolean {
    const { weekStart } = getCurrentWeek();
    return weekStart === weekStartStr;
}

/**
 * Check if a week is in the future
 */
export function isFutureWeek(weekStartStr: string): boolean {
    const { weekStart } = getCurrentWeek();
    return weekStartStr > weekStart;
}

/**
 * Format week range for display (e.g., "Jan 1 - Jan 7, 2024")
 */
export function formatWeekRange(weekStartStr: string, weekEndStr: string): string {
    const start = new Date(weekStartStr);
    const end = new Date(weekEndStr);

    const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
    const startDay = start.getDate();
    const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
    const endDay = end.getDate();
    const year = end.getFullYear();

    if (startMonth === endMonth) {
        return `${startMonth} ${startDay} - ${endDay}, ${year}`;
    } else {
        return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
    }
}
