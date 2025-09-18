import { sendEmailVerification, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function VerifyEmail() {
  const [email, setEmail] = useState<string | null>(null)
  const [verified, setVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u)=>{
      setEmail(u?.email ?? null)
      setVerified(!!u?.emailVerified)
      if (u?.emailVerified) {
        setTimeout(() => navigate('/'), 2000)
      }
    })
    return () => unsub()
  }, [navigate])

  async function resend() {
    if (!auth.currentUser) return
    setIsLoading(true)
    setMessage('')
    try {
      await sendEmailVerification(auth.currentUser)
      setMessage('Verification email sent!')
    } catch (err: any) {
      setMessage('Failed to send verification email')
    } finally {
      setIsLoading(false)
    }
  }

  if (verified) {
    return (
      <div className="min-h-screen grid place-items-center p-6 bg-gray-50">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-green-600 text-6xl mb-4"></div>
          <h1 className="text-2xl font-bold mb-4">Email Verified!</h1>
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen grid place-items-center p-6 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-6">Verify Your Email</h1>
          <p className="text-gray-600 mb-6">
            We sent a verification link to <strong>{email || 'your email'}</strong>.
            Please check your inbox and click the link to verify your account.
          </p>
          {message && <div className="bg-blue-50 border border-blue-200 text-blue-600 px-4 py-3 rounded mb-4">{message}</div>}
          <button 
            onClick={resend} 
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Sending...' : 'Resend Verification Email'}
          </button>
        </div>
      </div>
    </div>
  )
}
