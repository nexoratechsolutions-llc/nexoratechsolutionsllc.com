import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'
import BrandMark from '../../components/BrandMark'
import '../../styles/admin.css'

export default function AdminPage() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Get initial session
    let mounted = true
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setSession(session)
        setLoading(false)
      }
    })

    // 2. Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      setSession(null)
    } catch (err) {
      console.error('Sign out error:', err)
    }
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg)',
          color: 'var(--ink)',
          gap: '16px',
        }}
      >
        <BrandMark size={44} ring={true} />
        <div style={{ fontSize: '14px', color: 'var(--ink-soft)' }}>
          Verifying administrator credentials...
        </div>
      </div>
    )
  }

  if (!session) {
    return <AdminLogin onLoginSuccess={(u) => setSession({ user: u })} />
  }

  return <AdminDashboard user={session.user} onSignOut={handleSignOut} />
}
