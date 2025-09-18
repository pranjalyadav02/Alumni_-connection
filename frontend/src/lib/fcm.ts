import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging'
import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1234567890',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1234567890:web:abcdef',
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
