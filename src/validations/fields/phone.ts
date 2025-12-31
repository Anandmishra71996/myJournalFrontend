import { z } from 'zod';

/**
 * Phone field validation
 * Supports various formats: +1-555-123-4567, (555) 123-4567, 555-123-4567, etc.
 */
export const phoneField = z
    .string()
    .optional()
    .refine(
        (val) => !val || /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(val),
        'Please enter a valid phone number'
    )
    .transform((val) => val?.trim() || '');

export type PhoneFieldType = z.infer<typeof phoneField>;

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    if (cleaned.length === 11) {
        return `+${cleaned[0]} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
};
