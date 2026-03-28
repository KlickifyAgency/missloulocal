'use client'
import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Eye, LogOut, Building2, Phone, Mail, MapPin, Globe, Clock, Tag, Download, Users, Star } from 'lucide-react'

const ADMIN_PASSWORD = 'klickify2026'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [pwError, setPwError] = useState('')
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [tab, setTab] = useState('pending')
  const [copied, setCopied] = useState(false)

  function login() {
    if (password === ADMIN_PASSWORD) { setAuthed(true); setPwError('') }
    else setPwError('Incorrect password')
  }

  async function loadData() {
    setLoading(true)
    const res = await fetch('/api/admin/businesses?tab=' + tab)
    const data = await res.json()
    setItems(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { if (authed) loadData() }, [authed, tab])

  async function approve(slug: string, id?: string) {
    const key = slug || id || ''
    setActionLoading(key)
    const body = id ? { id, action: 'approve', type: 'deal' } : { slug, action: 'approve' }
    await fetch('/api/admin/businesses', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    await loadData()
    setActionLoading(null)
  }

  async function reject(slug: string, id?: string) {
    if (!confirm('Delete this listing?')) return
    const key = slug || id || ''
    setActionLoading(key)
    const body = id ? { id, action: 'reject', type: 'deal' } : { slug, action: 'reject' }
    await fetch('/api/admin/businesses', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    await loadData()
    setActionLoading(null)
  }

  function exportCSV() {
    const rows = items.filter(b => b.email)
    const csv = 'Name,Email,Phone,Category\n' + rows.map(b =>
      '"' + b.name + '","' + b.email + '","' + (b.phone || '') + '","' + (b.category_slug || '') + '"'
    ).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'missloulocal-emails.csv'
    a.click()
  }

  function copyAllEmails() {
    const emails = items.filter(b => b.email).map(b => b.email).join('\n')
    navigator.clipboard.writeText(emails).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (!authed) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f3460 0%, #16213e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '40px 32px', width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 32px 80px rgba(0,0,0,0.3)' }}>
        <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg, #0f3460, #16213e)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Building2 size={34} color='white' strokeWidth={1.8} />
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>MissLouLocal</h1>
        <p style={{ fontSize: '14px', color: '#94a3b8', margin: '0 0 32px', fontWeight: 500 }}>Admin Panel</p>
        <input type='password' value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} placeholder='Enter admin password' style={{ width: '100%', height: '54px', borderRadius: '14px', border: '2px solid #e2e8f0', padding: '0 18px', fontSize: '17px', marginBottom: '12px', boxSizing: 'border-box' as const, outline: 'none', fontFamily: 'inherit' }} />
        {pwError && <p style={{ color: '#dc2626', fontSize: '14px', margin: '0 0 12px', fontWeight: 600 }}>{pwError}</p>}
        <button onClick={login} style={{ width: '100%', height: '54px', background: 'linear-gradient(135deg, #e94560, #c73652)', borderRadius: '14px', border: 'none', color: 'white', fontSize: '17px', fontWeight: 700, cursor: 'pointer', minHeight: 0, boxShadow: '0 4px 16px rgba(233,69,96,0.35)' }}>Login</button>
      </div>
    </div>
  )

  const tabList = [
    { id: 'pending', label: 'Pending' },
    { id: 'active',  label: 'Active'  },
    { id: 'deals',   label: 'Deals'   },
    { id: 'emails',  label: 'Emails'  },
  ]

  const tabStyle = (id: string) => ({
    height: '50px',
    minHeight: 0,
    border: 'none',
    borderBottom: tab === id ? '3px solid #e94560' : '3px solid transparent',
    backgroundColor: 'transparent',
    fontSize: '14px',
    fontWeight: tab === id ? 700 : 500,
    color: tab === id ? '#e94560' : '#64748b',
    cursor: 'pointer',
    padding: '0 16px',
    whiteSpace: 'nowrap' as const,
  })

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
      <header style={{ background: 'linear-gradient(135deg, #0f3460 0%, #16213e 100%)', padding: '0 20px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', backgroundColor: '#e94560', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={20} color='white' strokeWidth={2} />
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'white', lineHeight: 1.1 }}>Admin Panel</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>MissLouLocal Directory</div>
          </div>
        </div>
        <button onClick={() => setAuthed(false)} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '8px 14px', color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', minHeight: 0 }}>
          <LogOut size={14} /> Logout
        </button>
      </header>

      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', overflowX: 'auto' as const }}>
        {tabList.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={tabStyle(t.id)}>{t.label}</button>
        ))}
      </div>

      <div style={{ padding: '16px', maxWidth: '760px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {loading && (
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <div style={{ width: '36px', height: '36px', border: '3px solid #e94560', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
            <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
            <p style={{ color: '#64748b', margin: 0 }}>Loading...</p>
          </div>
        )}

        {!loading && tab !== 'emails' && items.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <CheckCircle size={36} color='#16a34a' strokeWidth={1.5} style={{ margin: '0 auto 12px', display: 'block' }} />
            <p style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              {tab === 'pending' ? 'No pending submissions' : tab === 'deals' ? 'No pending deals' : 'No active listings'}
            </p>
          </div>
        )}

        {/* EMAIL LIST */}
        {!loading && tab === 'emails' && (
          <>
            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div>
                <p style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 2px' }}>{items.filter(b => b.email).length} emails</p>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>From business listings</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={copyAllEmails} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: copied ? '#16a34a' : '#eff6ff', border: '1px solid ' + (copied ? '#16a34a' : '#bfdbfe'), borderRadius: '10px', padding: '8px 14px', color: copied ? 'white' : '#1e40af', fontSize: '13px', fontWeight: 700, cursor: 'pointer', minHeight: 0, transition: 'all 0.2s' }}>
                  <Mail size={14} /> {copied ? 'Copied!' : 'Copy All'}
                </button>
                <button onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#0f3460', border: 'none', borderRadius: '10px', padding: '8px 14px', color: 'white', fontSize: '13px', fontWeight: 700, cursor: 'pointer', minHeight: 0 }}>
                  <Download size={14} /> Export CSV
                </button>
              </div>
            </div>
            {items.filter(b => b.email).map((biz: any) => (
              <div key={biz.id} style={{ backgroundColor: 'white', borderRadius: '14px', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                <div>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '0 0 2px' }}>{biz.name}</p>
                  <p style={{ fontSize: '13px', color: '#3b82f6', margin: '0 0 2px', fontWeight: 500 }}>{biz.email}</p>
                  {biz.phone && <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>{biz.phone}</p>}
                </div>
                <span style={{ backgroundColor: '#f1f5f9', borderRadius: '8px', padding: '4px 10px', fontSize: '11px', color: '#64748b', fontWeight: 600 }}>{(biz.category_slug || '').replace(/-/g, ' ')}</span>
              </div>
            ))}
            {items.filter(b => b.email).length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
                <Mail size={32} strokeWidth={1.5} style={{ margin: '0 auto 12px', display: 'block' }} />
                <p style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>No emails collected yet</p>
              </div>
            )}
          </>
        )}

        {/* DEALS */}
        {!loading && tab === 'deals' && items.map((deal: any) => (
          <div key={deal.id} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '2px solid #fed7aa' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#fff7ed', borderRadius: '20px', padding: '3px 10px', marginBottom: '10px' }}>
              <Clock size={11} color='#92400e' />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#92400e', textTransform: 'uppercase' as const }}>Pending Deal</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{deal.title}</h3>
              <span style={{ backgroundColor: '#fff7ed', borderRadius: '10px', padding: '4px 10px', fontSize: '13px', fontWeight: 800, color: '#ea580c' }}>{deal.discount_text}</span>
            </div>
            {deal.description && <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 10px', lineHeight: 1.5 }}>{deal.description}</p>}
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 14px' }}>Submitted: {new Date(deal.created_at).toLocaleDateString()}</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => approve('', deal.id)} disabled={actionLoading === deal.id} style={{ flex: 1, height: '46px', minHeight: 0, backgroundColor: '#16a34a', border: 'none', borderRadius: '12px', color: 'white', fontSize: '15px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <CheckCircle size={16} /> {actionLoading === deal.id ? 'Approving...' : 'Approve'}
              </button>
              <button onClick={() => reject('', deal.id)} style={{ height: '46px', minHeight: 0, backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', color: '#dc2626', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '0 18px' }}>
                <XCircle size={16} /> Reject
              </button>
            </div>
          </div>
        ))}

        {/* BUSINESSES (pending + active) */}
        {!loading && (tab === 'pending' || tab === 'active') && items.map((biz: any) => (
          <div key={biz.id} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: tab === 'pending' ? '2px solid #fbbf24' : '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
              {tab === 'pending' && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#fef3c7', borderRadius: '20px', padding: '3px 10px' }}>
                  <Clock size={11} color='#92400e' />
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#92400e', textTransform: 'uppercase' as const }}>Pending Review</span>
                </div>
              )}
              {biz.tier === 'premium' && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#fdf2f8', borderRadius: '20px', padding: '3px 10px' }}>
                  <Star size={11} color='#9d174d' fill='#9d174d' />
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#9d174d', textTransform: 'uppercase' as const }}>Premium</span>
                </div>
              )}
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: '0 0 10px' }}>{biz.name}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '14px' }}>
              {biz.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={13} color='#94a3b8' /><span style={{ fontSize: '14px', color: '#374151' }}>{biz.phone}</span></div>}
              {biz.email && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={13} color='#3b82f6' /><span style={{ fontSize: '14px', color: '#3b82f6', fontWeight: 500 }}>{biz.email}</span></div>}
              {biz.address && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={13} color='#94a3b8' /><span style={{ fontSize: '13px', color: '#64748b' }}>{biz.address}</span></div>}
              {biz.website && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Globe size={13} color='#94a3b8' /><span style={{ fontSize: '13px', color: '#64748b' }}>{biz.website}</span></div>}
              <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>Added: {new Date(biz.created_at).toLocaleDateString()}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {tab === 'pending' && (
                <button onClick={() => approve(biz.slug)} disabled={actionLoading === biz.slug} style={{ flex: 1, height: '46px', minHeight: 0, backgroundColor: '#16a34a', border: 'none', borderRadius: '12px', color: 'white', fontSize: '15px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <CheckCircle size={16} /> {actionLoading === biz.slug ? 'Approving...' : 'Approve'}
                </button>
              )}
              <button onClick={() => reject(biz.slug)} style={{ height: '46px', minHeight: 0, backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', color: '#dc2626', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '0 16px' }}>
                <XCircle size={16} /> {tab === 'active' ? 'Remove' : 'Reject'}
              </button>
              {tab === 'active' && biz.category_slug && (
                <a href={'/category/' + biz.category_slug} target='_blank' rel='noopener noreferrer' style={{ flex: 1, height: '46px', minHeight: 0, backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', color: '#1e40af', fontSize: '14px', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <Eye size={16} /> View
                </a>
              )}
            </div>
          </div>
        ))}

      </div>
    </div>
  )
}