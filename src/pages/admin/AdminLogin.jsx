import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import BrandMark from '../../components/BrandMark'
import ThemeToggle from '../../components/ThemeToggle'
import Turnstile, { TURNSTILE_SITE_KEY } from '../../components/Turnstile'
import { ArrowLeft, Shield } from '../../components/Icons'

export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('admin@nexoratechsolutionsllc.com')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const turnstileRef = useRef(null)

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!email.trim() || !password.trim()) {
      setError('Please enter both your email address and password.')
      return
    }

    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setError('Please complete the Cloudflare security verification.')
      return
    }

    setLoading(true)
    setError('')

    // 1. Verify Turnstile token with backend endpoint
    if (TURNSTILE_SITE_KEY && turnstileToken) {
      try {
        const vRes = await fetch('/api/verify-turnstile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: turnstileToken, action: 'admin-login' }),
        })
        const vData = await vRes.json()
        if (!vData.ok) {
          turnstileRef.current?.reset()
          setTurnstileToken(null)
          setError(vData.error || 'Cloudflare security verification failed. Please try again.')
          setLoading(false)
          return
        }
      } catch (vErr) {
        console.warn('[admin-login] Turnstile verify fetch warning:', vErr)
        // If running in an environment without serverless routes, fall through to Supabase auth
      }
    }

    // 2. Authenticate with Supabase Auth
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      })

      if (authError) {
        throw authError
      }

      if (data?.session && onLoginSuccess) {
        onLoginSuccess(data.session.user)
      }
    } catch (err) {
      console.error('Login error:', err)
      turnstileRef.current?.reset()
      setTurnstileToken(null)
      setError(
        err.message === 'Invalid login credentials'
          ? 'Invalid email or password. Please verify your credentials.'
          : err.message || 'Authentication failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-topbar">
        <Link to="/" className="admin-back-link" title="Return to Nexora Website">
          <ArrowLeft size={16} />
          <span>Back to Site</span>
        </Link>
        <ThemeToggle />
      </div>

      <div className="admin-login-card">
        {/* Polished, centered brand header */}
        <div className="admin-login-header">
          <div className="admin-login-logo-wrap" title="Nexora Operations">
            <BrandMark size={34} ring={false} />
          </div>
          <div className="admin-login-badge">
            <span className="admin-login-badge-dot" />
            <span>Internal Operations</span>
          </div>
          <h1 className="admin-login-title">Admin Portal</h1>
          <p className="admin-login-subtitle">
            Secure management console for form submissions &amp; client enquiries.
          </p>
        </div>

        {error && (
          <div className="admin-login-alert error" role="alert">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} noValidate>
          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="admin-email">
              Administrator Email
            </label>
            <div className="admin-input-wrap">
              <input
                id="admin-email"
                type="email"
                className="admin-input"
                autoComplete="email"
                placeholder="name@nexoratechsolutionsllc.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="admin-password">
              Password
            </label>
            <div className="admin-input-wrap">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                className="admin-input"
                autoComplete="current-password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="admin-pw-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Cloudflare Turnstile bot verification */}
          {TURNSTILE_SITE_KEY && (
            <div className="admin-turnstile-wrap">
              <Turnstile
                ref={turnstileRef}
                action="admin-login"
                onToken={(tok) => {
                  setTurnstileToken(tok)
                  if (error && error.includes('security')) setError('')
                }}
                onError={(errCode) => {
                  console.warn('[admin-login] Turnstile load error:', errCode)
                  setTurnstileToken(null)
                }}
              />
            </div>
          )}

          <button
            type="submit"
            className="admin-login-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <Shield size={18} />
                <span>Sign In to Dashboard</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  )
}
