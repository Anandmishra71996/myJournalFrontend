import { z } from 'zod';

/**
 * Name field validation
 * Requirements:
 * - Minimum 2 characters
 * - Maximum 50 characters
 * - Only letters, spaces, hyphens, and apostrophes
 */
export const nameField = z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be no more than 50 characters')
    .regex(
        /^[a-zA-Z\s'-]+$/,
        'Name can only contain letters, spaces, hyphens, and apostrophes'
    )
    .transform((val) => val.trim());

export type NameFieldType = z.infer<typeof nameField>;
