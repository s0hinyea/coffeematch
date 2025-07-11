import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SignUpForm from '@/components/auth/SignUpForm'

// Mock the useAuth hook
const mockSignUp = jest.fn()
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    signUp: mockSignUp,
    user: null,
    loading: false,
  }),
}))

describe('SignUpForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders sign up form', () => {
    render(<SignUpForm />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
  })

  it('handles successful sign up', async () => {
    const user = userEvent.setup()
    const onSuccess = jest.fn()
    mockSignUp.mockResolvedValue({ error: null })
    
    render(<SignUpForm onSuccess={onSuccess} />)
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.type(screen.getByLabelText(/confirm password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /sign up/i }))
    
    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith('test@example.com', 'password123')
      expect(onSuccess).toHaveBeenCalled()
    })
  })

  it('shows error when passwords do not match', async () => {
    const user = userEvent.setup()
    
    render(<SignUpForm />)
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.type(screen.getByLabelText(/confirm password/i), 'differentpassword')
    await user.click(screen.getByRole('button', { name: /sign up/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    })
  })
}) 