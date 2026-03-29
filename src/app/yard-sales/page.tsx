'use client'
import { useState, useEffect } from 'react'
import { ArrowLeft, MapPin, Calendar, Clock, Plus, X, CheckCircle, Phone, Mail, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import BottomNav from '@/components/layout/BottomNav'

function PostForm({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [form, setForm] = useState({ title: '', description: '', address: '', sale_date: '', start_time: '7:00 AM', end_time: '1:00 PM', contact_name: '', contact_email: '', image_url: '' })
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState('')

  async function uploadPhoto(file: File) {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/yard-sales/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) { setForm(p => ({ ...p, image_url: data.url })); setPreview(data.url) }
    } catch(e) { console.error(e) }
    setUploading(false)
  }

  async function submit() {
    if (!form.address || !form.sale_date || !form.contact_email) { setStatus('error'); return }
    setStatus('loading')
    const res = await fetch('/api/yard-sales', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (data.success) { setStatus('success'); setTimeout(() => { onSuccess(); onClose(); }, 2000) }
    else setStatus('error')
  }

  const inp = { width: '100%', height: '52px', borderRadius: '12px', border: '1.5px solid #e2e8f0', padding: '0 16px', fontSize: '16px', outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'inherit', backgroundColor: 'white' }

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ backgroundColor: 'white', borderRadius: '24px 24px 0 0', padding: '24px 20px 40px', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto' as const }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <p style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Post a Yard Sale</p>
          <button type='button' onClick={onClose} style={{ width: '32px', height: '32px', minHeight: 0, backgroundColor: '#f1f5f9', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} color='#64748b' /></button>
        </div>
        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <CheckCircle size={40} color='#16a34a' strokeWidth={1.5} style={{ margin: '0 auto 12px', display: 'block' }} />
            <p style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>Posted!</p>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Your yard sale is now live!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} placeholder='Title (e.g. Moving Sale, Multi-Family Sale)' style={inp} />
            <input value={form.address} onChange={e => setForm(p => ({...p, address: e.target.value}))} placeholder='Full address *' style={inp} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 6px' }}>Date *</p>
                <input type='date' value={form.sale_date} onChange={e => setForm(p => ({...p, sale_date: e.target.value}))} style={inp} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 6px' }}>Start time</p>
                <input value={form.start_time} onChange={e => setForm(p => ({...p, start_time: e.target.value}))} placeholder='7:00 AM' style={inp} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 6px' }}>End time</p>
                <input value={form.end_time} onChange={e => setForm(p => ({...p, end_time: e.target.value}))} placeholder='1:00 PM' style={inp} />
              </div>
            </div>
            <textarea value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} placeholder='What are you selling? Furniture, clothes, tools...' style={{ width: '100%', minHeight: '80px', borderRadius: '12px', border: '1.5px solid #e2e8f0', padding: '12px 16px', fontSize: '16px', outline: 'none', resize: 'vertical' as const, fontFamily: 'inherit', boxSizing: 'border-box' as const }} />
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#374151', margin: '0 0 8px' }}>Photo (optional)</p>
              {preview ? (
                <div style={{ position: 'relative' }}>
                  <img src={preview} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '12px' }} alt='preview' />
                  <button type='button' onClick={() => { setPreview(''); setForm(p => ({...p, image_url: ''})) }} style={{ position: 'absolute', top: '8px', right: '8px', width: '28px', height: '28px', minHeight: 0, backgroundColor: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                </div>
              ) : (
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '52px', borderRadius: '12px', border: '2px dashed #e2e8f0', backgroundColor: '#f8fafc', cursor: 'pointer', fontSize: '14px', color: '#64748b', fontWeight: 600 }}>
                  {uploading ? 'Uploading...' : 'Add a Photo'}
                  <input type='file' accept='image/*' onChange={e => { if (e.target.files?.[0]) uploadPhoto(e.target.files[0]) }} style={{ display: 'none' }} />
                </label>
              )}
            </div>
            <div style={{ height: '1px', backgroundColor: '#f1f5f9' }} />
            <input value={form.contact_name} onChange={e => setForm(p => ({...p, contact_name: e.target.value}))} placeholder='Your name' style={inp} />
            <input value={form.contact_email} onChange={e => setForm(p => ({...p, contact_email: e.target.value}))} placeholder='Your email * (for confirmation)' type='email' style={inp} />
            {status === 'error' && <p style={{ fontSize: '13px', color: '#dc2626', backgroundColor: '#fef2f2', padding: '10px 14px', borderRadius: '10px', margin: 0 }}>Please fill in address, date and email.</p>}
            <button type='button' onClick={submit} disabled={status === 'loading'} style={{ height: '54px', minHeight: 0, backgroundColor: '#0891b2', border: 'none', borderRadius: '14px', color: 'white', fontSize: '17px', fontWeight: 700, cursor: 'pointer', width: '100%' }}>
              {status === 'loading' ? 'Posting...' : 'Post My Yard Sale — Free'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function YardSalesPage() {
  const [sales, setSales] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  async function load() {
    setLoading(true)
    const res = await fetch('/api/yard-sales')
    const data = await res.json()
    setSales(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function formatDate(d: string) {
    return new Date(d + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingBottom: '80px' }}>
      <header style={{ backgroundColor: '#0f3460', padding: '0 20px', height: '64px', display: 'flex', alignItems: 'center', gap: '16px', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href='/' style={{ width: '40px', height: '40px', minHeight: 0, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ArrowLeft size={20} color='white' strokeWidth={2} />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
          <div style={{ width: '36px', height: '36px', backgroundColor: '#0891b2', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingCart size={18} color='white' strokeWidth={2} />
          </div>
          <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'white', margin: 0 }}>Yard Sales</h1>
        </div>
        <button onClick={() => setShowForm(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#0891b2', border: 'none', borderRadius: '10px', padding: '8px 14px', color: 'white', fontSize: '13px', fontWeight: 700, cursor: 'pointer', minHeight: 0 }}>
          <Plus size={15} /> Post Sale
        </button>
      </header>

      <div style={{ backgroundColor: '#ecfeff', borderBottom: '1px solid #a5f3fc', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '14px', color: '#0891b2', fontWeight: 600 }}>{loading ? 'Loading...' : sales.length + ' upcoming sales'}</span>
        <span style={{ fontSize: '13px', color: '#64748b' }}>Natchez & Miss-Lou</span>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {loading && <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>Loading...</div>}

        {!loading && sales.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <ShoppingCart size={36} color='#0891b2' strokeWidth={1.5} style={{ margin: '0 auto 12px', display: 'block' }} />
            <p style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>No yard sales this weekend</p>
            <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 20px' }}>Be the first to post your yard sale in Natchez!</p>
            <button onClick={() => setShowForm(true)} style={{ height: '48px', minHeight: 0, backgroundColor: '#0891b2', border: 'none', borderRadius: '12px', color: 'white', fontSize: '15px', fontWeight: 700, cursor: 'pointer', padding: '0 24px' }}>Post My Sale — Free</button>
          </div>
        )}

        {sales.map(sale => (
          <div key={sale.id} style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #e0f2fe' }}>
            {sale.image_url && (
              <div style={{ position: 'relative', height: '180px', overflow: 'hidden', backgroundColor: '#000' }}>
                <img src={sale.image_url} alt='' style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(20px)', transform: 'scale(1.1)', opacity: 0.6 }} />
                <img src={sale.image_url} alt={sale.title} style={{ position: 'relative', width: '100%', height: '100%', objectFit: 'contain', zIndex: 1 }} />
              </div>
            )}
            <div style={{ padding: '14px 16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: '0 0 10px' }}>{sale.title || 'Yard Sale'}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={14} color='#0891b2' />
                  <span style={{ fontSize: '14px', color: '#0f172a', fontWeight: 600 }}>{formatDate(sale.sale_date)}</span>
                </div>
                {sale.start_time && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={14} color='#94a3b8' />
                  <span style={{ fontSize: '13px', color: '#64748b' }}>{sale.start_time}{sale.end_time ? ' — ' + sale.end_time : ''}</span>
                </div>}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={14} color='#94a3b8' />
                  <span style={{ fontSize: '13px', color: '#64748b' }}>{sale.address}</span>
                </div>
              </div>
              {sale.description && <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 12px', lineHeight: 1.5 }}>{sale.description}</p>}
              <a href={'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(sale.address)} target='_blank' rel='noopener noreferrer' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#0891b2', borderRadius: '12px', height: '46px', minHeight: 0, color: 'white', fontSize: '15px', fontWeight: 700, textDecoration: 'none', width: '100%' }}>
                <MapPin size={16} /> Take Me There
              </a>
            </div>
          </div>
        ))}

        <div style={{ backgroundColor: '#ecfeff', borderRadius: '16px', padding: '16px', border: '1px solid #a5f3fc', marginTop: '4px' }}>
          <p style={{ fontSize: '14px', fontWeight: 700, color: '#0e7490', margin: '0 0 4px' }}>Having a yard sale?</p>
          <p style={{ fontSize: '13px', color: '#0891b2', margin: '0 0 12px' }}>Post it free and let the whole Miss-Lou community know!</p>
          <button onClick={() => setShowForm(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#0891b2', border: 'none', borderRadius: '12px', height: '44px', minHeight: 0, color: 'white', fontSize: '14px', fontWeight: 700, cursor: 'pointer', width: '100%' }}>
            <Plus size={15} /> Post My Yard Sale — Free
          </button>
        </div>
      </div>

      {showForm && <PostForm onClose={() => setShowForm(false)} onSuccess={load} />}
      <div style={{ padding: '4px 20px 16px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Powered by <a href='https://klickifyagency.com' target='_blank' rel='noopener noreferrer' style={{ color: '#e94560', fontWeight: 600, textDecoration: 'none' }}>Klickify Agency</a></p>
      </div>
      <BottomNav />
    </div>
  )
}