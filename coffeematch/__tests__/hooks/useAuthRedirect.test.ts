import { renderHook } from '@testing-library/react'
import { useAuthRedirect } from '@/hooks/useAuthRedirect'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

// Mock the dependencies
const mockPush = jest.fn()
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}))

describe('useAuthRedirect', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    } as any)
  })

  it('redirects unauthenticated users when requireAuth is true', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      session: null,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      resetPassword: jest.fn(),
    })

    renderHook(() => useAuthRedirect({ requireAuth: true }))

    expect(mockPush).toHaveBeenCalledWith('/auth')
  })

  it('redirects authenticated users when redirectIfAuthenticated is true', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@example.com' },
      loading: false,
      session: null,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      resetPassword: jest.fn(),
    })

    renderHook(() => useAuthRedirect({ redirectIfAuthenticated: true }))

    expect(mockPush).toHaveBeenCalledWith('/dashboard')
  })
}) 