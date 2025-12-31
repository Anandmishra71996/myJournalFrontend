import { z } from 'zod';

/**
 * Email field validation
 * RFC 5321 compliant email format with max length
 */
export const emailField = z
    .email('Please enter a valid email address')
    .min(1, 'Email is required')
    .max(254, 'Email is too long')
    .transform((val) => val.trim().toLowerCase());

export type EmailFieldType = z.infer<typeof emailField>;
