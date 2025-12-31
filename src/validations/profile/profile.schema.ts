import { z } from 'zod';
import { nameField } from '../fields/name';
import { phoneField } from '../fields/phone';

/**
 * Profile schema
 */
export const profileSchema = z.object({
    name: nameField,
    phone: phoneField,
    avatar: z.string().optional(),
    isProfileCompleted: z.boolean().default(false),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

/**
 * Parse and validate profile form data
 */
export const validateProfileForm = (data: unknown): {
    success: boolean;
    data?: ProfileFormData;
    errors?: Record<string, string>
} => {
    try {
        const validated = profileSchema.parse(data);
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
