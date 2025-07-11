import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm'

// Mock the useAuth hook
const mockResetPassword = jest.fn()
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    resetPassword: mockResetPassword,
    user: null,
    loading: false,
  }),
}))

describe('ResetPasswordForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders reset password form', () => {
    render(<ResetPasswordForm />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument()
  })

  it('handles successful password reset request', async () => {
    const user = userEvent.setup()
    const onSuccess = jest.fn()
    mockResetPassword.mockResolvedValue({ error: null })
    
    render(<ResetPasswordForm onSuccess={onSuccess} />)
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.click(screen.getByRole('button', { name: /send reset link/i }))
    
    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith('test@example.com')
      expect(onSuccess).toHaveBeenCalled()
    })
  })

  it('shows error message when reset fails', async () => {
    const user = userEvent.setup()
    mockResetPassword.mockResolvedValue({ error: { message: 'User not found' } })
    
    render(<ResetPasswordForm />)
    
    await user.type(screen.getByLabelText(/email/i), 'nonexistent@example.com')
    await user.click(screen.getByRole('button', { name: /send reset link/i }))
    
    await waitFor(() => {
      expect(screen.getByText('User not found')).toBeInTheDocument()
    })
  })
}) 