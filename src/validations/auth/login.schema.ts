import { z } from 'zod';
import { emailField } from '../fields/email';
import { passwordField } from '../fields/password';

/**
 * Login schema
 */
export const loginSchema = z.object({
    email: emailField,
    password: passwordField,
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Parse and validate login form data
 */
export const validateLoginForm = (data: unknown): {
    success: boolean;
    data?: LoginFormData;
    errors?: Record<string, string>
} => {
    try {
        const validated = loginSchema.parse(data);
        return { success: true, data: validated };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors: Record<string, string> = {};
            const messages = JSON.parse(error.message);

            messages?.forEach((err: any) => {
                if (err.path[0]) {
                    errors[err.path[0].toString()] = err.message;
                }
            });
            return { success: false, errors };
        }
        return { success: false, errors: { general: 'Validation failed' } };
    }
};
