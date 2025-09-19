import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initAuthListener } from './features/auth/authSlice'
import type { RootState, AppDispatch } from './store/store'
import AppRoutes from './routes/AppRoutes'
import { initMessaging, onForegroundMessage, requestFcmToken } from './lib/fcm'

export default function App() {
  const dispatch = useDispatch<AppDispatch>()
  const { user, status } = useSelector((s: RootState) => s.auth)

  useEffect(() => {
    void dispatch(initAuthListener())
  }, [dispatch])

  useEffect(() => {
    (async () => {
      await initMessaging()
      const token = await requestFcmToken()
      if (token) {
        // Send token to backend or store
        console.info('FCM token', token)
      }
      onForegroundMessage((p)=>console.info('FCM message', p))
    })()
  }, [])

  if (status === 'loading') {
    return <div className="min-h-screen grid place-content-center">Loading...</div>
  }

  return <AppRoutes isAuthed={!!user} role={user?.role} />
}
