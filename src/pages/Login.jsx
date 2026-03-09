/**
 * Login page.
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore.js'

export function Login() {
  const navigate = useNavigate()
  const { login, loading, useDemoAdmin } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Login failed. No backend connected? Use Demo Admin.')
    }
  }

  const handleDemoAdmin = () => {
    useDemoAdmin()
    navigate('/')
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Sign in</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          // <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>
          <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">Invalid email or password</div>
        )}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      {/* <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm">
        <p className="text-amber-800 mb-2">No backend? Use demo admin to see admin bar:</p>
        <button
          type="button"
          onClick={handleDemoAdmin}
          className="font-semibold text-amber-600 hover:text-amber-900 underline"
        >
          Login as Demo Admin
        </button>
      </div> */}

      <p className="mt-6 text-center text-neutral-600 text-sm">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-red-600 hover:text-red-700 font-medium">
          Register
        </Link>
      </p>
    </div>
  )
}
