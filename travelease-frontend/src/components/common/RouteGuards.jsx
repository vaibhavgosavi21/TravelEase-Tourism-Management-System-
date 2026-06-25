import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// Requires user to be logged in
export function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth()

  if (loading) return <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600" />
  </div>

  return isLoggedIn() ? children : <Navigate to="/login" replace />
}

// Requires user to have ROLE_ADMIN
export function AdminRoute({ children }) {
  const { isLoggedIn, isAdmin, loading } = useAuth()

  if (loading) return <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600" />
  </div>

  if (!isLoggedIn()) return <Navigate to="/login" replace />
  if (!isAdmin())    return <Navigate to="/" replace />

  return children
}
