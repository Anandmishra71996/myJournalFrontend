import { toast as sonnerToast } from 'sonner';

/**
 * Global toast service for displaying notifications
 * Uses sonner library under the hood
 */
class ToastService {
    /**
     * Show a success toast message
     * @param message - The message to display
     * @param description - Optional description text
     */
    success(message: string, description?: string) {
        sonnerToast.success(message, {
            description,
        });
    }

    /**
     * Show an error toast message
     * @param message - The message to display
     * @param description - Optional description text
     */
    error(message: string, description?: string) {
        sonnerToast.error(message, {
            description,
        });
    }

    /**
     * Show a warning toast message
     * @param message - The message to display
     * @param description - Optional description text
     */
    warn(message: string, description?: string) {
        sonnerToast.warning(message, {
            description,
        });
    }

    /**
     * Show an info toast message
     * @param message - The message to display
     * @param description - Optional description text
     */
    info(message: string, description?: string) {
        sonnerToast.info(message, {
            description,
        });
    }

    /**
     * Show a loading toast message
     * @param message - The message to display
     * @returns The toast ID that can be used to dismiss or update it
     */
    loading(message: string) {
        return sonnerToast.loading(message);
    }

    /**
     * Dismiss a specific toast by ID or all toasts
     * @param toastId - Optional ID of the toast to dismiss
     */
    dismiss(toastId?: string | number) {
        sonnerToast.dismiss(toastId);
    }

    /**
     * Show a promise toast that automatically updates based on promise state
     * @param promise - The promise to track
     * @param messages - Messages for loading, success, and error states
     */
    promise<T>(
        promise: Promise<T>,
        messages: {
            loading: string;
            success: string | ((data: T) => string);
            error: string | ((error: any) => string);
        }
    ) {
        return sonnerToast.promise(promise, messages);
    }
}

// Export a singleton instance
export const toastService = new ToastService();

// Also export as default for convenience
export default toastService;
