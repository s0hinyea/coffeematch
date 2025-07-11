// This file provides authentication context and logic for the entire app using Supabase.
'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

// Define the shape of the authentication context
interface AuthContextType {
  user: User | null // The current authenticated user, or null if not signed in
  session: Session | null // The current session object, or null if not signed in
  loading: boolean // Whether the auth state is being determined
  signUp: (email: string, password: string) => Promise<{ error: any }> // Function to sign up a new user
  signIn: (email: string, password: string) => Promise<{ error: any }> // Function to sign in an existing user
  signOut: () => Promise<void> // Function to sign out the current user
  resetPassword: (email: string) => Promise<{ error: any }> // Function to send a password reset email
}

// Create the context with an undefined default value
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// The AuthProvider wraps the app and provides authentication state and actions
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // State for the current user, session, and loading status
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // On mount, get the current session from Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Subscribe to auth state changes (sign in, sign out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe()
  }, [])

  // Sign up a new user with email and password
  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { error }
  }

  // Sign in an existing user with email and password
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  // Sign out the current user
  const signOut = async () => {
    await supabase.auth.signOut()
  }

  // Send a password reset email to the user
  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // The redirect URL after the user clicks the reset link in their email
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    return { error }
  }

  // The value provided to all consumers of the context
  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  }

  // Provide the context to all children
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to access the authentication context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 