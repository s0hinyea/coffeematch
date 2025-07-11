import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } }
      })),
    },
  },
}))

const mockSupabase = supabase as jest.Mocked<typeof supabase>

// Test component to access context
const TestComponent = () => {
  const { user, signIn, signUp, signOut } = useAuth()
  
  return (
    <div>
      <div data-testid="user">{user ? user.email : 'no user'}</div>
      <button onClick={() => signIn('test@example.com', 'password')}>Sign In</button>
      <button onClick={() => signUp('test@example.com', 'password')}>Sign Up</button>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('provides user state when session exists', async () => {
    const mockUser = { id: '1', email: 'test@example.com' }
    const mockSession = { user: mockUser }
    
    mockSupabase.auth.getSession.mockResolvedValue({ 
      data: { session: mockSession }, 
      error: null 
    })
    
    render(<AuthProvider><TestComponent /></AuthProvider>)
    
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('test@example.com')
    })
  })

  it('calls Supabase methods correctly', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({ data: { session: null }, error: null })
    mockSupabase.auth.signInWithPassword.mockResolvedValue({ data: { user: null, session: null }, error: null })
    
    render(<AuthProvider><TestComponent /></AuthProvider>)
    
    await waitFor(() => {
      screen.getByText('Sign In').click()
    })
    
    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    })
  })
}) 