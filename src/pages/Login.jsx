import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, ArrowRight, PieChart } from 'lucide-react'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../firebase'
import { useAuth } from '../hooks/useAuth'

const ERROR_MESSAGES = {
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/wrong-password': 'Incorrect email or password.',
  'auth/user-not-found': 'No account found with that email.',
  'auth/invalid-email': "That email address doesn't look right.",
  'auth/too-many-requests': 'Too many attempts — please wait a moment and try again.',
}

function friendlyError(err) {
  if (err?.message && !err.code) return err.message // e.g. our own "not authorized" error
  return ERROR_MESSAGES[err?.code] || 'Something went wrong. Please try again.'
}

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setNotice('')

    if (!email.trim() || !password.trim()) {
      setError('Enter both your email and password to continue.')
      return
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter a valid email address.')
      return
    }

    setSubmitting(true)
    try {
      await login(email.trim(), password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(friendlyError(err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleForgotPassword = async () => {
    setError('')
    setNotice('')
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter your email address above first, then tap "Forgot password?" again.')
      return
    }
    try {
      await sendPasswordResetEmail(auth, email.trim())
      setNotice(`Password reset email sent to ${email.trim()}.`)
    } catch (err) {
      setError(friendlyError(err))
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Branding side */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-slate-900 p-12 text-white lg:flex">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-bold text-slate-900">
            JL
          </div>
          <span className="text-lg font-bold">Job Links</span>
        </div>

        <div className="relative max-w-md">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-orange-300">
            <PieChart size={13} /> Super admin console for JobsLinks.pk
          </p>
          <h1 className="text-3xl font-bold leading-tight">
            Every company, listing, and campaign — in one place.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-300">
            Review employer registrations, publish job listings, approve subscriptions, and keep
            the whole job portal running smoothly.
          </p>
        </div>

        <p className="relative text-xs text-slate-400">
          Copyright {new Date().getFullYear()} Job Links. All rights reserved.
        </p>
      </div>

      {/* Form side */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
              JL
            </div>
            <span className="text-lg font-bold text-slate-800">Job Links</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-800">Admin sign in</h2>
          <p className="mt-1 text-sm text-slate-500">Sign in with your admin account to continue.</p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
              <div className="relative">
                <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@joblinks.pk"
                  autoComplete="email"
                  className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-medium text-indigo-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-10 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600"
              />
              Keep me signed in
            </label>

            {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p>}
            {notice && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-600">{notice}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
            >
              {submitting ? 'Signing in...' : 'Sign in'}
              {!submitting && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="mt-5 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3.5 py-3 text-xs text-slate-500">
            This panel is restricted to authorized admin accounts — access is granted directly in
            Firebase, not through self sign-up.
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
