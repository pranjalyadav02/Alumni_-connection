import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { auth, db } from '../lib/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { Link, useNavigate } from 'react-router-dom'

const Schema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['student','alumni'])
})

type FormData = z.infer<typeof Schema>

export default function Signup() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
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
    try {
      const cred = await createUserWithEmailAndPassword(auth, values.email, values.password)
      await setDoc(doc(db, 'users', cred.user.uid), { 
        displayName: values.fullName, 
        role: values.role, 
        email: values.email,
        createdAt: Date.now()
      })
      await sendEmailVerification(cred.user)
      navigate('/verify')
    } catch (err: any) {
      setError(err.message || 'Signup failed')
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Join Our Community</h1>
              <p className="text-purple-100 text-sm">
                Start your journey with the alumni network
              </p>
            </div>
            
            {/* Floating Icons */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-white/20 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-white/20 rounded-full animate-bounce animation-delay-1000"></div>
          </div>

          {/* Form Section */}
          <div className="p-8">
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
              {/* Full Name Field */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Full Name</span>
                </label>
                <input 
                  className={`w-full px-4 py-3 bg-gray-700/50 border rounded-xl backdrop-blur-sm text-white placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300
                    ${errors.fullName ? 'border-red-500/50' : 'border-gray-600/50'}
                    hover:border-gray-500/50
                  `}
                  placeholder="Enter your full name" 
                  {...register('fullName')} 
                />
                {errors.fullName && (
                  <div className="flex items-center space-x-1 text-red-400 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{errors.fullName.message}</span>
                  </div>
                )}
              </div>

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
                  placeholder="Enter your email address" 
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

              {/* Password Field */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Password</span>
                </label>
                <input 
                  className={`w-full px-4 py-3 bg-gray-700/50 border rounded-xl backdrop-blur-sm text-white placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300
                    ${errors.password ? 'border-red-500/50' : 'border-gray-600/50'}
                    hover:border-gray-500/50
                  `}
                  type="password" 
                  placeholder="Create a strong password" 
                  {...register('password')} 
                />
                {errors.password && (
                  <div className="flex items-center space-x-1 text-red-400 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{errors.password.message}</span>
                  </div>
                )}
                <p className="text-xs text-gray-400">
                  Must be at least 6 characters long
                </p>
              </div>

              {/* Role Selection */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>I am a</span>
                </label>
                <div className="relative">
                  <select 
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl backdrop-blur-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 appearance-none hover:border-gray-500/50"
                    {...register('role')}
                  >
                    <option value="student">🎓 Student</option>
                    <option value="alumni">💼 Alumni</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
                </span>
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-8 pt-6 border-t border-gray-700/50 text-center">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-purple-400 hover:text-purple-300 transition-colors duration-300 font-medium group"
                >
                  <span className="flex items-center justify-center space-x-1 group-hover:space-x-2 transition-all duration-300">
                    <span>Sign in</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
              </p>
            </div>

            {/* Benefits Section */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <h4 className="text-blue-300 text-sm font-medium mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Join our community to:
              </h4>
              <ul className="text-blue-400/80 text-xs space-y-1">
                <li className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                  <span>Connect with alumni and students</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                  <span>Discover mentorship opportunities</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                  <span>Access exclusive job postings</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}