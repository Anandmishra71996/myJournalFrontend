import { z } from 'zod';

/**
 * Password field validation
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export const passwordField = z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
        'Password must contain at least one special character'
    );

export type PasswordFieldType = z.infer<typeof passwordField>;

/**
 * Get password strength
 */
export const getPasswordStrength = (
    password: string
): 'weak' | 'fair' | 'good' | 'strong' => {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;

    if (score >= 5) return 'strong';
    if (score >= 4) return 'good';
    if (score >= 3) return 'fair';
    return 'weak';
};

/**
 * Get password strength color
 */
export const getPasswordStrengthColor = (
    strength: 'weak' | 'fair' | 'good' | 'strong'
): string => {
    const colors: Record<typeof strength, string> = {
        weak: 'bg-red-500',
        fair: 'bg-yellow-500',
        good: 'bg-blue-500',
        strong: 'bg-green-500',
    };
    return colors[strength];
};

/**
 * Get password strength label
 */
export const getPasswordStrengthLabel = (
    strength: 'weak' | 'fair' | 'good' | 'strong'
): string => {
    const labels: Record<typeof strength, string> = {
        weak: 'Weak',
        fair: 'Fair',
        good: 'Good',
        strong: 'Strong',
    };
    return labels[strength];
};

/**
 * Get password strength width percentage
 */
export const getPasswordStrengthWidth = (
    strength: 'weak' | 'fair' | 'good' | 'strong'
): string => {
    const widths: Record<typeof strength, string> = {
        weak: '25%',
        fair: '50%',
        good: '75%',
        strong: '100%',
    };
    return widths[strength];
};
