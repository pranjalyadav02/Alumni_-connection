import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging'
import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBi3d71upXq0544FEPVmCYjgJTYiby7RLo',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'student-alumni-platform-46a98.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'student-alumni-platform-46a98',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'student-alumni-platform-46a98.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '533433370288',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:533433370288:web:0ed5e9805dfebbdae09d75',
}

let messaging: ReturnType<typeof getMessaging> | null = null

export async function initMessaging() {
  if (!(await isSupported())) return null
  const app = initializeApp(firebaseConfig)
  messaging = getMessaging(app)
  return messaging
}

export async function requestFcmToken(): Promise<string | null> {
  if (!messaging) await initMessaging()
  if (!messaging) return null
  try {
    const token = await getToken(messaging, { vapidKey: 'demo-vapid-key' })
    return token
  } catch (e) {
    return null
  }
}

export function onForegroundMessage(cb: (payload: any) => void) {
  if (!messaging) return () => {}
  return onMessage(messaging, cb)
}
