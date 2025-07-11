// ProtectedRoute: A wrapper component that prevents access to protected content unless the user is authenticated
// This component uses the AuthContext to check authentication status and redirect unauthenticated users
'use client'

import { useAuthRedirect } from '@/hooks/useAuthRedirect'

// Props for the ProtectedRoute component
interface ProtectedRouteProps {
  children: React.ReactNode // The content to render if user is authenticated
  redirectTo?: string // Where to redirect unauthenticated users (defaults to '/auth')
}

// This component exports a wrapper that:
// 1. Checks if user is authenticated using AuthContext
// 2. Shows loading spinner while checking auth status
// 3. Redirects unauthenticated users to the specified route
// 4. Renders children only if user is authenticated
export default function ProtectedRoute({ 
  children, 
  redirectTo = '/auth' 
}: ProtectedRouteProps) {
  const { user, loading } = useAuthRedirect({
    requireAuth: true,
    redirectTo
  })

  // Show loading spinner while determining authentication status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div data-testid="loading-spinner" className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  // Don't render anything if user is not authenticated (will redirect)
  if (!user) {
    return null
  }

  // Render the protected content if user is authenticated
  return <>{children}</>
} 