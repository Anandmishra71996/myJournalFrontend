import { z } from 'zod';
import { emailField } from '../fields/email';

/**
 * Forgot password schema
 */
export const forgotPasswordSchema = z.object({
    email: emailField,
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * Parse and validate forgot password form data
 */
export const validateForgotPasswordForm = (data: unknown): {
    success: boolean;
    data?: ForgotPasswordFormData;
    errors?: Record<string, string>
} => {
    try {
        const validated = forgotPasswordSchema.parse(data);
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
