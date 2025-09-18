import { useState } from 'react'
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
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(Schema) })

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
    <div className="min-h-screen grid place-items-center p-6 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
          {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">{error}</div>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Full name" 
                {...register('fullName')} 
              />
              {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
            </div>
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
            <div>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                {...register('role')}
              >
                <option value="student">Student</option>
                <option value="alumni">Alumni</option>
              </select>
            </div>
            <button 
              disabled={isLoading} 
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
          <div className="text-center mt-4">
            <Link to="/login" className="text-blue-600 hover:underline">Have an account? Log in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
