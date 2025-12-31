/**
 * Authentication Validation Utilities
 * Industry best practices for form validation
 */

export interface ValidationError {
    field: string;
    message: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
}

/**
 * Validate email format
 * Uses HTML5 email validation standards
 */
export const validateEmail = (email: string): boolean => {
    const trimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(trimmed) && trimmed.length <= 254;
};

/**
 * Validate password strength
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export const validatePassword = (password: string): {
    isValid: boolean;
    strength: 'weak' | 'fair' | 'good' | 'strong';
    feedback: string[];
} => {
    const feedback: string[] = [];
    let strengthScore = 0;

    if (password.length < 8) {
        feedback.push('At least 8 characters');
    } else {
        strengthScore++;
    }

    if (!/[A-Z]/.test(password)) {
        feedback.push('At least one uppercase letter');
    } else {
        strengthScore++;
    }

    if (!/[a-z]/.test(password)) {
        feedback.push('At least one lowercase letter');
    } else {
        strengthScore++;
    }

    if (!/\d/.test(password)) {
        feedback.push('At least one number');
    } else {
        strengthScore++;
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        feedback.push('At least one special character');
    } else {
        strengthScore++;
    }

    let strength: 'weak' | 'fair' | 'good' | 'strong' = 'weak';
    if (strengthScore >= 4) strength = 'strong';
    else if (strengthScore >= 3) strength = 'good';
    else if (strengthScore >= 2) strength = 'fair';

    return {
        isValid: feedback.length === 0,
        strength,
        feedback,
    };
};

/**
 * Validate name
 * Requirements:
 * - Minimum 2 characters
 * - Maximum 50 characters
 * - Only letters, spaces, hyphens, and apostrophes
 */
export const validateName = (name: string): boolean => {
    const trimmed = name.trim();
    const nameRegex = /^[a-zA-Z\s'-]{2,50}$/;
    return nameRegex.test(trimmed);
};

/**
 * Validate login form
 */
export const validateLoginForm = (
    email: string,
    password: string
): ValidationResult => {
    const errors: ValidationError[] = [];

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
        errors.push({ field: 'email', message: 'Email is required' });
    } else if (!validateEmail(trimmedEmail)) {
        errors.push({ field: 'email', message: 'Please enter a valid email address' });
    }

    const trimmedPassword = password.trim();
    if (!trimmedPassword) {
        errors.push({ field: 'password', message: 'Password is required' });
    } else if (trimmedPassword.length < 8) {
        errors.push({
            field: 'password',
            message: 'Password must be at least 8 characters',
        });
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

/**
 * Validate signup form
 */
export const validateSignupForm = (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
): ValidationResult => {
    const errors: ValidationError[] = [];

    const trimmedName = name.trim();
    if (!trimmedName) {
        errors.push({ field: 'name', message: 'Name is required' });
    } else if (!validateName(trimmedName)) {
        errors.push({
            field: 'name',
            message: 'Name must be 2-50 characters and contain only letters, spaces, hyphens, and apostrophes',
        });
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
        errors.push({ field: 'email', message: 'Email is required' });
    } else if (!validateEmail(trimmedEmail)) {
        errors.push({ field: 'email', message: 'Please enter a valid email address' });
    }

    const passwordValidation = validatePassword(password);
    if (!password) {
        errors.push({ field: 'password', message: 'Password is required' });
    } else if (!passwordValidation.isValid) {
        errors.push({
            field: 'password',
            message: `Password requirements: ${passwordValidation.feedback.join(', ')}`,
        });
    }

    if (!confirmPassword) {
        errors.push({ field: 'confirmPassword', message: 'Please confirm your password' });
    } else if (password !== confirmPassword) {
        errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

/**
 * Sanitize user input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
    return input
        .trim()
        .replace(/[<>]/g, '')
        .slice(0, 500); // Limit input length
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
