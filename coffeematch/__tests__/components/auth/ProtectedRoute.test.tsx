import React from 'react'
import { render, screen } from '@testing-library/react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

// Mock the useAuthRedirect hook
const mockUseAuthRedirect = jest.fn()
jest.mock('@/hooks/useAuthRedirect', () => ({
  useAuthRedirect: (options: any) => mockUseAuthRedirect(options),
}))

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders protected content when user is authenticated', () => {
    mockUseAuthRedirect.mockReturnValue({
      user: { id: '1', email: 'test@example.com' },
      loading: false,
    })
    
    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    )
    
    expect(screen.getByTestId('protected-content')).toBeInTheDocument()
  })

  it('does not render content when user is not authenticated', () => {
    mockUseAuthRedirect.mockReturnValue({
      user: null,
      loading: false,
    })
    
    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    )
    
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument()
  })
}) 