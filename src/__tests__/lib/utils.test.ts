/**
 * Tests for lib/utils.ts
 */

import { cn, formatFileSize, formatDate } from '@/lib/utils'

describe('Utility Functions', () => {
    describe('cn', () => {
        it('should merge className strings', () => {
            const result = cn('px-2', 'py-1')
            expect(result).toContain('px-2')
            expect(result).toContain('py-1')
        })

        it('should handle conditional classNames', () => {
            const isActive = true
            const result = cn('base-class', isActive && 'active-class')
            expect(result).toContain('base-class')
            expect(result).toContain('active-class')
        })

        it('should remove conflicting tailwind classes', () => {
            // px-2 should override px-4
            const result = cn('px-4 py-2', 'px-2')
            expect(result).toContain('px-2')
            expect(result).not.toContain('px-4')
        })

        it('should handle falsy values', () => {
            const result = cn('base', false && 'false-class', undefined, 'other')
            expect(result).toContain('base')
            expect(result).toContain('other')
            expect(result).not.toContain('false-class')
        })

        it('should handle array of classes', () => {
            const classes = ['class1', 'class2']
            const result = cn(classes, 'class3')
            expect(result).toContain('class1')
            expect(result).toContain('class2')
            expect(result).toContain('class3')
        })
    })

    describe('formatFileSize', () => {
        it('should format zero bytes', () => {
            expect(formatFileSize(0)).toBe('0 Bytes')
        })

        it('should format bytes', () => {
            expect(formatFileSize(512)).toContain('Bytes')
        })

        it('should format kilobytes', () => {
            expect(formatFileSize(1024)).toBe('1 KB')
            expect(formatFileSize(2048)).toBe('2 KB')
        })

        it('should format megabytes', () => {
            expect(formatFileSize(1024 * 1024)).toBe('1 MB')
            expect(formatFileSize(5 * 1024 * 1024)).toBe('5 MB')
        })

        it('should format gigabytes', () => {
            expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB')
            expect(formatFileSize(2.5 * 1024 * 1024 * 1024)).toContain('GB')
        })

        it('should round to 2 decimal places', () => {
            const result = formatFileSize(1.5 * 1024)
            expect(result).toMatch(/^\d+\.?\d{0,2}\s(Bytes|KB|MB|GB)$/)
        })

        it('should handle large numbers', () => {
            const largeNumber = 1024 * 1024 * 1024 * 100 // 100 GB
            const result = formatFileSize(largeNumber)
            expect(result).toContain('GB')
        })
    })

    describe('formatDate', () => {
        it('should format date string correctly', () => {
            const dateStr = '2024-01-15'
            const result = formatDate(dateStr)
            expect(result).toContain('January')
            expect(result).toContain('15')
            expect(result).toContain('2024')
        })

        it('should format Date object correctly', () => {
            const date = new Date('2024-01-15')
            const result = formatDate(date)
            expect(result).toContain('January')
            expect(result).toContain('15')
            expect(result).toContain('2024')
        })

        it('should handle ISO date string', () => {
            const isoDate = '2024-01-15T10:30:00Z'
            const result = formatDate(isoDate)
            expect(result).toMatch(/\w+\s\d+,\s\d{4}/)
        })

        it('should use US locale format', () => {
            const date = new Date('2024-12-25')
            const result = formatDate(date)
            expect(result).toContain('December')
            expect(result).toContain('25')
            expect(result).toContain('2024')
        })

        it('should handle leap year dates', () => {
            const leapDate = new Date('2024-02-29')
            const result = formatDate(leapDate)
            expect(result).toContain('February')
            expect(result).toContain('29')
        })

        it('should be consistent with same input', () => {
            const date = '2024-06-15'
            const result1 = formatDate(date)
            const result2 = formatDate(date)
            expect(result1).toBe(result2)
        })
    })
})
