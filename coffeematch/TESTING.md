# Testing Guide

This guide explains how to run and understand the unit tests for the Coffee Match authentication system.

## Quick Start

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage Report
```bash
npm run test:coverage
```

## Test Structure

The tests are organized in the `__tests__` directory, mirroring the source code structure:

```
__tests__/
├── components/
│   └── auth/
│       ├── SignInForm.test.tsx
│       ├── SignUpForm.test.tsx
│       ├── ResetPasswordForm.test.tsx
│       └── ProtectedRoute.test.tsx
├── hooks/
│   └── useAuthRedirect.test.ts
└── contexts/
    └── AuthContext.test.tsx
```

## What Each Test Covers

### 1. SignInForm Tests (`SignInForm.test.tsx`)
- ✅ Renders sign in form
- ✅ Handles successful sign-in
- ✅ Shows error messages on failed sign-in

### 2. SignUpForm Tests (`SignUpForm.test.tsx`)
- ✅ Renders sign up form
- ✅ Handles successful sign-up
- ✅ Shows error when passwords don't match

### 3. ResetPasswordForm Tests (`ResetPasswordForm.test.tsx`)
- ✅ Renders reset password form
- ✅ Handles successful password reset request
- ✅ Shows error message when reset fails

### 4. ProtectedRoute Tests (`ProtectedRoute.test.tsx`)
- ✅ Renders protected content when user is authenticated
- ✅ Does not render content when user is not authenticated

### 5. useAuthRedirect Hook Tests (`useAuthRedirect.test.ts`)
- ✅ Redirects unauthenticated users when `requireAuth` is true
- ✅ Redirects authenticated users when `redirectIfAuthenticated` is true

### 6. AuthContext Tests (`AuthContext.test.tsx`)
- ✅ Provides user state when session exists
- ✅ Calls Supabase methods correctly

## Test Philosophy

These tests follow the **80/20 rule** - they test the 20% of functionality that covers 80% of the critical paths:

- **Form submissions** - The core user interactions
- **Error handling** - What happens when things go wrong
- **Authentication state** - Whether users can access protected content
- **Redirects** - Navigation based on auth status

We intentionally skip testing:
- Loading states (UI polish)
- Edge cases (rare scenarios)
- Validation details (browser handles this)
- Complex user interactions (integration tests would be better)

## Test Configuration

### Jest Configuration (`jest.config.js`)
- Uses Next.js Jest configuration
- Sets up JSDOM environment for React testing
- Configures module path mapping (`@/` → root directory)
- Sets up coverage collection for components, hooks, and contexts

### Jest Setup (`jest.setup.js`)
- Imports testing-library matchers
- Mocks Next.js router functions
- Mocks Supabase client

## Testing Patterns Used

### 1. Simple Component Testing
```typescript
// Render and test basic functionality
render(<Component />)
expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
```

### 2. User Interaction Testing
```typescript
const user = userEvent.setup()
await user.type(screen.getByLabelText(/email/i), 'test@example.com')
await user.click(screen.getByRole('button', { name: /sign in/i }))
```

### 3. Mocking
```typescript
// Mock external dependencies
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ signIn: mockSignIn, user: null, loading: false }),
}))
```

### 4. Async Testing
```typescript
await waitFor(() => {
  expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123')
})
```

## Coverage Report

When you run `npm run test:coverage`, you'll get a detailed report showing:

- **Statements**: Percentage of code statements executed
- **Branches**: Percentage of conditional branches executed
- **Functions**: Percentage of functions called
- **Lines**: Percentage of lines executed

## Best Practices

### 1. Test User Behavior, Not Implementation
```typescript
// ✅ Good: Test what user sees and does
expect(screen.getByText('Invalid credentials')).toBeInTheDocument()

// ❌ Bad: Test internal state
expect(component.state.error).toBe('Invalid credentials')
```

### 2. Keep Tests Simple and Focused
```typescript
// ✅ Good: One clear test per scenario
it('handles successful sign in', async () => {

// ❌ Bad: Testing multiple things in one test
it('handles form submission, validation, and error states', async () => {
```

### 3. Mock External Dependencies
```typescript
// Always mock Supabase, router, and other external services
jest.mock('@/lib/supabase', () => ({ supabase: { auth: { signIn: jest.fn() } } }))
```

## Troubleshooting

### Common Issues

1. **Test fails with "Cannot find module"**
   - Check that the import path is correct
   - Ensure the file exists in the expected location

2. **Async test timing out**
   - Use `waitFor()` for async operations
   - Increase timeout if needed: `jest.setTimeout(10000)`

3. **Mock not working**
   - Ensure mocks are set up before the component renders
   - Check that the mock function name matches exactly

### Debugging Tests

Add `console.log` statements or use the debugger:

```typescript
it('debug test', () => {
  const { debug } = render(<Component />)
  debug() // Prints the rendered HTML
})
```

## Adding New Tests

When adding new components or features:

1. **Focus on critical functionality only**
2. **Test user interactions, not implementation details**
3. **Mock external dependencies**
4. **Keep tests simple and readable**

## Test Commands Reference

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests once |
| `npm run test:watch` | Run tests in watch mode (re-runs on file changes) |
| `npm run test:coverage` | Run tests with coverage report |
| `npm test -- --testNamePattern="SignIn"` | Run tests matching pattern |
| `npm test -- --verbose` | Run tests with verbose output | 