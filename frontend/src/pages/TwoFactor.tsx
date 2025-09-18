import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function TwoFactor() {
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    // Simulate 2FA verification
    setTimeout(() => {
      if (code === '123456') {
        navigate('/')
      } else {
        setError('Invalid verification code')
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen grid place-items-center p-6 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center mb-6">Two-Factor Authentication</h1>
          <p className="text-gray-600 text-center mb-6">
            Enter the 6-digit code from your authenticator app
          </p>
          {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest" 
                placeholder="000000" 
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
              />
            </div>
            <button 
              disabled={isLoading || code.length !== 6} 
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
          </form>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">Demo: Use code 123456</p>
          </div>
        </div>
      </div>
    </div>
  )
}
