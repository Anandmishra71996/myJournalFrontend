// Field validations
export { emailField, type EmailFieldType } from './fields/email';
export {
    passwordField,
    getPasswordStrength,
    getPasswordStrengthColor,
    getPasswordStrengthLabel,
    getPasswordStrengthWidth,
    type PasswordFieldType,
} from './fields/password';
export { nameField, type NameFieldType } from './fields/name';
export { phoneField, formatPhoneNumber, type PhoneFieldType } from './fields/phone';

// Auth schemas
export {
    loginSchema,
    validateLoginForm,
    type LoginFormData,
} from './auth/login.schema';
export {
    signupSchema,
    validateSignupForm,
    type SignupFormData,
} from './auth/signup.schema';
export {
    forgotPasswordSchema,
    validateForgotPasswordForm,
    type ForgotPasswordFormData,
} from './auth/forgot-password.schema';

// Profile schemas
export {
    profileSchema,
    validateProfileForm,
    type ProfileFormData,
} from './profile/profile.schema';
