// SignUpForm: Handles user registration with email and password using the AuthContext
'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

// Props for the SignUpForm component
interface SignUpFormProps {
  onSuccess?: () => void // Called after successful sign-up
  onSwitchToSignIn?: () => void // Switches to the sign-in form
}

export default function SignUpForm({ onSuccess, onSwitchToSignIn }: SignUpFormProps) {
  // State for form fields and UI feedback
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  
  // Get the signUp function from the AuthContext
  const { signUp } = useAuth()

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    // Validate that passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    // Attempt to sign up with the provided credentials
    const { error } = await signUp(email, password)
    
    if (error) {
      // Show error message if sign-up fails
      setError(error.message)
    } else {
      // Show success message and call onSuccess callback if provided
      setMessage('Check your email for a confirmation link!')
      onSuccess?.()
    }
    
    setLoading(false)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Sign-up form */}
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

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Confirm your password"
          />
        </div>

        {/* Show error message if sign-up fails */}
        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Show success message if sign-up succeeds */}
        {message && (
          <div className="text-green-600 text-sm">
            {message}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>

        {/* Link to switch to sign-in form */}
        <div className="text-center">
          <button
            type="button"
            onClick={onSwitchToSignIn}
            className="text-indigo-600 hover:text-indigo-500 text-sm"
          >
            Already have an account? Sign in
          </button>
        </div>
      </form>
    </div>
  )
} 