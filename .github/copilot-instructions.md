# Frontend Guidelines

Next.js 16 App Router + React 19 + Zustand + Tailwind CSS PWA.

## Tech Stack Specifics

- **Framework**: Next.js 16 with App Router (not Pages Router)
- **React**: Version 19 with React Compiler enabled
- **State**: Zustand for global state (auth, theme)
- **Styling**: Tailwind CSS with custom design system + Dark/Light theme
- **Theme**: React Context-based with localStorage persistence, system preference detection, class-based Tailwind dark mode
- **Forms**: React Hook Form + Zod validation
- **PWA**: Service Worker for offline support and push notifications

## Project Structure

```
/src
  /app                    # Next.js App Router
    /(authenticated)      # Protected routes group
      /journal           # Journal pages
      /goals             # Goals pages
      /insights          # Insights pages
    /(auth)              # Auth pages group (login, register, OAuth callbacks)
    layout.tsx           # Root layout with AuthProvider
    page.tsx             # Landing page
  /components
    /journal             # Journal-specific components
    /goals               # Goal components
    /chat                # Agent chat components
    /layout              # Layout components (AuthLayout, Navbar)
  /services              # API client layer (Axios)
  /store                 # Zustand stores (auth, theme)
  /lib                   # API config, utils
  /types                 # TypeScript definitions
  /validations           # Zod schemas
```

## API Service Patterns

**Example**: [`src/services/journal.service.ts`](src/services/journal.service.ts)

```typescript
import api from '@/lib/api';
import type { Journal, CreateJournalDto } from '@/types/journal.types';

class JournalService {
    async createJournal(data: CreateJournalDto) {
        const response = await api.post<{ success: boolean; data: Journal }>(
            '/journals',
            data
        );
        return response.data;
    }

    async getJournals(page = 1, limit = 20) {
        const response = await api.get<{
            success: boolean;
            data: {
                journals: Journal[];
                pagination: {
                    page: number;
                    limit: number;
                    total: number;
                    pages: number;
                };
            };
        }>(`/journals?page=${page}&limit=${limit}`);
        return response.data;
    }

    async getJournalByDate(date: Date) {
        const dateStr = date.toISOString().split('T')[0];
        const response = await api.get<{ success: boolean; data: Journal }>(
            `/journals/date/${dateStr}`
        );
        return response.data;
    }

    // Streaming endpoint
    async *streamMessage(message: string, conversationId?: string) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',  // CRITICAL: Send httpOnly cookies
            body: JSON.stringify({ message, conversationId }),
        });

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        while (reader) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = JSON.parse(line.slice(6));
                    yield data;
                }
            }
        }
    }
}

export const journalService = new JournalService();
```

### API Client Config

**Example**: [`src/lib/api.ts`](src/lib/api.ts)

```typescript
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    withCredentials: true,  // CRITICAL: Send httpOnly cookies with every request
});

// Response interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Don't redirect on login/register pages
            const publicPaths = ['/login', '/register', '/auth/google', '/auth/facebook'];
            if (!publicPaths.some(path => window.location.pathname.includes(path))) {
                useAuthStore.getState().logout();
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
```

**Service rules:**
- Use Axios for standard REST calls
- Use native `fetch` with `credentials: 'include'` for streaming (SSE)
- Type all responses with backend's `{success, data/error}` format
- Handle errors in components, not services (throw them)
- Export singleton instance (not class)

## Component Patterns

### Server Components (Default)

**Use for**:
- Layout components
- Static content
- SEO-critical pages

```typescript
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>  {/* Client component wrapper */}
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
```

### Client Components

**Mark with `'use client'` when using**:
- Hooks (useState, useEffect, etc.)
- Browser APIs (localStorage, window)
- Event handlers
- Third-party libraries with browser dependencies

**Example**: [`src/components/journal/MonthlyView.tsx`](src/components/journal/MonthlyView.tsx)

```typescript
'use client';

import { useState, useEffect } from 'react';
import { journalService } from '@/services/journal.service';

interface MonthlyViewProps {
    selectedDate: Date;
    onDateClick?: (date: Date) => void;
}

export default function MonthlyView({ selectedDate, onDateClick }: MonthlyViewProps) {
    const [monthData, setMonthData] = useState<MonthEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMonthData();
    }, [selectedDate]);

    const loadMonthData = async () => {
        setLoading(true);
        try {
            const response = await journalService.getMonthlyJournals(startDate, endDate);
            if (response.success && response.data) {
                // Process data...
                setMonthData(processedData);
            }
        } catch (error) {
            console.error('Error loading month data:', error);
            toast.error('Failed to load monthly data');
        } finally {
            setLoading(false);
        }
    };

    // Rest of component...
}
```

## State Management

### Zustand Store Pattern

**Example**: [`src/store/authStore.ts`](src/store/authStore.ts)

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/user.types';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            setUser: (user) => set({ user, isAuthenticated: !!user }),
            logout: () => set({ user: null, isAuthenticated: false }),
        }),
        {
            name: 'auth-storage',  // localStorage key
            skipHydration: false,
        }
    )
);
```

**Usage in components**:
```typescript
import { useAuthStore } from '@/store/authStore';

function Component() {
    const { user, isAuthenticated, setUser } = useAuthStore();
    
    // Use state...
}
```

**When to use Zustand**:
- Global state (auth, theme, preferences)
- Cross-component communication
- Persistent state (with localStorage)

**When to use local state**:
- Component-specific data
- Form state (use React Hook Form instead)
- Temporary UI state

## Authentication Flow

### Protected Routes

**Example**: [`src/components/layout/AuthLayout.tsx`](src/components/layout/AuthLayout.tsx)

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { userService } from '@/services/user.service';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { isAuthenticated, setUser } = useAuthStore();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Verify httpOnly cookie is valid
                const response = await userService.checkAuth();
                if (response.success && response.data) {
                    setUser(response.data);
                } else {
                    router.push('/login');
                }
            } catch (error) {
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        if (!isAuthenticated) {
            checkAuth();
        } else {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    return <>{children}</>;
}
```

### OAuth Callback Handling

**Example**: [`src/app/auth/google/callback/page.tsx`](src/app/auth/google/callback/page.tsx)

```typescript
'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { retrievePKCEParams } from '@/lib/pkce';
import { useAuthStore } from '@/store/authStore';

export default function GoogleCallback() {
    const router = useRouter();
    const { setUser } = useAuthStore();
    const hasProcessed = useRef(false);

    useEffect(() => {
        const handleCallback = async () => {
            // Prevent double execution in React Strict Mode
            if (hasProcessed.current) return;

            // Early check - if PKCE params missing, already processed
            const { codeVerifier, state } = retrievePKCEParams();
            if (!codeVerifier || !state) return;

            hasProcessed.current = true;

            try {
                const params = new URLSearchParams(window.location.search);
                const code = params.get('code');
                
                const response = await userService.googleAuthCallback(code, codeVerifier, state);
                
                if (response.success) {
                    setUser(response.data.user);
                    router.push('/journal');
                }
            } catch (error) {
                console.error('Google auth callback error:', error);
                router.push('/login');
            }
        };

        handleCallback();
    }, []);

    return <LoadingSpinner />;
}
```

**OAuth patterns**:
- Use `useRef` to prevent React Strict Mode double-execution
- Check PKCE params early, exit if missing (already consumed)
- Clean up PKCE params after successful auth
- Redirect to `/journal` on success, `/login` on error

## Dark/Light Theme System

### Implementation Overview

**Theme is managed via React Context with localStorage persistence and system preference detection.**

**Files**:
- Context: [`src/contexts/ThemeContext.tsx`](src/contexts/ThemeContext.tsx)
- Toggle: [`src/components/ThemeToggle.tsx`](src/components/ThemeToggle.tsx)
- Config: [`tailwind.config.ts`](tailwind.config.ts) - `darkMode: 'class'`
- Styles: [`src/app/globals.css`](src/app/globals.css) - CSS custom properties

### Theme Context

**Example**: [`src/contexts/ThemeContext.tsx`](src/contexts/ThemeContext.tsx)

```typescript
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('light');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Get from localStorage or system preference
        const storedTheme = localStorage.getItem('theme') as Theme | null;
        
        if (storedTheme) {
            setTheme(storedTheme);
        } else {
            // Respect system preference
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light';
            setTheme(systemTheme);
        }
        setMounted(true);
    }, []);

    useEffect(() => {
        // Apply theme class to <html> element
        const root = document.documentElement;
        
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        
        localStorage.setItem('theme', theme);
    }, [theme, mounted]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    // Prevent flash of wrong theme on initial load
    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
}
```

**Key features**:
- ✅ System preference detection via `prefers-color-scheme`
- ✅ localStorage persistence
- ✅ Prevents FOUC (flash of unstyled content) with `mounted` state
- ✅ Applies `dark` class to `<html>` element for Tailwind

### Using Theme in Components

**Hook usage**:
```typescript
import { useTheme } from '@/contexts/ThemeContext';

function MyComponent() {
    const { theme, toggleTheme } = useTheme();
    
    return (
        <button onClick={toggleTheme}>
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
    );
}
```

**Theme Toggle Component**: [`src/components/ThemeToggle.tsx`](src/components/ThemeToggle.tsx)

Integrated in Sidebar with visual toggle switch and icons.

### Tailwind CSS Dark Mode

**Configuration**: [`tailwind.config.ts`](tailwind.config.ts)

```typescript
const config: Config = {
    darkMode: 'class',  // Uses class-based dark mode
    // ...
}
```

**CRITICAL: Every color utility MUST have dark mode variant**

```typescript
// ✅ ALWAYS include dark: variants
<div className="bg-white dark:bg-gray-800">
<p className="text-gray-900 dark:text-gray-100">
<button className="bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600">
```

```typescript
// ❌ NEVER omit dark mode
<div className="bg-white">  // Will look wrong in dark mode
```

### CSS Custom Properties

**File**: [`src/app/globals.css`](src/app/globals.css)

Theme uses CSS variables for design tokens:

```css
/* Light theme (default) */
:root {
    --color-primary: #6366F1;
    --color-background: #FFFFFF;
    --color-text-primary: #111827;
    /* ... */
}

/* Dark theme */
.dark {
    --color-primary: #818CF8;  /* Lighter for visibility */
    --color-background: #111827;  /* Dark background */
    --color-text-primary: #F9FAFB;  /* Light text */
    /* ... */
}
```

**Usage in Tailwind**:
```typescript
<div className="bg-background text-text-primary">
```

### Component Styling Best Practices

```typescript
// ✅ Good: Responsive, dark mode, hover states
<div className="
    relative overflow-hidden
    bg-white dark:bg-gray-800
    rounded-3xl shadow-xl
    border border-gray-100 dark:border-gray-700
    p-6 md:p-8
    hover:shadow-2xl hover:-translate-y-1
    transition-all duration-300
">
    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
    <p className="text-gray-600 dark:text-gray-400">
</div>
```

```typescript
// ✅ Good: Gradient with dark mode variant
<div className="
    bg-gradient-to-br 
    from-indigo-50 to-purple-50 
    dark:from-gray-900 dark:to-gray-800
">
```

```typescript
// ❌ Avoid: Missing dark mode variants
<div className="bg-white text-gray-900">  // Unreadable in dark mode
<div style={{ padding: '24px' }}>  // Use Tailwind classes instead
```

### Dark Mode Checklist

When creating components, ensure:
- [ ] All `bg-*` colors have `dark:bg-*` variants
- [ ] All `text-*` colors have `dark:text-*` variants
- [ ] All `border-*` colors have `dark:border-*` variants
- [ ] Hover states work in both themes: `hover:bg-gray-100 dark:hover:bg-gray-700`
- [ ] Shadows are visible in dark mode: `shadow-lg dark:shadow-gray-900/50`
- [ ] Icons/images have proper contrast in both themes
- [ ] Form inputs styled: `dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100`

### Tailwind Conventions

**Responsive breakpoints**:
- `sm:` - 640px
- `md:` - 768px  
- `lg:` - 1024px
- `xl:` - 1280px
- `2xl:` - 1536px

**Common patterns**:
```typescript
// Responsive + Dark mode
<div className="p-4 md:p-6 lg:p-8 bg-white dark:bg-gray-800">

// Conditional dark mode
<div className={`
    ${isActive 
        ? 'bg-indigo-600 dark:bg-indigo-500' 
        : 'bg-gray-100 dark:bg-gray-700'
    }
`}>

// Group hover
<div className="group">
    <div className="opacity-0 group-hover:opacity-100 dark:opacity-50">
</div>

// Gradients with dark mode
<div className="bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700">
```

**Avoid**:
- ❌ Inline styles: `style={{ padding: '24px' }}`
- ❌ Arbitrary values: `p-[24px]` (use scale: `p-6`)
- ❌ Missing dark variants on colored elements
- ❌ Single-value responsive: `md:p-4` without mobile default

## Form Handling

**Example with React Hook Form + Zod**:

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        try {
            const response = await userService.login(data);
            if (response.success) {
                setUser(response.data.user);
                router.push('/journal');
            }
        } catch (error) {
            toast.error('Login failed');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register('email')} type="email" />
            {errors.email && <span>{errors.email.message}</span>}
            
            <input {...register('password')} type="password" />
            {errors.password && <span>{errors.password.message}</span>}
            
            <button type="submit">Login</button>
        </form>
    );
}
```

## PWA Patterns

### Service Worker

**File**: [`public/sw.js`](public/sw.js)
- Caches static assets for offline access
- Handles push notification clicks
- Self-updates on new versions

### Push Notifications

**Example**: [`src/components/PushNotificationPrompt.tsx`](src/components/PushNotificationPrompt.tsx)

```typescript
const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlB64ToUint8Array(VAPID_PUBLIC_KEY),
        });
        
        await pushService.saveSubscription(subscription);
    }
};
```

## Performance Patterns

1. **Dynamic imports**: Code-split heavy components
   ```typescript
   const HeavyChart = dynamic(() => import('./HeavyChart'), { ssr: false });
   ```

2. **Image optimization**: Use Next.js `<Image>` component
   ```typescript
   import Image from 'next/image';
   <Image src="/icon.png" width={48} height={48} alt="Icon" />
   ```

3. **Debounce search**: Use custom hook or lodash
   ```typescript
   const debouncedSearch = useMemo(() => debounce(search, 300), []);
   ```

4. **Virtualization**: Use `react-window` for long lists

## Critical Patterns

1. **Always use `credentials: 'include'`** for fetch/Axios (httpOnly cookies)
2. **Handle loading states** in all async operations
3. **Type everything**: No `any` types, use proper TypeScript
4. **Dark mode**: All color utilities need `dark:` variant
5. **Mobile-first**: Design for mobile, enhance for desktop
6. **Error boundaries**: Wrap unstable components

## Examples

- Full CRUD page: [`src/app/(authenticated)/goals/page.tsx`](src/app/(authenticated)/goals/page.tsx)
- Complex form: [`src/components/journal/DayView.tsx`](src/components/journal/DayView.tsx)
- Streaming chat: [`src/components/chat/AgentChatExample.tsx`](src/components/chat/AgentChatExample.tsx)
- Protected layout: [`src/components/layout/AuthLayout.tsx`](src/components/layout/AuthLayout.tsx)
