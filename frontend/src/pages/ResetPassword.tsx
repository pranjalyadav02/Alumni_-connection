import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Schema = z.object({ email: z.string().email('Invalid email address') })

type FormData = z.infer<typeof Schema>

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ 
    resolver: zodResolver(Schema) 
  })

  useEffect(() => {
    setIsVisible(true)
  }, [])

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6 flex items-center justify-center">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      <div className={`w-full max-w-md transform transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>
        {/* Main Card */}
        <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
          {/* Header Section with Gradient */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
              <p className="text-purple-100 text-sm">
                Enter your email to receive a password reset link
              </p>
            </div>
            
            {/* Floating Icons */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-white/20 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-white/20 rounded-full animate-bounce animation-delay-1000"></div>
          </div>

          {/* Form Section */}
          <div className="p-8">
            {/* Success Message */}
            {message && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-green-300 text-sm">{message}</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-300 text-sm">{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Email Address</span>
                </label>
                <input 
                  className={`w-full px-4 py-3 bg-gray-700/50 border rounded-xl backdrop-blur-sm text-white placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300
                    ${errors.email ? 'border-red-500/50' : 'border-gray-600/50'}
                    hover:border-gray-500/50
                  `}
                  placeholder="Enter your registered email" 
                  {...register('email')} 
                />
                {errors.email && (
                  <div className="flex items-center space-x-1 text-red-400 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{errors.email.message}</span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button 
                disabled={isLoading} 
                className={`
                  w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 transform
                  bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700
                  focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-gray-800
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                  hover:scale-105 active:scale-95
                  shadow-lg hover:shadow-purple-500/25
                  relative overflow-hidden
                `}
              >
                {/* Animated Loading Spinner */}
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  </div>
                )}
                <span className={isLoading ? 'invisible' : 'visible flex items-center justify-center space-x-2'}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}</span>
                </span>
              </button>
            </form>

            {/* Back to Login */}
            <div className="mt-8 pt-6 border-t border-gray-700/50 text-center">
              <Link 
                to="/login" 
                className="text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center justify-center space-x-2 group"
              >
                <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Login</span>
              </Link>
            </div>

            {/* Help Text */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-blue-300 text-sm font-medium mb-1">What to expect</p>
                  <p className="text-blue-400/80 text-xs">
                    You'll receive an email with a link to reset your password. The link will expire in 1 hour for security reasons.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Support */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Need help?{' '}
            <a href="mailto:support@alumninetwork.com" className="text-purple-400 hover:text-purple-300 transition-colors duration-300">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}