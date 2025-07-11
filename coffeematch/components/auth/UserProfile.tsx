// UserProfile: Displays current user information and provides logout functionality
// This component uses the AuthContext to access user data and the signOut function
'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

// This component exports a user profile display that:
// 1. Shows user information (email, ID, join date) from AuthContext
// 2. Provides a logout button that uses AuthContext's signOut function
// 3. Redirects to auth page after logout
// 4. Renders nothing if no user is authenticated
export default function UserProfile() {
  // Get user data and signOut function from AuthContext
  const { user, signOut } = useAuth()
  const router = useRouter()

  // Handle logout process
  const handleSignOut = async () => {
    // Call the signOut function from AuthContext
    await signOut()
    // Redirect to auth page after successful logout
    router.push('/auth')
  }

  // Don't render anything if no user is authenticated
  if (!user) {
    return null
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center space-x-4">
        {/* User avatar with first letter of email */}
        <div className="flex-shrink-0">
          <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center">
            <span className="text-white font-medium text-lg">
              {user.email?.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
        
        {/* User information display */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {user.email}
          </p>
          <p className="text-sm text-gray-500">
            User ID: {user.id}
          </p>
          {/* Show join date if available */}
          {user.created_at && (
            <p className="text-sm text-gray-500">
              Member since: {new Date(user.created_at).toLocaleDateString()}
            </p>
          )}
        </div>
        
        {/* Logout button */}
        <div>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
} 