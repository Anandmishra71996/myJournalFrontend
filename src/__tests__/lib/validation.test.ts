/**
 * Tests for lib/validation.ts
 */

import {
    validateEmail,
    validatePassword,
    validateName,
} from '@/lib/validation'

describe('Validation Utilities', () => {
    describe('validateEmail', () => {
        it('should validate correct email format', () => {
            expect(validateEmail('user@example.com')).toBe(true)
            expect(validateEmail('test.user@domain.co.uk')).toBe(true)
            expect(validateEmail('user+tag@example.com')).toBe(true)
        })

        it('should reject invalid email format', () => {
            expect(validateEmail('invalid.email')).toBe(false)
            expect(validateEmail('user@')).toBe(false)
            expect(validateEmail('@example.com')).toBe(false)
            expect(validateEmail('user @ example.com')).toBe(false)
            expect(validateEmail('')).toBe(false)
        })

        it('should reject emails exceeding max length', () => {
            const longEmail = 'a'.repeat(255) + '@example.com'
            expect(validateEmail(longEmail)).toBe(false)
        })

        it('should trim whitespace', () => {
            expect(validateEmail('  user@example.com  ')).toBe(true)
        })
    })

    describe('validatePassword', () => {
        it('should validate strong password', () => {
            const result = validatePassword('SecurePass123!')

            expect(result.isValid).toBe(true)
            expect(result.strength).toBe('strong')
            expect(result.feedback.length).toBe(0)
        })

        it('should identify weak password - too short', () => {
            const result = validatePassword('Short1!')

            expect(result.isValid).toBe(false)
            expect(result.strength).toBe('weak')
            expect(result.feedback).toContain('At least 8 characters')
        })

        it('should identify missing uppercase', () => {
            const result = validatePassword('lowercase123!')

            expect(result.isValid).toBe(false)
            expect(result.feedback).toContain('At least one uppercase letter')
        })

        it('should identify missing lowercase', () => {
            const result = validatePassword('UPPERCASE123!')

            expect(result.isValid).toBe(false)
            expect(result.feedback).toContain('At least one lowercase letter')
        })

        it('should identify missing number', () => {
            const result = validatePassword('NoNumbers!')

            expect(result.isValid).toBe(false)
            expect(result.feedback).toContain('At least one number')
        })

        it('should identify missing special character', () => {
            const result = validatePassword('NoSpecial123')

            expect(result.isValid).toBe(false)
            expect(result.feedback).toContain('At least one special character')
        })

        it('should calculate strength based on criteria met', () => {
            // Fair strength - 3 out of 5
            const fair = validatePassword('Pass1234')
            expect(fair.strength).toBe('fair')

            // Good strength - 4 out of 5
            const good = validatePassword('Pass123!')
            expect(good.strength).toBe('good')

            // Strong - all 5
            const strong = validatePassword('Strong123!')
            expect(strong.strength).toBe('strong')
        })
    })

    describe('validateName', () => {
        it('should validate correct name format', () => {
            expect(validateName('John Doe')).toBe(true)
            expect(validateName('Mary-Jane')).toBe(true)
            expect(validateName("O'Brien")).toBe(true)
            expect(validateName('Jean-Pierre')).toBe(true)
        })

        it('should reject short names', () => {
            expect(validateName('J')).toBe(false)
            expect(validateName('A')).toBe(false)
        })

        it('should reject names exceeding max length', () => {
            const longName = 'A'.repeat(51)
            expect(validateName(longName)).toBe(false)
        })

        it('should reject names with invalid characters', () => {
            expect(validateName('John123')).toBe(false)
            expect(validateName('John@Doe')).toBe(false)
            expect(validateName('John_Doe')).toBe(false)
            expect(validateName('John.Doe')).toBe(false)
        })

        it('should trim whitespace', () => {
            expect(validateName('  John Doe  ')).toBe(true)
        })

        it('should accept valid names with apostrophes and hyphens', () => {
            expect(validateName("Mary O'Connor")).toBe(true)
            expect(validateName('Jean-Claude')).toBe(true)
            expect(validateName("Pat O'Neill-Smith")).toBe(true)
        })
    })
})
