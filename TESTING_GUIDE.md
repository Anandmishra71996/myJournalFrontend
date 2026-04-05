# Frontend Testing Guide

Comprehensive guide for writing and maintaining tests in the frontend application.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Test Structure](#test-structure)
- [Testing Patterns](#testing-patterns)
- [Test Utilities](#test-utilities)
- [Running Tests](#running-tests)
- [Coverage Guidelines](#coverage-guidelines)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Overview

The frontend uses **Jest** as the testing framework with **React Testing Library** for component testing. Tests follow industry best practices for modern React 19 applications.

### Tech Stack
- **Framework**: Jest 29.x
- **React Library**: React Testing Library 14.x
- **TypeScript**: Full TypeScript support
- **Browser Environment**: jsdom
- **Mocking**: Jest mock functions

### Test Organization

```
frontend/src/
├── __tests__/
│   ├── setup.ts                           # Global test setup
│   ├── utils/
│   │   ├── testHelpers.ts               # Test data builders, helpers
│   ├── services/
│   │   ├── aiTemplate.service.test.ts   # AI template service tests
│   │   ├── journal.service.test.ts      # Journal service tests
│   │   ├── journalTemplate.service.test.ts
│   │   └── toast.service.test.ts        # Toast/notification tests
│   ├── store/
│   │   └── authStore.test.ts            # Zustand auth state tests
│   ├── lib/
│   │   ├── validation.test.ts           # Validation utilities
│   │   └── utils.test.ts                # General utilities
│   ├── hooks/
│   │   └── useInstallPrompt.test.ts     # Custom hooks
│   └── components/
│       └── ToastIntegration.test.tsx    # Component integration tests
```

---

## Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Run Tests
```bash
# Run all tests
npm test

# Run in watch mode (auto-rerun on file changes)
npm run test:watch

# Run with coverage report
npm run test:coverage

# Run in CI mode (optimized for CI/CD pipelines)
npm run test:ci
```

### 3. View Coverage
After running tests with coverage, view the report:
```bash
# Coverage is generated in coverage/ directory
# Open in browser for visual report
open coverage/lcov-report/index.html  # macOS
xdg-open coverage/lcov-report/index.html  # Linux
```

---

## Test Structure

### File Naming Convention
- Test files: `*.test.ts`, `*.test.tsx`, `*.spec.ts`, `*.spec.tsx`
- Location: Mirror source structure in `__tests__/` directory
- Example: `src/services/journal.service.ts` → `src/__tests__/services/journal.service.test.ts`

### Basic Test Template

```typescript
import { myFunction } from '@/path/to/function'
import { TestDataBuilder, mockApiResponse } from '../utils/testHelpers'

// Mock external dependencies
jest.mock('@/lib/api', () => ({
  default: { get: jest.fn(), post: jest.fn() },
}))

import api from '@/lib/api'

describe('MyFunction', () => {
  const mockApi = api as jest.Mocked<typeof api>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should do something', () => {
    const result = myFunction()
    expect(result).toBeDefined()
  })
})
```

---

## Testing Patterns

### 1. Service Testing

Services typically make API calls. Mock the API and test the service logic:

```typescript
describe('JournalService', () => {
  it('should fetch journals', async () => {
    const mockJournals = [
      TestDataBuilder.createJournal(),
      TestDataBuilder.createJournal(),
    ]

    mockApi.get.mockResolvedValue(
      mockApiResponse({ journals: mockJournals })
    )

    const result = await journalService.getJournals()

    expect(mockApi.get).toHaveBeenCalledWith('/journals', expect.anything())
    expect(result).toEqual(mockJournals)
  })
})
```

### 2. Zustand Store Testing

Test state updates and async thunks:

```typescript
describe('AuthStore', () => {
  it('should login user', async () => {
    mockApi.post.mockResolvedValue(
      mockApiResponse({ user: TestDataBuilder.createUser() })
    )

    const { result } = renderHook(() => useAuthStore())

    await act(async () => {
      await result.current.login('test@example.com', 'password')
    })

    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toBeDefined()
  })
})
```

### 3. Component Testing with Hooks

Use `renderWithProviders` for components that need context:

```typescript
describe('MyComponent', () => {
  it('should render and handle user interaction', async () => {
    const user = userEvent.setup()
    render(<MyComponent />)

    const button = screen.getByRole('button', { name: /click me/i })
    await user.click(button)

    expect(screen.getByText('Clicked!')).toBeInTheDocument()
  })
})
```

### 4. Validation Testing

Test validation rules thoroughly:

```typescript
describe('validateEmail', () => {
  it('should accept valid emails', () => {
    expect(validateEmail('user@example.com')).toBe(true)
  })

  it('should reject invalid emails', () => {
    expect(validateEmail('invalid')).toBe(false)
    expect(validateEmail('user@')).toBe(false)
  })
})
```

---

## Test Utilities

### TestDataBuilder

Create consistent test data:

```typescript
// Create test user
const user = TestDataBuilder.createUser()

// Create test with overrides
const user = TestDataBuilder.createUser({
  name: 'Custom Name',
  email: 'custom@example.com'
})

// Available builders
TestDataBuilder.createUser()
TestDataBuilder.createGoal()
TestDataBuilder.createJournal()
TestDataBuilder.createTemplate()
```

### Mock Utilities

Mock API responses consistently:

```typescript
// Successful response
mockApi.get.mockResolvedValue(mockApiResponse(data))

// Error response
mockApi.post.mockRejectedValue(mockApiError('Error message', 400))

// Mock localStorage
setupLocalStorageMock()
```

### Common Assertions

```typescript
// Check successful response format
TestAssertions.expectSuccessResponse(response)

// Check error response format
TestAssertions.expectErrorResponse(response)

// Validate MongoDB ObjectId format
TestAssertions.expectValidObjectId(id)
```

---

## Running Tests

### Watch Mode
```bash
npm run test:watch

# Watch specific file
npm run test:watch -- journal.service.test.ts

# Watch specific directory
npm run test:watch -- src/__tests__/services
```

### Coverage Report
```bash
npm run test:coverage

# Coverage for specific file
npm run test:coverage -- journal.service.test.ts
```

### CI/CD Pipeline
```bash
npm run test:ci
# Runs with maxWorkers=2, generates coverage, suitable for CI servers
```

---

## Coverage Guidelines

### Current Thresholds
- Branches: 50%
- Functions: 50%
- Lines: 50%
- Statements: 50%

### Target Coverage (Recommended)

| Area | Target | Priority |
|------|--------|----------|
| Services | 80%+ | High |
| Validation | 90%+ | High |
| Utilities | 75%+ | Medium |
| Hooks | 70%+ | Medium |
| Components | 60%+ | Low |
| Store | 75%+ | Medium |

### Excluded from Coverage
- `*.d.ts` (TypeScript definitions)
- `__tests__/**` (test files)
- `*.stories.tsx` (Storybook files)
- `app/**` (Next.js routing)

---

## Best Practices

### 1. Test Naming
- Use descriptive test names
- Follow pattern: "should [expected behavior] [when condition]"

```typescript
// ❌ Bad
it('works', () => {})

// ✅ Good
it('should return user data when login succeeds with valid credentials', () => {})
```

### 2. Arrange-Act-Assert (AAA)
Structure tests for clarity:

```typescript
it('should update journal', async () => {
  // Arrange
  const journalId = 'journal-123'
  const updates = { content: 'Updated' }
  const mockJournal = TestDataBuilder.createJournal(updates)
  mockApi.put.mockResolvedValue(mockApiResponse(mockJournal))

  // Act
  const result = await journalService.updateJournal(journalId, updates)

  // Assert
  expect(result).toEqual(mockJournal)
})
```

### 3. Test Behavior, Not Implementation
- Test what the function does, not how it does it
- Avoid testing internal function calls unless necessary

```typescript
// ❌ Over-testing implementation
expect(logger.debug).toHaveBeenCalledWith('processing')

// ✅ Test behavior
expect(result).toEqual(expectedResult)
```

### 4. Keep Tests Focused
- One assertion per test when possible
- Use `beforeEach` for common setup
- Clear data state between tests

### 5. Mock External Dependencies
- Mock API calls
- Mock Next.js utilities (router, image)
- Mock Zustand stores when testing components

```typescript
jest.mock('@/lib/api')
jest.mock('next/navigation')
jest.mock('next/image')
```

---

## Async Testing

### With Hooks
```typescript
const { result } = renderHook(() => useAuthStore())

await act(async () => {
  await result.current.login('user@example.com', 'password')
})

expect(result.current.isAuthenticated).toBe(true)
```

### With User Events
```typescript
const user = userEvent.setup()
render(<MyComponent />)

const input = screen.getByPlaceholderText('Enter name')
await user.type(input, 'John Doe')

expect(input).toHaveValue('John Doe')
```

### With Promises
```typescript
mockApi.get.mockResolvedValue(mockApiResponse(data))
const result = await myAsyncFunction()
expect(result).toBeDefined()
```

---

## Troubleshooting

### "Cannot find module" Error
- Check path aliases in `jest.config.js`
- Ensure `@/` maps to `src/`
- Run `npm install` to install all dependencies

### "next/navigation is not mocked"
- Add mock to `src/__tests__/setup.ts`
- Already included, check jest setup file is being used

### Tests Timeout
- Increase timeout: `jest.setTimeout(15000)`
- Check for unresolved promises
- Use `waitFor` for async assertions

### "localStorage is not defined"
- Call `setupLocalStorageMock()` in your test
- Already mocked globally in setup file

### TypeScript Errors in Tests
- Ensure `@types/jest` is installed
- Check `tsconfig.json` includes test files
- Use `as jest.Mocked<typeof module>` for mocks

---

## Testing Checklist

Before committing, verify:

- [ ] All new code has corresponding tests
- [ ] All tests pass locally: `npm test`
- [ ] Coverage meets guidelines: `npm run test:coverage`
- [ ] No console errors or warnings
- [ ] Tests follow naming conventions
- [ ] Mock cleanup in `beforeEach`
- [ ] Async/await properly handled
- [ ] Test data uses TestDataBuilder
- [ ] API mocks are realistic

---

## Integration with CI/CD

### GitHub Actions
```yaml
- name: Run Frontend Tests
  run: npm run test:ci
  
- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/coverage-final.json
```

### Pre-commit Hook
```bash
# Add to .git/hooks/pre-commit
npm run test
```

---

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Zustand Testing](https://github.com/pmndrs/zustand#testing)

---

## Contributing

When adding new features:

1. Write tests first (TDD) or alongside the feature
2. Ensure all tests pass
3. Check coverage reports
4. Update this guide if new patterns emerge
5. Maintain consistency with existing tests

For questions or improvements, refer to backend [TESTING_GUIDE.md](../backend/TESTING_GUIDE.md) for additional patterns.
