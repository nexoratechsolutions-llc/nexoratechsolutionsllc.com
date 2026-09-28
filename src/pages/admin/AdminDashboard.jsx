import { useState, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import BrandMark from '../../components/BrandMark'
import ThemeToggle from '../../components/ThemeToggle'
import {
  ArrowLeft,
  Mail,
  Phone,
  Clock,
  Shield,
} from '../../components/Icons'

const STATUS_OPTIONS = [
  { id: 'new', label: 'New', color: 'new' },
  { id: 'in_progress', label: 'In Progress', color: 'in_progress' },
  { id: 'contacted', label: 'Contacted', color: 'contacted' },
  { id: 'resolved', label: 'Resolved', color: 'resolved' },
  { id: 'archived', label: 'Archived', color: 'archived' },
]

export default function AdminDashboard({ user, onSignOut }) {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [toasts, setToasts] = useState([])

  // Filters & Search
  const [search, setSearch] = useState('')
  const [formCategory, setFormCategory] = useState('all') // all | medical | technical | junior
  const [statusFilter, setStatusFilter] = useState('all')
  const [starredOnly, setStarredOnly] = useState(false)
  const [sortBy, setSortBy] = useState('newest') // newest | oldest | name

  // Pagination (default 20 loads at once)
  const [pageSize, setPageSize] = useState(20)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setCurrentPage(1)
  }, [search, formCategory, statusFilter, starredOnly, sortBy, pageSize])

  // Note editing in drawer
  const [adminNote, setAdminNote] = useState('')
  const [savingNote, setSavingNote] = useState(false)

  // Change password modal
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordStatus, setPasswordStatus] = useState({ loading: false, msg: '', err: false })

  // User menu dropdown
  const [showUserMenu, setShowUserMenu] = useState(false)

  const showToast = useCallback((msg, type = 'info') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, msg, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4500)
  }, [])

  // Fetch submissions from Supabase
  const fetchSubmissions = useCallback(async (isSilent = false) => {
    if (!isSilent) setRefreshing(true)
    try {
      const { data, error } = await supabase
        .from('form_submissions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setSubmissions(data || [])
    } catch (err) {
      console.error('Error fetching submissions:', err)
      showToast('Failed to load submissions: ' + (err.message || 'Network error'), 'error')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [showToast])

  useEffect(() => {
    fetchSubmissions()

    // Setup Supabase Realtime subscription
    const channel = supabase
      .channel('admin_submissions_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'form_submissions' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newRow = payload.new
            setSubmissions((prev) => [newRow, ...prev.filter((r) => r.id !== newRow.id)])
            showToast(`New enquiry from ${newRow.name} (${newRow.form})!`, 'info')
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new
            setSubmissions((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
            setSelectedSubmission((curr) => (curr && curr.id === updated.id ? updated : curr))
          } else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old.id
            setSubmissions((prev) => prev.filter((r) => r.id !== deletedId))
            setSelectedSubmission((curr) => (curr && curr.id === deletedId ? null : curr))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchSubmissions, showToast])

  // Sync drawer note when selection changes
  useEffect(() => {
    if (selectedSubmission) {
      setAdminNote(selectedSubmission.notes || '')
    }
  }, [selectedSubmission])

  // Toggle Star
  const toggleStar = async (sub, e) => {
    if (e) e.stopPropagation()
    const nextVal = !sub.is_starred
    // Optimistic UI update
    setSubmissions((prev) =>
      prev.map((s) => (s.id === sub.id ? { ...s, is_starred: nextVal } : s))
    )
    if (selectedSubmission?.id === sub.id) {
      setSelectedSubmission((prev) => ({ ...prev, is_starred: nextVal }))
    }

    try {
      const { error } = await supabase
        .from('form_submissions')
        .update({ is_starred: nextVal })
        .eq('id', sub.id)
      if (error) throw error
    } catch (err) {
      console.error('Failed to toggle star:', err)
      showToast('Failed to update star: ' + err.message, 'error')
      fetchSubmissions(true)
    }
  }

  // Update Status
  const updateStatus = async (subId, nextStatus, e) => {
    if (e) e.stopPropagation()
    // Optimistic UI update
    setSubmissions((prev) =>
      prev.map((s) => (s.id === subId ? { ...s, status: nextStatus } : s))
    )
    if (selectedSubmission?.id === subId) {
      setSelectedSubmission((prev) => ({ ...prev, status: nextStatus }))
    }

    try {
      const { error } = await supabase
        .from('form_submissions')
        .update({ status: nextStatus, updated_at: new Date().toISOString() })
        .eq('id', subId)
      if (error) throw error
      showToast(`Status changed to ${nextStatus.replace('_', ' ')}`, 'success')
    } catch (err) {
      console.error('Failed to update status:', err)
      showToast('Status update failed: ' + err.message, 'error')
      fetchSubmissions(true)
    }
  }

  // Save Note in drawer
  const saveNote = async () => {
    if (!selectedSubmission) return
    setSavingNote(true)
    try {
      const { error } = await supabase
        .from('form_submissions')
        .update({ notes: adminNote, updated_at: new Date().toISOString() })
        .eq('id', selectedSubmission.id)
      if (error) throw error
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === selectedSubmission.id ? { ...s, notes: adminNote } : s
        )
      )
      setSelectedSubmission((prev) => ({ ...prev, notes: adminNote }))
      showToast('Admin note saved.', 'success')
    } catch (err) {
      console.error('Save note error:', err)
      showToast('Failed to save note: ' + err.message, 'error')
    } finally {
      setSavingNote(false)
    }
  }

  // Delete submission
  const deleteSubmission = async (subId, name, e) => {
    if (e) e.stopPropagation()
    const confirm = window.confirm(`Permanently delete submission from ${name}?`)
    if (!confirm) return

    try {
      const { error } = await supabase.from('form_submissions').delete().eq('id', subId)
      if (error) throw error
      setSubmissions((prev) => prev.filter((s) => s.id !== subId))
      if (selectedSubmission?.id === subId) {
        setSelectedSubmission(null)
      }
      showToast(`Submission from ${name} deleted.`, 'info')
    } catch (err) {
      console.error('Delete error:', err)
      showToast('Delete failed: ' + err.message, 'error')
    }
  }

  // Export CSV
  const exportCsv = () => {
    if (!filteredSubmissions.length) {
      showToast('No submissions to export in current filter.', 'error')
      return
    }

    const headers = [
      'ID',
      'Created At',
      'Name',
      'Email',
      'Phone',
      'Form',
      'Topic',
      'Status',
      'Starred',
      'Message',
      'Notes',
    ]

    const csvRows = [
      headers.join(','),
      ...filteredSubmissions.map((s) =>
        [
          JSON.stringify(s.id),
          JSON.stringify(s.created_at),
          JSON.stringify(s.name),
          JSON.stringify(s.email),
          JSON.stringify(s.phone || ''),
          JSON.stringify(s.form),
          JSON.stringify(s.topic || ''),
          JSON.stringify(s.status),
          JSON.stringify(s.is_starred ? 'Yes' : 'No'),
          JSON.stringify(s.message || ''),
          JSON.stringify(s.notes || ''),
        ].join(',')
      ),
    ]

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `nexora_submissions_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast(`Exported ${filteredSubmissions.length} submissions to CSV.`, 'success')
  }

  // Export JSON
  const exportJson = () => {
    if (!filteredSubmissions.length) {
      showToast('No submissions to export.', 'error')
      return
    }
    const blob = new Blob([JSON.stringify(filteredSubmissions, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `nexora_submissions_${new Date().toISOString().slice(0, 10)}.json`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast(`Exported ${filteredSubmissions.length} submissions to JSON.`, 'success')
  }

  // Change Admin Password
  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (newPassword.length < 8) {
      setPasswordStatus({ loading: false, msg: 'Password must be at least 8 characters.', err: true })
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ loading: false, msg: 'Passwords do not match.', err: true })
      return
    }

    setPasswordStatus({ loading: true, msg: '', err: false })
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      setPasswordStatus({ loading: false, msg: 'Password successfully updated!', err: false })
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => {
        setShowPasswordModal(false)
        setPasswordStatus({ loading: false, msg: '', err: false })
      }, 2000)
    } catch (err) {
      setPasswordStatus({ loading: false, msg: err.message || 'Update failed', err: true })
    }
  }

  // Filter & Sort Logic
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((item) => {
      // 1. Search filter
      if (search.trim()) {
        const q = search.toLowerCase()
        const match =
          item.name?.toLowerCase().includes(q) ||
          item.email?.toLowerCase().includes(q) ||
          item.phone?.toLowerCase().includes(q) ||
          item.topic?.toLowerCase().includes(q) ||
          item.message?.toLowerCase().includes(q) ||
          item.form?.toLowerCase().includes(q)
        if (!match) return false
      }

      // 2. Form Category Tab
      if (formCategory === 'medical') {
        if (!item.form?.toLowerCase().includes('medical')) return false
      } else if (formCategory === 'technical') {
        if (!item.form?.toLowerCase().includes('technical')) return false
      } else if (formCategory === 'junior') {
        if (!item.form?.toLowerCase().includes('junior') && !item.topic?.toLowerCase().includes('junior')) return false
      }

      // 3. Status filter
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false
      }

      // 4. Starred filter
      if (starredOnly && !item.is_starred) {
        return false
      }

      return true
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at) - new Date(a.created_at)
      } else if (sortBy === 'oldest') {
        return new Date(a.created_at) - new Date(b.created_at)
      } else if (sortBy === 'name') {
        return (a.name || '').localeCompare(b.name || '')
      }
      return 0
    })
  }, [submissions, search, formCategory, statusFilter, starredOnly, sortBy])

  // Pagination Calculations (20 per page by default)
  const totalItems = filteredSubmissions.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const activePage = Math.min(currentPage, totalPages)
  const startIndex = (activePage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)

  const paginatedSubmissions = useMemo(() => {
    return filteredSubmissions.slice(startIndex, endIndex)
  }, [filteredSubmissions, startIndex, endIndex])

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    if (activePage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages]
    }
    if (activePage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    }
    return [1, '...', activePage - 1, activePage, activePage + 1, '...', totalPages]
  }

  // KPI Calculations
  const stats = useMemo(() => {
    const total = submissions.length
    const unread = submissions.filter((s) => s.status === 'new').length
    const inProgress = submissions.filter((s) => s.status === 'in_progress').length
    const contacted = submissions.filter((s) => s.status === 'contacted' || s.status === 'resolved').length
    const starred = submissions.filter((s) => s.is_starred).length

    return { total, unread, inProgress, contacted, starred }
  }, [submissions])

  const formatDate = (isoString) => {
    if (!isoString) return '—'
    const date = new Date(isoString)
    const now = new Date()
    const diffMs = now - date
    const diffHours = diffMs / (1000 * 60 * 60)

    if (diffHours < 1) {
      const diffMins = Math.max(1, Math.round(diffMs / (1000 * 60)))
      return `${diffMins}m ago`
    }
    if (diffHours < 24) {
      return `${Math.round(diffHours)}h ago`
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    })
  }

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text)
    showToast(`Copied ${label} to clipboard.`, 'info')
  }

  return (
    <div className="admin-root">
      {/* Toast notifications */}
      <div className="admin-toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`admin-toast ${t.type}`}>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="admin-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link to="/" className="admin-brand" title="Nexora Home">
            <BrandMark size={32} ring={true} />
            <div className="admin-brand-text">
              <span className="admin-brand-title">Nexora Admin</span>
              <span className="admin-brand-sub">Submissions Center</span>
            </div>
          </Link>
          <div className="admin-live-badge" title="Supabase Realtime WebSocket Connected">
            <span className="admin-live-pulse" />
            <span>Live Sync</span>
          </div>
        </div>

        <div className="admin-header-actions">
          <button
            type="button"
            className="admin-btn"
            onClick={() => fetchSubmissions()}
            disabled={refreshing}
            title="Refresh submissions"
          >
            <Clock size={15} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <ThemeToggle />

          <div style={{ position: 'relative' }}>
            <button
              type="button"
              className="admin-user-pill"
              onClick={() => setShowUserMenu(!showUserMenu)}
              title="Administrator Options"
            >
              <div className="admin-avatar">A</div>
              <span>{user?.email || 'admin@nexora'}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {showUserMenu && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-s)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '6px',
                  minWidth: '180px',
                  zIndex: 50,
                }}
              >
                <button
                  type="button"
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 12px',
                    fontSize: '13px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--ink)',
                    cursor: 'pointer',
                    borderRadius: '4px',
                  }}
                  onClick={() => {
                    setShowUserMenu(false)
                    setShowPasswordModal(true)
                  }}
                >
                  Change Password
                </button>
                <div style={{ height: '1px', background: 'var(--line)', margin: '4px 0' }} />
                <button
                  type="button"
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 12px',
                    fontSize: '13px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--danger)',
                    cursor: 'pointer',
                    borderRadius: '4px',
                  }}
                  onClick={() => {
                    setShowUserMenu(false)
                    onSignOut()
                  }}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="admin-main">
        {/* Title & Toolbar */}
        <div className="admin-title-row">
          <div>
            <h1 className="admin-page-heading">Form Submissions</h1>
            <p className="admin-page-desc">
              Real-time directory of inbound inquiries from Nexora TechSolutions &amp; Medical Education.
            </p>
          </div>

          <div className="admin-toolbar-btns">
            <button type="button" className="admin-btn" onClick={exportCsv} title="Download CSV">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Export CSV</span>
            </button>
            <button type="button" className="admin-btn" onClick={exportJson} title="Download JSON">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="admin-kpi-grid">
          <div className="admin-kpi-card">
            <div className="admin-kpi-header">
              <span className="admin-kpi-label">Total Submissions</span>
              <div className="admin-kpi-icon blue">
                <Mail size={16} />
              </div>
            </div>
            <div className="admin-kpi-val">{stats.total}</div>
            <div className="admin-kpi-sub">All-time received</div>
          </div>

          <div className="admin-kpi-card" style={{ borderColor: stats.unread > 0 ? 'var(--accent)' : 'var(--line)' }}>
            <div className="admin-kpi-header">
              <span className="admin-kpi-label">New / Unread</span>
              <div className="admin-kpi-icon orange">
                <Clock size={16} />
              </div>
            </div>
            <div className="admin-kpi-val" style={{ color: stats.unread > 0 ? 'var(--accent)' : 'inherit' }}>
              {stats.unread}
            </div>
            <div className="admin-kpi-sub">Awaiting initial action</div>
          </div>

          <div className="admin-kpi-card">
            <div className="admin-kpi-header">
              <span className="admin-kpi-label">In Progress</span>
              <div className="admin-kpi-icon purple">
                <Shield size={16} />
              </div>
            </div>
            <div className="admin-kpi-val">{stats.inProgress}</div>
            <div className="admin-kpi-sub">Active follow-ups</div>
          </div>

          <div className="admin-kpi-card">
            <div className="admin-kpi-header">
              <span className="admin-kpi-label">Contacted / Resolved</span>
              <div className="admin-kpi-icon green">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
            <div className="admin-kpi-val">{stats.contacted}</div>
            <div className="admin-kpi-sub">Completed engagements</div>
          </div>

          <div className="admin-kpi-card">
            <div className="admin-kpi-header">
              <span className="admin-kpi-label">Starred Enquiries</span>
              <div className="admin-kpi-icon gold">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
            </div>
            <div className="admin-kpi-val">{stats.starred}</div>
            <div className="admin-kpi-sub">Marked as priority</div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="admin-filter-card">
          <div className="admin-filter-left">
            {/* Search Input */}
            <div className="admin-search-wrap">
              <div className="admin-search-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <input
                type="text"
                className="admin-search-input"
                placeholder="Search name, email, phone, topic, message..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  type="button"
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--ink-faint)',
                  }}
                  onClick={() => setSearch('')}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category tabs */}
            <div className="admin-filter-tabs">
              <button
                type="button"
                className={`admin-filter-tab ${formCategory === 'all' ? 'active' : ''}`}
                onClick={() => setFormCategory('all')}
              >
                <span>All Forms</span>
                <span className="admin-tab-count">{submissions.length}</span>
              </button>
              <button
                type="button"
                className={`admin-filter-tab ${formCategory === 'medical' ? 'active' : ''}`}
                onClick={() => setFormCategory('medical')}
              >
                <span>Medical</span>
                <span className="admin-tab-count">
                  {submissions.filter((s) => s.form?.toLowerCase().includes('medical')).length}
                </span>
              </button>
              <button
                type="button"
                className={`admin-filter-tab ${formCategory === 'technical' ? 'active' : ''}`}
                onClick={() => setFormCategory('technical')}
              >
                <span>Technical</span>
                <span className="admin-tab-count">
                  {submissions.filter((s) => s.form?.toLowerCase().includes('technical')).length}
                </span>
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Status Filter */}
            <select
              className="admin-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="new">New only</option>
              <option value="in_progress">In Progress</option>
              <option value="contacted">Contacted</option>
              <option value="resolved">Resolved</option>
              <option value="archived">Archived</option>
            </select>

            {/* Sort Filter */}
            <select
              className="admin-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name A-Z</option>
            </select>

            {/* Starred Toggle */}
            <button
              type="button"
              className={`admin-btn ${starredOnly ? 'primary' : ''}`}
              onClick={() => setStarredOnly(!starredOnly)}
              title="Show only starred submissions"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill={starredOnly ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span>Starred</span>
            </button>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="admin-table-container">
          {loading ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--ink-soft)' }}>
              <div style={{ marginBottom: '12px', fontSize: '15px' }}>Loading submissions from Supabase...</div>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="admin-empty-state">
              <div className="admin-empty-icon">📫</div>
              <h3 className="admin-empty-title">No submissions match your filters</h3>
              <p style={{ margin: 0, fontSize: '14px' }}>
                {search || statusFilter !== 'all' || formCategory !== 'all' || starredOnly
                  ? 'Try clearing some search terms or resetting filters.'
                  : 'New submissions from your website forms will appear here automatically.'}
              </p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '40px', textAlign: 'center' }}>★</th>
                  <th>Contact</th>
                  <th>Form / Service</th>
                  <th>Topic &amp; Message</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th style={{ width: '80px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSubmissions.map((sub) => {
                  const isNew = sub.status === 'new'
                  const isMed = sub.form?.toLowerCase().includes('medical')
                  return (
                    <tr
                      key={sub.id}
                      className={`${sub.is_starred ? 'is-starred' : ''} ${isNew ? 'is-new' : ''}`}
                      onClick={() => setSelectedSubmission(sub)}
                    >
                      {/* Star */}
                      <td style={{ textAlign: 'center' }} onClick={(e) => toggleStar(sub, e)}>
                        <button
                          type="button"
                          className={`star-btn ${sub.is_starred ? 'starred' : ''}`}
                          title={sub.is_starred ? 'Remove star' : 'Star this submission'}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill={sub.is_starred ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        </button>
                      </td>

                      {/* Contact cell */}
                      <td className="col-name">
                        <div className="user-cell">
                          <span className="user-name">{sub.name}</span>
                          <span className="user-email">{sub.email}</span>
                        </div>
                      </td>

                      {/* Form category badge */}
                      <td>
                        <span className={`badge-form ${isMed ? 'medical' : 'technical'}`}>
                          {sub.form}
                        </span>
                      </td>

                      {/* Topic & message snippet */}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--ink)' }}>
                            {sub.topic || 'General Inquiry'}
                          </span>
                          <span className="msg-snippet">{sub.message}</span>
                        </div>
                      </td>

                      {/* Phone */}
                      <td>
                        <span style={{ fontSize: '12px', color: sub.phone ? 'var(--ink)' : 'var(--ink-faint)' }}>
                          {sub.phone || '—'}
                        </span>
                      </td>

                      {/* Status Dropdown */}
                      <td onClick={(e) => e.stopPropagation()}>
                        <select
                          className="admin-select"
                          style={{ height: '30px', padding: '0 24px 0 8px', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}
                          value={sub.status}
                          onChange={(e) => updateStatus(sub.id, e.target.value)}
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Date */}
                      <td style={{ whiteSpace: 'nowrap', fontSize: '12px', color: 'var(--ink-soft)' }}>
                        {formatDate(sub.created_at)}
                      </td>

                      {/* Actions */}
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="row-actions" style={{ justifyContent: 'flex-end' }}>
                          <a
                            href={`mailto:${sub.email}?subject=${encodeURIComponent(
                              `Re: ${sub.form} - ${sub.topic || 'Nexora Inquiry'}`
                            )}&body=${encodeURIComponent(
                              `Dear ${sub.name},\n\nThank you for reaching out to Nexora.\n\nBest regards,\nNexora Team`
                            )}`}
                            className="icon-btn"
                            title="Reply via email"
                          >
                            <Mail size={15} />
                          </a>
                          <button
                            type="button"
                            className="icon-btn danger"
                            onClick={(e) => deleteSubmission(sub.id, sub.name, e)}
                            title="Delete submission"
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}

          {/* Pagination Controls Bar */}
          {!loading && totalItems > 0 && (
            <div className="admin-pagination-bar">
              <div className="admin-pagination-info">
                <div className="admin-pagination-count">
                  Showing <strong>{startIndex + 1}</strong>–<strong>{endIndex}</strong> of{' '}
                  <strong>{totalItems}</strong> submissions
                </div>
                <div className="admin-page-size-wrap">
                  <span>Show:</span>
                  <select
                    className="admin-page-size-select"
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value))
                      setCurrentPage(1)
                    }}
                  >
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                    <option value={50}>50 per page</option>
                    <option value={100}>100 per page</option>
                  </select>
                </div>
              </div>

              {totalPages > 1 && (
                <div className="admin-pagination-controls">
                  <button
                    type="button"
                    className="admin-page-btn"
                    onClick={() => setCurrentPage(1)}
                    disabled={activePage === 1}
                    title="First page"
                  >
                    «
                  </button>
                  <button
                    type="button"
                    className="admin-page-btn"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={activePage === 1}
                    title="Previous page"
                  >
                    ‹
                  </button>

                  {getPageNumbers().map((num, idx) =>
                    num === '...' ? (
                      <span key={`ellipsis-${idx}`} className="admin-page-ellipsis">
                        …
                      </span>
                    ) : (
                      <button
                        key={num}
                        type="button"
                        className={`admin-page-btn ${activePage === num ? 'active' : ''}`}
                        onClick={() => setCurrentPage(num)}
                      >
                        {num}
                      </button>
                    )
                  )}

                  <button
                    type="button"
                    className="admin-page-btn"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={activePage === totalPages}
                    title="Next page"
                  >
                    ›
                  </button>
                  <button
                    type="button"
                    className="admin-page-btn"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={activePage === totalPages}
                    title="Last page"
                  >
                    »
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Detail Slideout Drawer */}
      {selectedSubmission && (
        <div className="admin-drawer-backdrop" onClick={() => setSelectedSubmission(null)}>
          <div className="admin-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <span style={{ fontSize: '11px', color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Submission Details
                </span>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>
                  ID: {selectedSubmission.id.slice(0, 8)}...
                </div>
              </div>
              <button
                type="button"
                className="drawer-close-btn"
                onClick={() => setSelectedSubmission(null)}
                title="Close drawer"
              >
                ✕
              </button>
            </div>

            <div className="drawer-content">
              {/* Client Info Card */}
              <div className="drawer-client-card">
                <div className="client-name-row">
                  <h2 className="client-name">{selectedSubmission.name}</h2>
                  <button
                    type="button"
                    className={`star-btn ${selectedSubmission.is_starred ? 'starred' : ''}`}
                    onClick={() => toggleStar(selectedSubmission)}
                    title={selectedSubmission.is_starred ? 'Starred' : 'Click to star'}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill={selectedSubmission.is_starred ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </button>
                </div>

                <div className="client-contact-row">
                  <a href={`mailto:${selectedSubmission.email}`} className="client-link">
                    <Mail size={15} />
                    <span>{selectedSubmission.email}</span>
                  </a>
                  {selectedSubmission.phone && (
                    <a href={`tel:${selectedSubmission.phone}`} className="client-link">
                      <Phone size={15} />
                      <span>{selectedSubmission.phone}</span>
                    </a>
                  )}
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', color: 'var(--ink-soft)', cursor: 'pointer', fontSize: '12px' }}
                    onClick={() => copyToClipboard(selectedSubmission.email, 'Email address')}
                  >
                    (Copy Email)
                  </button>
                </div>
              </div>

              {/* Status Selector */}
              <div className="drawer-section-title">Change Status</div>
              <div className="status-select-wrap">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`status-opt-btn ${selectedSubmission.status === opt.id ? 'active' : ''}`}
                    onClick={() => updateStatus(selectedSubmission.id, opt.id)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Form Topic & Page */}
              <div className="drawer-meta-grid">
                <div className="drawer-meta-item">
                  <span className="drawer-meta-label">Form Type</span>
                  <span className="drawer-meta-value">{selectedSubmission.form}</span>
                </div>
                <div className="drawer-meta-item">
                  <span className="drawer-meta-label">Topic</span>
                  <span className="drawer-meta-value">{selectedSubmission.topic || 'General'}</span>
                </div>
                <div className="drawer-meta-item">
                  <span className="drawer-meta-label">Source Page</span>
                  <span className="drawer-meta-value">{selectedSubmission.page || 'Direct'}</span>
                </div>
                <div className="drawer-meta-item">
                  <span className="drawer-meta-label">Submitted On</span>
                  <span className="drawer-meta-value">
                    {new Date(selectedSubmission.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Message Box */}
              <div className="drawer-section-title">Message Body</div>
              <div className="drawer-msg-box">{selectedSubmission.message}</div>

              {/* Admin Notes */}
              <div className="drawer-section-title">Internal Team Notes</div>
              <textarea
                className="notes-textarea"
                placeholder="Write private notes about this client, follow-up calls, action items..."
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
              />
              <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="admin-btn primary"
                  onClick={saveNote}
                  disabled={savingNote}
                >
                  {savingNote ? 'Saving...' : 'Save Notes'}
                </button>
              </div>

              {/* Technical info */}
              <div className="drawer-section-title" style={{ marginTop: '24px' }}>System Diagnostics</div>
              <div style={{ fontSize: '12px', color: 'var(--ink-soft)', background: 'var(--bg-deep)', padding: '12px', borderRadius: '6px' }}>
                <div>Client IP: <code>{selectedSubmission.ip || 'Unknown'}</code></div>
                <div style={{ marginTop: '4px' }}>Submission Ref: <code>{selectedSubmission.submission_id || 'N/A'}</code></div>
              </div>
            </div>

            <div className="drawer-footer">
              <button
                type="button"
                className="admin-btn"
                style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
                onClick={(e) => deleteSubmission(selectedSubmission.id, selectedSubmission.name, e)}
              >
                Delete Inbound
              </button>

              <a
                href={`mailto:${selectedSubmission.email}?subject=${encodeURIComponent(
                  `Re: ${selectedSubmission.form} - ${selectedSubmission.topic || 'Nexora Inquiry'}`
                )}&body=${encodeURIComponent(
                  `Dear ${selectedSubmission.name},\n\nThank you for reaching out to Nexora.\n\nBest regards,\nNexora Team`
                )}`}
                className="admin-btn primary"
              >
                <Mail size={16} />
                <span>Compose Reply</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 150,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setShowPasswordModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '400px',
              background: 'var(--surface)',
              borderRadius: 'var(--radius-s)',
              padding: '28px',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--line)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 8px', fontFamily: 'var(--font-display)', fontSize: '20px' }}>
              Change Admin Password
            </h3>
            <p style={{ margin: '0 0 20px', fontSize: '13px', color: 'var(--ink-soft)' }}>
              Set a new secure password for <code>{user?.email}</code>.
            </p>

            {passwordStatus.msg && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  marginBottom: '16px',
                  background: passwordStatus.err ? 'rgba(158,59,34,0.1)' : 'var(--accent2-soft)',
                  color: passwordStatus.err ? 'var(--danger)' : 'var(--accent2)',
                }}
              >
                {passwordStatus.msg}
              </div>
            )}

            <form onSubmit={handleChangePassword}>
              <div className="admin-form-group">
                <label className="admin-form-label">New Password (min 8 chars)</label>
                <input
                  type="password"
                  className="admin-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="admin-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  className="admin-btn"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn primary"
                  disabled={passwordStatus.loading}
                >
                  {passwordStatus.loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
