import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './Layout'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import ResetPassword from '../pages/ResetPassword'
import VerifyEmail from '../pages/VerifyEmail'
import TwoFactor from '../pages/TwoFactor'
import Dashboard from '../pages/Dashboard'
import StudentDashboard from '../pages/StudentDashboard'
import AlumniDashboard from '../pages/AlumniDashboard'
import Profile from '../pages/Profile'
import Admin from '../pages/Admin'
import AdminUsers from '../pages/AdminUsers'
import AdminReports from '../pages/AdminReports'
import Posts from '../pages/Posts'
import PostCreate from '../pages/PostCreate'
import PostEdit from '../pages/PostEdit'
import PostDetail from '../pages/PostDetail'
import Messages from '../pages/Messages'
import Notifications from '../pages/Notifications'

export default function AppRoutes(props: { isAuthed: boolean; role?: 'student' | 'alumni' | 'admin' }) {
  const { isAuthed, role } = props

  return (
    <Routes>
      {!isAuthed && (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/verify" element={<VerifyEmail />} />
          <Route path="/2fa" element={<TwoFactor />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      )}

      {isAuthed && (
        <>
          <Route element={<Layout />}> 
            <Route path="/" element={<Dashboard />} />
            {role === 'student' && <Route path="/dashboard" element={<StudentDashboard />} />}
            {role === 'alumni' && <Route path="/dashboard" element={<AlumniDashboard />} />}
            <Route path="/profile" element={<Profile />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/posts/create" element={<PostCreate />} />
            <Route path="/posts/:id/edit" element={<PostEdit />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/notifications" element={<Notifications />} />
            {role === 'admin' && (
              <>
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/reports" element={<AdminReports />} />
              </>
            )}
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  )
}
