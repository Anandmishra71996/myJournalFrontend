import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: 'class',
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Primary Colors
                primary: {
                    DEFAULT: 'var(--color-primary)',
                    light: 'var(--color-primary-light)',
                    dark: 'var(--color-primary-dark)',
                    dim: '#7e51ff', // For gradients
                },
                secondary: {
                    DEFAULT: 'var(--color-secondary)',
                    light: 'var(--color-secondary-light)',
                    dark: 'var(--color-secondary-dark)',
                    dim: '#5b2d94', // For gradients
                },
                accent: {
                    DEFAULT: 'var(--color-accent)',
                    light: 'var(--color-accent-light)',
                },
                // Surface Hierarchy
                surface: {
                    DEFAULT: 'var(--color-surface)',
                    elevated: 'var(--color-surface-elevated)',
                    lowest: 'var(--color-surface-lowest)',
                    low: 'var(--color-surface-low)',
                    high: 'var(--color-surface-high)',
                    highest: 'var(--color-surface-highest)',
                    bright: 'var(--color-surface-bright)',
                },
                // On Colors (text on surfaces)
                'on-surface': {
                    DEFAULT: 'var(--color-text-primary)',
                    variant: 'var(--color-text-secondary)',
                },
                'on-primary': {
                    DEFAULT: '#ffffff',
                },
                'on-secondary': {
                    DEFAULT: '#ffffff',
                },
                // Container Colors
                'surface-container': {
                    DEFAULT: 'var(--color-surface-elevated)',
                    lowest: 'var(--color-surface-lowest)',
                    low: 'var(--color-surface-low)',
                    high: 'var(--color-surface-high)',
                    highest: 'var(--color-surface-highest)',
                },
                // Outline Colors
                outline: {
                    DEFAULT: 'var(--color-outline)',
                    variant: 'var(--color-outline-variant)',
                },
                // Background
                background: 'var(--color-background)',
                // Text Colors
                text: {
                    primary: 'var(--color-text-primary)',
                    secondary: 'var(--color-text-secondary)',
                    tertiary: 'var(--color-text-tertiary)',
                },
                // Mood Colors
                mood: {
                    excellent: 'var(--mood-excellent)',
                    good: 'var(--mood-good)',
                    neutral: 'var(--mood-neutral)',
                    low: 'var(--mood-low)',
                    difficult: 'var(--mood-difficult)',
                },
                // Status Colors
                success: 'var(--color-success)',
                error: {
                    DEFAULT: 'var(--color-error)',
                    container: 'var(--color-status-danger-soft)',
                },
                warning: 'var(--color-warning)',
                info: 'var(--color-info)',
            },
            borderRadius: {
                sm: 'var(--radius-sm)',
                md: 'var(--radius-md)',
                lg: 'var(--radius-lg)',
                xl: 'var(--radius-xl)',
            },
            fontFamily: {
                manrope: ['Manrope', 'sans-serif'],
                inter: ['Inter', 'sans-serif'],
            },
            fontSize: {
                // Display Sizes
                'display-xl': ['4rem', { lineHeight: '1.1', fontWeight: '700' }],
                'display-lg': ['3rem', { lineHeight: '1.15', fontWeight: '700' }],
                'display-md': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
                'display-sm': ['2rem', { lineHeight: '1.25', fontWeight: '700' }],
                // Headline Sizes
                'headline-lg': ['1.75rem', { lineHeight: '1.3', fontWeight: '600' }],
                'headline-md': ['1.5rem', { lineHeight: '1.35', fontWeight: '600' }],
                'headline-sm': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
                'headline-xs': ['1.125rem', { lineHeight: '1.45', fontWeight: '600' }],
                // Body Sizes
                'body-lg': ['1.125rem', { lineHeight: '1.6' }],
                'body-md': ['1rem', { lineHeight: '1.6' }],
                'body-sm': ['0.875rem', { lineHeight: '1.5' }],
                // Label Sizes
                'label-lg': ['1rem', { lineHeight: '1.4', fontWeight: '500' }],
                'label-md': ['0.875rem', { lineHeight: '1.4', fontWeight: '500' }],
                'label-sm': ['0.75rem', { lineHeight: '1.35', fontWeight: '500' }],
                'label-xs': ['0.625rem', { lineHeight: '1.3', fontWeight: '500' }],
            },
            spacing: {
                'spacing-1': 'var(--space-xs)',
                'spacing-2': 'var(--space-sm)',
                'spacing-4': 'var(--space-md)',
                'spacing-6': 'var(--space-lg)',
                'spacing-8': 'var(--space-xl)',
                'spacing-12': 'var(--space-2xl)',
            },
            boxShadow: {
                'sm': 'var(--shadow-sm)',
                'md': 'var(--shadow-md)',
                'lg': 'var(--shadow-lg)',
                'ambient': '0 20px 40px rgba(0, 0, 0, 0.4)',
            },
            backdropBlur: {
                'xs': '2px',
                'sm': '4px',
                'md': '12px',
                'lg': '20px',
            },
            transitionDuration: {
                'fast': '150ms',
                'base': '200ms',
                'slow': '300ms',
            },
            animation: {
                'in': 'fadeIn 200ms ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
            },
        },
    },
    plugins: [],
};
export default config;
