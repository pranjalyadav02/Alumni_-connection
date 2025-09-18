import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

const Schema = z.object({ 
  email: z.string().email('Invalid email address'), 
  password: z.string().min(1, 'Password is required') 
})

type FormData = z.infer<typeof Schema>

export default function Login() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(Schema) })

  async function onSubmit(values: FormData) {
    setIsLoading(true)
    setError('')
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password)
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-6 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
          {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">{error}</div>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Email" 
                {...register('email')} 
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <input 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                type="password" 
                placeholder="Password" 
                {...register('password')} 
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
            <button 
              disabled={isLoading} 
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          <div className="flex justify-between text-sm mt-4">
            <Link to="/reset" className="text-blue-600 hover:underline">Forgot Password?</Link>
            <Link to="/signup" className="text-blue-600 hover:underline">Create Account</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
