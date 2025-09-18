import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

export function ProtectedRoute({ isAuthed, children }: { isAuthed: boolean; children: ReactNode }) {
  if (!isAuthed) return <Navigate to="/login" replace />
  return <>{children}</>
}

export function RoleGuard({ role, allow, children }: { role?: 'student' | 'alumni' | 'admin'; allow: Array<'student'|'alumni'|'admin'>; children: ReactNode }) {
  if (!role || !allow.includes(role)) return <Navigate to="/" replace />
  return <>{children}</>
}
