'use client'

import { useAuthRedirect } from '@/hooks/useAuthRedirect'

export default function Home() {
  const { loading } = useAuthRedirect({
    redirectIfAuthenticated: true,
    redirectIfUnauthenticated: true
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return null
}
