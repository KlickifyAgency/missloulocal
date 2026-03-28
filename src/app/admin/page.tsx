'use client'
import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Eye, LogOut, Building2, Phone, Mail, MapPin, Globe, Clock } from 'lucide-react'

const ADMIN_PASSWORD = 'klickify2026'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [businesses, setBusinesses] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [tab, setTab] = useState<'pending'|'active'|'deals'>('pending')

  function login() {
    if (password === ADMIN_PASSWORD) { setAuthed(true); setError('') }
    else setError('Incorrect password')
  }

  async function loadBusinesses() {
    setLoading(true)
    const res = await fetch('/api/admin/businesses?tab=' + tab)
    const data = await res.json()
    setBusinesses(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { if (authed) loadBusinesses() }, [authed, tab])

  async function approve(slug: string, id?: string) {
    setActionLoading(slug || id || '')
    const body = id ? { id, action: 'approve', type: 'deal' } : { slug, action: 'approve' }
    await fetch('/api/admin/businesses', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    await loadBusinesses()
    setActionLoading(null)
  }

  async function reject(slug: string, id?: string) {
    if (!confirm('Delete this listing?')) return
    setActionLoading(slug || id || '')
    const body = id ? { id, action: 'reject', type: 'deal' } : { slug, action: 'reject' }
    await fetch('/api/admin/businesses', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    await loadBusinesses()
    setActionLoading(null)
  }

  if (!authed) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f3460', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '40px 32px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', backgroundColor: '#e94560', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Building2 size={32} color='white' strokeWidth={1.8} />
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>MissLouLocal</h1>
        <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 28px' }}>Admin Panel</p>
        <input
          type='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()}
          placeholder='Enter admin password'
          style={{ width: '100%', height: '52px', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '0 16px', fontSize: '17px', marginBottom: '12px', boxSizing: 'border-box' as const, outline: 'none' }}
        />
        {error && <p style={{ color: '#dc2626', fontSize: '14px', margin: '0 0 12px' }}>{error}</p>}
        <button onClick={login} style={{ width: '100%', height: '52px', backgroundColor: '#0f3460', borderRadius: '12px', border: 'none', color: 'white', fontSize: '17px', fontWeight: 700, cursor: 'pointer', minHeight: 0 }}>Login</button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <header style={{ backgroundColor: '#0f3460', padding: '0 20px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', backgroundColor: '#e94560', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={18} color='white' strokeWidth={2} />
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'white', lineHeight: 1 }}>Admin Panel</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>MissLouLocal</div>
          </div>
        </div>
        <button onClick={() => setAuthed(false)} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '10px', padding: '8px 12px', color: 'white', fontSize: '13px', fontWeight: 600, cursor: 'pointer', minHeight: 0 }}>
          <LogOut size={14} /> Logout
        </button>
      </header>

      <div style={{ display: 'flex', backgroundColor: 'white', borderBottom: '1px solid #f1f5f9' }}>
        {(['pending', 'active', 'deals'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, height: '48px', minHeight: 0, border: 'none', borderBottom: tab === t ? '3px solid #e94560' : '3px solid transparent', backgroundColor: 'transparent', fontSize: '14px', fontWeight: 700, color: tab === t ? '#e94560' : '#64748b', cursor: 'pointer', textTransform: 'capitalize' }}>
            t === 'pending' ? 'Pending Approval' : t === 'active' ? 'Active Listings' : 'Pending Deals'
          </button>
        ))}
      </div>

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '800px', margin: '0 auto' }}>
        {loading && <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading...</div>}

        {!loading && businesses.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <CheckCircle size={32} color='#16a34a' strokeWidth={1.5} />
            <p style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '16px 0 8px' }}>{tab === 'pending' ? 'No pending submissions' : 'No active listings'}</p>
          </div>
        )}

        {tab === 'deals' && businesses.map((deal: any) => (
          <div key={deal.id} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '2px solid #fed7aa' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#fff7ed', borderRadius: '20px', padding: '3px 10px', marginBottom: '10px' }}>
              <Clock size={11} color='#92400e' />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#92400e' }}>PENDING DEAL</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{deal.title}</h3>
              <span style={{ backgroundColor: '#fff7ed', borderRadius: '10px', padding: '4px 10px', fontSize: '13px', fontWeight: 800, color: '#ea580c' }}>{deal.discount_text}</span>
            </div>
            {deal.description && <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 10px', lineHeight: 1.5 }}>{deal.description}</p>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '14px' }}>
              {deal.businesses?.name && <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>Business: {deal.businesses.name}</span>}
              {deal.expires_at && <span style={{ fontSize: '13px', color: '#94a3b8' }}>Expires: {new Date(deal.expires_at).toLocaleDateString()}</span>}
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>Submitted: {new Date(deal.created_at).toLocaleDateString()}</span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => approve('', deal.id)} disabled={actionLoading === deal.id} style={{ flex: 1, height: '48px', minHeight: 0, backgroundColor: '#16a34a', border: 'none', borderRadius: '12px', color: 'white', fontSize: '15px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <CheckCircle size={18} /> {actionLoading === deal.id ? 'Approving...' : 'Approve Deal'}
              </button>
              <button onClick={() => reject('', deal.id)} disabled={actionLoading === deal.id} style={{ height: '48px', minHeight: 0, backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', color: '#dc2626', fontSize: '15px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0 20px' }}>
                <XCircle size={18} /> Reject
              </button>
            </div>
          </div>
        ))}

        {tab !== 'deals' && businesses.map((biz: any) => (
          <div key={biz.id} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: biz.is_active ? '1px solid #f1f5f9' : '2px solid #fbbf24' }}>
            {!biz.is_active && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#fef3c7', borderRadius: '20px', padding: '3px 10px', marginBottom: '10px' }}>
                <Clock size={11} color='#92400e' />
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#92400e' }}>PENDING REVIEW</span>
              </div>
            )}
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 10px' }}>{biz.name}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
              {biz.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={14} color='#64748b' /><span style={{ fontSize: '14px', color: '#374151' }}>{biz.phone}</span></div>}
              {biz.email && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={14} color='#64748b' /><span style={{ fontSize: '14px', color: '#374151' }}>{biz.email}</span></div>}
              {biz.address && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={14} color='#64748b' /><span style={{ fontSize: '14px', color: '#374151' }}>{biz.address}</span></div>}
              {biz.website && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Globe size={14} color='#64748b' /><span style={{ fontSize: '14px', color: '#374151' }}>{biz.website}</span></div>}
              {biz.description && <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0', lineHeight: 1.5 }}>{biz.description}</p>}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Building2 size={14} color='#64748b' /><span style={{ fontSize: '13px', color: '#94a3b8' }}>Submitted: {new Date(biz.created_at).toLocaleDateString()}</span></div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {!biz.is_active && (
                <button onClick={() => approve(biz.slug)} disabled={actionLoading === biz.slug} style={{ flex: 1, height: '48px', minHeight: 0, backgroundColor: '#16a34a', border: 'none', borderRadius: '12px', color: 'white', fontSize: '15px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <CheckCircle size={18} /> {actionLoading === biz.slug ? 'Approving...' : 'Approve'}
                </button>
              )}
              <button onClick={() => reject(biz.slug)} disabled={actionLoading === biz.slug} style={{ flex: biz.is_active ? 1 : 0, height: '48px', minHeight: 0, backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', color: '#dc2626', fontSize: '15px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '0 20px' }}>
                <XCircle size={18} /> {biz.is_active ? 'Remove' : 'Reject'}
              </button>
              {biz.is_active && (
                <a href={'/category/' + biz.category_slug} target='_blank' rel='noopener noreferrer' style={{ flex: 1, height: '48px', minHeight: 0, backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', color: '#1e40af', fontSize: '15px', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Eye size={18} /> View
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}