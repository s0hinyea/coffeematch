'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import SignInForm from '@/components/auth/SignInForm'
import SignUpForm from '@/components/auth/SignUpForm'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm'
import { useAuthRedirect } from '@/hooks/useAuthRedirect'

type AuthMode = 'signin' | 'signup' | 'reset'

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('signin')
  useAuthRedirect({ redirectIfAuthenticated: true })
  const router = useRouter()

  const handleSuccess = () => {
    if (mode === 'signin') {
      router.push('/dashboard')
    }
  }

  const renderForm = () => {
    switch (mode) {
      case 'signin':
        return (
          <SignInForm
            onSuccess={handleSuccess}
            onSwitchToSignUp={() => setMode('signup')}
            onSwitchToResetPassword={() => setMode('reset')}
          />
        )
      case 'signup':
        return (
          <SignUpForm
            onSuccess={handleSuccess}
            onSwitchToSignIn={() => setMode('signin')}
          />
        )
      case 'reset':
        return (
          <ResetPasswordForm
            onSuccess={handleSuccess}
            onSwitchToSignIn={() => setMode('signin')}
          />
        )
      default:
        return null
    }
  }

  const getTitle = () => {
    switch (mode) {
      case 'signin':
        return 'Sign In'
      case 'signup':
        return 'Create Account'
      case 'reset':
        return 'Reset Password'
      default:
        return 'Authentication'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {getTitle()}
          </h2>
        </div>
        {renderForm()}
      </div>
    </div>
  )
} 