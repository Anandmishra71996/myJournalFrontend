import { z, ZodError } from 'zod';
import { nameField } from '../fields/name';
import { emailField } from '../fields/email';
import { passwordField } from '../fields/password';

/**
 * Signup schema
 */
export const signupSchema = z
    .object({
        name: nameField,
        email: emailField,
        password: passwordField,
        confirmPassword: z.string().min(1, 'Please confirm your password'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export type SignupFormData = z.infer<typeof signupSchema>;

/**
 * Parse and validate signup form data
 */
export const validateSignupForm = (data: unknown): {
    success: boolean;
    data?: SignupFormData;
    errors?: Record<string, string>
} => {
    try {
        const validated = signupSchema.parse(data);
        console.log("Validated signup data:", validated);
        return { success: true, data: validated };
    } catch (error: any) {
        console.log("Error during signup validation:", error);
        console.log(error instanceof z.ZodError)
        if (error instanceof z.ZodError) {
            console.log("Zod validation errors:", JSON.parse(error.message));
            const messages = JSON.parse(error.message);
            const errors: Record<string, string> = {};
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
