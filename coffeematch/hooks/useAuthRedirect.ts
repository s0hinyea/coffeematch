// useAuthRedirect: A custom hook that handles authentication-based redirects
// This hook uses the AuthContext to check authentication status and automatically redirect users
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

// Options for configuring the redirect behavior
interface UseAuthRedirectOptions {
  redirectTo?: string // Where to redirect unauthenticated users (defaults to '/auth')
  requireAuth?: boolean // If true, redirects unauthenticated users to redirectTo
  redirectIfAuthenticated?: boolean // If true, redirects authenticated users to '/dashboard'
  redirectIfUnauthenticated?: boolean // If true, redirects unauthenticated users to redirectTo
}

// This hook exports a function that:
// 1. Uses AuthContext to get current user and loading state
// 2. Automatically redirects based on authentication status and options
// 3. Returns user and loading state for use in components
// 4. Handles different redirect scenarios (require auth, redirect if authenticated)
export function useAuthRedirect({
  redirectTo = '/auth',
  requireAuth = false,
  redirectIfAuthenticated = false,
  redirectIfUnauthenticated = false
}: UseAuthRedirectOptions = {}) {
  // Get authentication state from AuthContext
  const { user, loading } = useAuth()
  const router = useRouter()

  // Effect to handle automatic redirects based on auth status
  useEffect(() => {
    // Only redirect if we're not loading
    if (!loading) {
      // If requireAuth is true and user is not authenticated, redirect to auth page
      if (requireAuth && !user) {
        router.push(redirectTo)
      } 
      // If redirectIfAuthenticated is true and user is authenticated, redirect to dashboard
      else if (redirectIfAuthenticated && user) {
        router.push('/dashboard')
      }
      // If redirectIfUnauthenticated is true and user is not authenticated, redirect to auth page
      else if (redirectIfUnauthenticated && !user) {
        router.push(redirectTo)
      }
    }
  }, [user, loading, router, redirectTo, requireAuth, redirectIfAuthenticated, redirectIfUnauthenticated])

  // Return user and loading state for use in components
  return { user, loading }
} 