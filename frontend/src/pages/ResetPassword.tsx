import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const Schema = z.object({ email: z.string().email('Invalid email address') })

type FormData = z.infer<typeof Schema>

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(Schema) })

  async function onSubmit(values: FormData) {
    setIsLoading(true)
    setError('')
    setMessage('')
    try {
      await sendPasswordResetEmail(auth, values.email)
      setMessage('Password reset email sent! Check your inbox.')
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-6 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center mb-6">Reset Password</h1>
          {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">{error}</div>}
          {message && <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded mb-4">{message}</div>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Email" 
                {...register('email')} 
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <button 
              disabled={isLoading} 
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
          <div className="text-center mt-4">
            <Link to="/login" className="text-blue-600 hover:underline">Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
