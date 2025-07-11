// SignInForm: Handles user sign-in with email and password using the AuthContext
'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

// Props for the SignInForm component
interface SignInFormProps {
  onSuccess?: () => void // Called after successful sign-in
  onSwitchToSignUp?: () => void // Switches to the sign-up form
  onSwitchToResetPassword?: () => void // Switches to the reset password form
}

export default function SignInForm({ 
  onSuccess, 
  onSwitchToSignUp, 
  onSwitchToResetPassword 
}: SignInFormProps) {
  // State for form fields and UI feedback
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Get the signIn function from the AuthContext
  const { signIn } = useAuth()

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Attempt to sign in with the provided credentials
    const { error } = await signIn(email, password)
    
    if (error) {
      // Show error message if sign-in fails
      setError(error.message)
    } else {
      // Call onSuccess callback if provided
      onSuccess?.()
    }
    
    setLoading(false)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Sign-in form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your password"
          />
        </div>

        {/* Show error message if sign-in fails */}
        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        {/* Links to switch to sign-up or reset password forms */}
        <div className="flex justify-between text-sm">
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="text-indigo-600 hover:text-indigo-500"
          >
            Don't have an account? Sign up
          </button>
          <button
            type="button"
            onClick={onSwitchToResetPassword}
            className="text-indigo-600 hover:text-indigo-500"
          >
            Forgot password?
          </button>
        </div>
      </form>
    </div>
  )
} 