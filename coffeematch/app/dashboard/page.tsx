import ProtectedRoute from '@/components/auth/ProtectedRoute'
import UserProfile from '@/components/auth/UserProfile'

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Dashboard
            </h1>
            
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <UserProfile />
              
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Welcome to Coffee Match!
                </h2>
                <p className="text-gray-600">
                  This is your protected dashboard. You can only see this page if you're authenticated.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 