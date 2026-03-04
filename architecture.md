# Frontend Architecture

## Overview

The frontend is a **Next.js 16 PWA** (Progressive Web App) built with React 19, providing an AI-powered journaling experience with goal tracking, weekly insights, and real-time chat. It uses the App Router with client-side rendering and Zustand for state management.

---

## Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| Framework | Next.js 16 (App Router + Turbopack) | React framework with file-based routing |
| UI Library | React 19 | Component-based UI |
| Language | TypeScript | Type-safe JavaScript |
| Styling | Tailwind CSS 3 | Utility-first CSS |
| State Management | Zustand 4 | Lightweight global state |
| HTTP Client | Axios | API communication with interceptors |
| Icons | Heroicons + Lucide React | SVG icon libraries |
| Toasts | Sonner | Toast notifications |
| Markdown | react-markdown + react-syntax-highlighter | Render AI responses |
| PWA | @ducanh2912/next-pwa | Service worker & offline support |
| OAuth | @react-oauth/google | Google sign-in |
| Validation | Zod 4 | Form & data validation |
| Utilities | clsx, tailwind-merge | Conditional class names |

---

## Project Structure

```
frontend/src/
├── app/                           # Next.js App Router
│   ├── (authenticated)/           # Protected route group
│   │   ├── chat/page.tsx          # AI chat interface
│   │   ├── debug-sw/page.tsx      # ⚠️ Debug only
│   │   ├── goals/
│   │   │   ├── [id]/edit/page.tsx # Edit goal
│   │   │   ├── create/page.tsx    # Create goal
│   │   │   └── page.tsx           # Goals list
│   │   ├── insights/page.tsx      # Weekly AI insights
│   │   ├── journal/page.tsx       # Journal (day/week/month views)
│   │   ├── profile/page.tsx       # User profile & settings
│   │   ├── templates/page.tsx     # Journal templates
│   │   └── layout.tsx             # Auth layout wrapper
│   ├── auth/                      # OAuth callback handlers
│   │   ├── facebook/callback/page.tsx
│   │   └── google/callback/page.tsx
│   ├── forgot-password/page.tsx
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── globals.css                # Global styles + Tailwind imports
│   ├── layout.tsx                 # Root layout (providers, metadata)
│   └── page.tsx                   # Landing page
├── components/
│   ├── auth/
│   │   └── OAuthButtons.tsx       # Google/Facebook OAuth buttons
│   ├── chat/
│   │   ├── AgentChatExample.tsx   # ⚠️ Unused prototype
│   │   ├── Chat.tsx               # Main chat component
│   │   ├── ChatHistory.tsx        # ⚠️ Unused (replaced by Modal)
│   │   └── ChatHistoryModal.tsx   # Chat history modal
│   ├── common/
│   │   └── ConfirmationModal.tsx  # Reusable confirmation dialog
│   ├── goals/
│   │   ├── GoalForm.tsx           # Goal create/edit form
│   │   └── GoalGeneratorChat.tsx  # AI goal generation drawer
│   ├── journal/
│   │   ├── DayView.tsx            # Single day journal editor
│   │   ├── DynamicField.tsx       # Template field renderer
│   │   ├── MonthlyView.tsx        # Monthly calendar overview
│   │   └── WeeklyView.tsx         # Weekly summary view
│   ├── layout/
│   │   ├── AuthLayout.tsx         # Authenticated page wrapper
│   │   └── Sidebar.tsx            # Navigation sidebar
│   ├── profile/
│   │   └── ProfileForm.tsx        # Profile edit form
│   ├── templates/
│   │   ├── CloneTemplateModal.tsx
│   │   ├── CreateTemplateModal.tsx
│   │   ├── EditTemplateModal.tsx
│   │   ├── TemplateCard.tsx
│   │   ├── ViewTemplateModal.tsx
│   │   └── index.ts               # Barrel export
│   ├── InstallButton.tsx          # PWA install prompt
│   ├── PushNotificationPrompt.tsx # First-time push prompt
│   ├── PushNotificationSettings.tsx # Push settings toggle
│   ├── PWADebug.tsx               # ⚠️ Unused debug component
│   ├── PWARegister.tsx            # Service worker registration
│   ├── ServiceWorkerDebug.tsx     # ⚠️ Unused debug component
│   └── ThemeToggle.tsx            # Dark/light theme toggle
├── constants/
│   ├── goal.constants.ts          # Goal types, categories, limits
│   ├── insight.constants.ts       # Insight status labels/colors
│   └── profile.constants.ts       # Profile form options
├── contexts/
│   └── ThemeContext.tsx            # Dark/light theme context
├── hooks/
│   ├── useInstallPrompt.ts        # PWA install prompt hook
│   └── usePushNotifications.ts    # Push notification management
├── lib/
│   ├── api.ts                     # Axios instance + interceptors
│   ├── utils.ts                   # General utilities
│   └── validation.ts              # Validation helpers
├── providers/
│   └── AuthProvider.tsx           # Auth check on mount
├── services/
│   ├── chat.service.ts            # Chat API methods
│   ├── journal.service.ts         # Journal API methods
│   ├── journalTemplate.service.ts # Template API methods
│   └── toast.service.ts           # Toast notification wrapper
├── store/
│   ├── authStore.ts               # Auth state (Zustand)
│   ├── chatStore.ts               # Chat state (Zustand)
│   └── documentStore.ts           # ⚠️ Unused store
├── types/
│   ├── journal.types.ts
│   └── journalTemplate.types.ts
├── utils/
│   ├── pkce.ts                    # PKCE code verifier/challenge
│   └── weekUtils.ts               # Week date calculations
└── validations/                   # Zod validation schemas
    ├── auth/
    │   ├── forgot-password.schema.ts
    │   ├── login.schema.ts
    │   └── signup.schema.ts
    ├── fields/
    │   ├── email.ts
    │   ├── name.ts
    │   ├── password.ts
    │   └── phone.ts
    ├── profile/
    │   └── profile.schema.ts
    └── index.ts
```

---

## Application Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Browser                           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │ App Router  │  │  Providers   │  │  Service    │ │
│  │ (Pages)     │──│  (Auth,      │──│  Worker     │ │
│  │             │  │   Theme)     │  │  (PWA)      │ │
│  └──────┬──────┘  └──────────────┘  └────────────┘ │
│         │                                           │
│  ┌──────▼──────┐  ┌──────────────┐  ┌────────────┐ │
│  │ Components  │  │  Zustand     │  │  Services   │ │
│  │ (UI)        │──│  Stores      │──│  (API)      │ │
│  │             │  │  (State)     │  │             │ │
│  └─────────────┘  └──────────────┘  └──────┬─────┘ │
│                                            │       │
└────────────────────────────────────────────┼───────┘
                                             │ HTTP
                                             ▼
                                     ┌──────────────┐
                                     │  Backend API  │
                                     │  /api/v1/*    │
                                     └──────────────┘
```

---

## Routing & Navigation

### Route Map

| Path | Access | Page | Description |
|------|--------|------|-------------|
| `/` | Public | Landing | Marketing page with quote slider |
| `/login` | Public | Login | Email/password + OAuth |
| `/signup` | Public | Signup | Registration form |
| `/forgot-password` | Public | Forgot Password | OTP-based password reset |
| `/auth/google/callback` | Public | OAuth Callback | Google OAuth redirect handler |
| `/auth/facebook/callback` | Public | OAuth Callback | Facebook OAuth redirect handler |
| `/journal` | Auth | Journal | Main journaling interface |
| `/chat` | Auth | AI Chat | Conversational AI assistant |
| `/goals` | Auth | Goals | Goal management dashboard |
| `/goals/create` | Auth | Create Goal | Goal creation form |
| `/goals/[id]/edit` | Auth | Edit Goal | Goal editing form |
| `/insights` | Auth | Insights | Weekly AI-powered insights |
| `/profile` | Auth | Profile | User settings & notifications |
| `/templates` | Auth | Templates | Journal template management |

### Route Groups

- **`(authenticated)/`** — Wraps all protected pages with `AuthLayout` (includes Sidebar navigation)
- **Public routes** — Landing, login, signup, forgot-password, OAuth callbacks
- All pages use `'use client'` directive (client components)

---

## Provider Hierarchy

```
<html>
  <body>
    <ThemeProvider>          ← Dark/light theme (localStorage)
      <AuthProvider>         ← Auth check on mount (GET /users/profile)
        <PWARegister />      ← Service worker registration
        {children}           ← Page content
        <InstallButton />    ← PWA install prompt
        <Toaster />          ← Toast notifications (sonner)
      </AuthProvider>
    </ThemeProvider>
  </body>
</html>
```

---

## Authentication

### Flow

```
App Mount
  → AuthProvider calls checkAuth()
    → GET /users/profile (withCredentials: true)
      → Cookie sent automatically
        → 200: Set user in authStore, show app
        → 401: Clear authStore, show login
```

### Auth Store (Zustand)

| Method | Description |
|--------|-------------|
| `login(email, password)` | POST /auth/login → set user |
| `register(email, password, name)` | POST /auth/register → set user |
| `logout()` | POST /auth/logout → clear state |
| `checkAuth()` | GET /users/profile → verify session |
| `refreshProfile()` | GET /users/profile → update user data |
| `setUser(user)` | Direct user state update |

### Security Model
- **httpOnly cookies** — No token in JavaScript (XSS prevention)
- **withCredentials: true** — Axios sends cookies automatically
- **401 interceptor** — Auto-redirect to `/login` (except login/register endpoints)
- **OAuth PKCE** — Code verifier/challenge for Google OAuth (via `utils/pkce.ts`)

---

## State Management

### Strategy

| Scope | Tool | Example |
|-------|------|---------|
| Global auth | Zustand (`authStore`) | User object, isAuthenticated |
| Global chat | Zustand (`chatStore`) | Chat state |
| Page-local | React `useState` | Form data, loading states, UI toggles |
| Theme | React Context | Dark/light mode preference |

### Why Zustand
- Minimal boilerplate vs Redux
- No Provider wrapper needed (except for context-based state)
- Built-in persistence support
- Works well with Next.js client components

---

## API Communication

### Axios Configuration (`lib/api.ts`)

```
Base URL:  NEXT_PUBLIC_API_URL || http://localhost:5000/api/v1
Timeout:   30 seconds
Cookies:   withCredentials: true (httpOnly cookie auth)
```

### Interceptors

| Type | Behavior |
|------|----------|
| Request | Cookies auto-sent (no manual token) |
| Response 401 | Redirect to `/login` (skip for login/register) |
| Response 403 | Log "Forbidden" |
| Response 404 | Log "Not found" |
| Response 500 | Log "Server error" |

### Service Layer

Services wrap API calls with typed methods:

| Service | Key Methods |
|---------|-------------|
| `chat.service.ts` | `streamMessage()`, `getConversations()`, `getConversation()`, `deleteConversation()` |
| `journal.service.ts` | `createJournal()`, `updateJournal()`, `getJournalByDate()`, `getJournals()` |
| `journalTemplate.service.ts` | `getSystemTemplates()`, `getUserTemplates()`, `createTemplate()`, `updateTemplate()` |
| `toast.service.ts` | `success()`, `error()`, `info()`, `warning()` |

---

## Theme System

### Implementation

- `ThemeContext` provides `theme` (light/dark) and `toggleTheme()`
- Persisted in `localStorage` under key `"theme"`
- Falls back to `prefers-color-scheme` system preference
- Applied via Tailwind's `dark:` variant (class-based strategy)
- `suppressHydrationWarning` on `<html>` prevents hydration mismatch

### Usage Pattern
```
className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
```

---

## PWA Features

### Components

| Component | Purpose |
|-----------|---------|
| `PWARegister` | Registers service worker on mount |
| `InstallButton` | Shows PWA install prompt (uses `useInstallPrompt` hook) |
| `PushNotificationPrompt` | First-time push notification opt-in |
| `PushNotificationSettings` | Toggle push notifications in profile |

### Hooks

| Hook | Purpose |
|------|---------|
| `useInstallPrompt` | Captures `beforeinstallprompt` event, manages install flow |
| `usePushNotifications` | Subscribe/unsubscribe, VAPID key fetching, test notifications |

### PWA Configuration (`next.config.mjs`)

- `@ducanh2912/next-pwa` plugin
- Service worker output to `public/`
- Workbox caching with aggressive front-end nav caching
- Reload on online recovery

---

## Key Page Flows

### Journal Page (`/journal`)

```
Mount
  → Load templates (system + user)
  → Set default template
  → Load journal by date + template

Template Change
  → Auto-save current content
  → Load journal for new template + current date

Auto-Save (10s interval)
  → Compare current data with last saved
  → Silent save if changed (no toast)

Manual Save
  → Save with toast notification
  → Show push notification prompt on first save
```

**Views:** Day (editor) | Weekly (summary) | Monthly (calendar)

### Chat Page (`/chat`)

```
Send Message
  → Add user message to UI
  → Stream response via chatService.streamMessage()
  → Update assistant message as chunks arrive
  → Save conversation ID for future messages

History
  → Open ChatHistoryModal
  → Load past conversations
  → Select to continue conversation
```

### Goals Page (`/goals`)

```
Layout
  → Goals grouped by type (weekly/monthly/yearly)
  → Each section shows active count vs limit

Actions
  → Create: Navigate to /goals/create?type=weekly
  → Edit: Navigate to /goals/[id]/edit
  → Status: active ↔ paused → completed → archived

AI Generator
  → Open drawer with GoalGeneratorChat
  → Multi-turn conversation
  → Preview generated goals → batch create
```

### Insights Page (`/insights`)

```
Week Navigation
  → Previous/Next week buttons
  → Cannot generate for future weeks

Generate
  → POST /insights/generate with weekStart
  → Display: reflection points, goal alignment, suggestion
  → Regenerate button for existing insights
```

---

## Styling Conventions

### Design System

| Element | Value |
|---------|-------|
| Primary colors | Indigo-600 / Purple-600 gradient |
| Background | `from-indigo-50 via-purple-50 to-pink-50` (light) |
| Dark background | `from-gray-900 via-gray-800 to-gray-900` |
| Border radius | `rounded-xl` / `rounded-2xl` / `rounded-3xl` |
| Shadows | `shadow-sm` → `shadow-lg` → `shadow-2xl` |
| Font | Inter (Google Fonts) |
| Responsive | Mobile-first with `sm:` / `md:` / `lg:` breakpoints |

### Patterns
- Gradient backgrounds on hero sections
- `backdrop-blur-sm` for header overlays
- Consistent `hover:shadow-md transition-shadow` for cards
- Loading skeletons with `animate-pulse`

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API base URL |

---

## Build & Development

### Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Development server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | ESLint check |
| `npm run type-check` | TypeScript type checking |

### Import Aliases

| Alias | Maps To |
|-------|---------|
| `@/` | `src/` |
| `@/components/*` | `src/components/*` |
| `@/lib/*` | `src/lib/*` |
| `@/store/*` | `src/store/*` |
| `@/services/*` | `src/services/*` |
| `@/hooks/*` | `src/hooks/*` |
| `@/contexts/*` | `src/contexts/*` |
| `@/constants/*` | `src/constants/*` |
| `@/types/*` | `src/types/*` |
| `@/utils/*` | `src/utils/*` |
| `@/validations/*` | `src/validations/*` |
