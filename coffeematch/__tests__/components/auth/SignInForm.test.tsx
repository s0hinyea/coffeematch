import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SignInForm from '@/components/auth/SignInForm'

// Mock the useAuth hook
const mockSignIn = jest.fn()
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    signIn: mockSignIn,
    user: null,
    loading: false,
  }),
}))

describe('SignInForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders sign in form', () => {
    render(<SignInForm />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('handles successful sign in', async () => {
    const user = userEvent.setup()
    const onSuccess = jest.fn()
    mockSignIn.mockResolvedValue({ error: null })
    
    render(<SignInForm onSuccess={onSuccess} />)
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123')
      expect(onSuccess).toHaveBeenCalled()
    })
  })

  it('shows error message when sign in fails', async () => {
    const user = userEvent.setup()
    mockSignIn.mockResolvedValue({ error: { message: 'Invalid credentials' } })
    
    render(<SignInForm />)
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })
  })
}) 