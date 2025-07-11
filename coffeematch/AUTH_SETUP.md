# Authentication Setup Guide

This project includes a complete authentication system built with Supabase. Follow these steps to set it up:

## 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once your project is created, go to Settings > API
3. Copy your project URL and anon key

## 2. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace `your_supabase_project_url` and `your_supabase_anon_key` with the values from your Supabase project.

## 3. Supabase Authentication Settings

In your Supabase dashboard:

1. Go to Authentication > Settings
2. Configure your site URL (e.g., `http://localhost:3000` for development)
3. Add redirect URLs:
   - `http://localhost:3000/auth/reset-password` (for password reset)
   - `http://localhost:3000/auth` (for general auth)

## 4. Features Included

### Authentication Components
- **SignInForm**: Email/password sign in
- **SignUpForm**: Email/password registration with confirmation
- **ResetPasswordForm**: Password reset via email
- **UserProfile**: Display user info and logout
- **ProtectedRoute**: Route protection for authenticated users

### Context Manager
- **AuthContext**: Provides authentication state and methods throughout the app
- Automatic session management
- Real-time auth state updates

### Pages
- `/auth`: Main authentication page with form switching
- `/auth/reset-password`: Password reset page
- `/dashboard`: Protected dashboard example
- `/`: Automatic redirect based on auth status

## 5. Usage

### Using the Auth Context
```tsx
import { useAuth } from '@/contexts/AuthContext'

function MyComponent() {
  const { user, signIn, signOut } = useAuth()
  
  if (user) {
    return <div>Welcome, {user.email}!</div>
  }
  
  return <div>Please sign in</div>
}
```

### Protecting Routes
```tsx
import ProtectedRoute from '@/components/auth/ProtectedRoute'

export default function MyProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This content is only visible to authenticated users</div>
    </ProtectedRoute>
  )
}
```

## 6. Running the Project

1. Install dependencies: `npm install`
2. Set up environment variables
3. Run the development server: `npm run dev`
4. Visit `http://localhost:3000`

The app will automatically redirect unauthenticated users to `/auth` and authenticated users to `/dashboard`.

## 7. Customization

- Modify the styling by updating the Tailwind classes in the components
- Add additional user fields in the sign-up form
- Extend the AuthContext with additional methods as needed
- Customize the redirect behavior in the main page component 