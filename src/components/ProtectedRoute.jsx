import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function ProtectedRoute({ children }) {
  const { isAuthenticated, authLoading } = useAuth()

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-400">
        Checking your session…
      </div>
    )
  }
  if (!isAuthenticated) return <Navigate to="/" replace />
  return children
}

export default ProtectedRoute
