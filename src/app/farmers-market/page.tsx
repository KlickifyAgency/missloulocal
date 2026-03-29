'use client'
import { useState, useEffect } from 'react'
import { ArrowLeft, ShoppingBasket, Plus, X, CheckCircle, Phone, Mail, MapPin, Globe, Calendar } from 'lucide-react'
import Link from 'next/link'
import BottomNav from '@/components/layout/BottomNav'

function VendorForm({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [form, setForm] = useState({ vendor_name: '', description: '', products: '', market_days: '', contact_name: '', contact_email: '', contact_phone: '', website: '', image_url: '' })
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState('')

  async function uploadPhoto(file: File) {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/farmers-market/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) { setForm(p => ({ ...p, image_url: data.url })); setPreview(data.url) }
    } catch(e) { console.error(e) }
    setUploading(false)
  }

  async function submit() {
    if (!form.vendor_name || !form.contact_email) { setStatus('error'); return }
    setStatus('loading')
    const res = await fetch('/api/farmers-market', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (data.success) { setStatus('success'); setTimeout(() => { onSuccess(); onClose(); }, 2000) }
    else setStatus('error')
  }

  const inp = { width: '100%', height: '52px', borderRadius: '12px', border: '1.5px solid #e2e8f0', padding: '0 16px', fontSize: '16px', outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'inherit', backgroundColor: 'white' }

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ backgroundColor: 'white', borderRadius: '24px 24px 0 0', padding: '24px 20px 40px', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto' as const }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <p style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>List Your Vendor Booth</p>
          <button type='button' onClick={onClose} style={{ width: '32px', height: '32px', minHeight: 0, backgroundColor: '#f1f5f9', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} color='#64748b' /></button>
        </div>
        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <CheckCircle size={40} color='#16a34a' strokeWidth={1.5} style={{ margin: '0 auto 12px', display: 'block' }} />
            <p style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>Submitted!</p>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Your vendor listing will be reviewed and published within 24 hours.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input value={form.vendor_name} onChange={e => setForm(p => ({...p, vendor_name: e.target.value}))} placeholder='Vendor / Business Name *' style={inp} />
            <input value={form.products} onChange={e => setForm(p => ({...p, products: e.target.value}))} placeholder='What do you sell? (e.g. Fresh vegetables, honey, crafts)' style={inp} />
            <input value={form.market_days} onChange={e => setForm(p => ({...p, market_days: e.target.value}))} placeholder='Market days (e.g. Every Saturday 8am-12pm)' style={inp} />
            <textarea value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} placeholder='Tell us about your booth...' style={{ width: '100%', minHeight: '80px', borderRadius: '12px', border: '1.5px solid #e2e8f0', padding: '12px 16px', fontSize: '16px', outline: 'none', resize: 'vertical' as const, fontFamily: 'inherit', boxSizing: 'border-box' as const }} />
            <input value={form.website} onChange={e => setForm(p => ({...p, website: e.target.value}))} placeholder='Website or Facebook page (optional)' style={inp} />
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#374151', margin: '0 0 8px' }}>Photo of your booth (optional)</p>
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
            <input value={form.contact_phone} onChange={e => setForm(p => ({...p, contact_phone: e.target.value}))} placeholder='Phone (optional)' type='tel' style={inp} />
            {status === 'error' && <p style={{ fontSize: '13px', color: '#dc2626', backgroundColor: '#fef2f2', padding: '10px 14px', borderRadius: '10px', margin: 0 }}>Please fill in vendor name and email.</p>}
            <button type='button' onClick={submit} disabled={status === 'loading'} style={{ height: '54px', minHeight: 0, backgroundColor: '#65a30d', border: 'none', borderRadius: '14px', color: 'white', fontSize: '17px', fontWeight: 700, cursor: 'pointer', width: '100%' }}>
              {status === 'loading' ? 'Submitting...' : 'List My Booth — Free'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function FarmersMarketPage() {
  const [vendors, setVendors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  async function load() {
    setLoading(true)
    const res = await fetch('/api/farmers-market')
    const data = await res.json()
    setVendors(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingBottom: '80px' }}>
      <header style={{ backgroundColor: '#0f3460', padding: '0 20px', height: '64px', display: 'flex', alignItems: 'center', gap: '16px', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href='/' style={{ width: '40px', height: '40px', minHeight: 0, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ArrowLeft size={20} color='white' strokeWidth={2} />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
          <div style={{ width: '36px', height: '36px', backgroundColor: '#65a30d', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingBasket size={18} color='white' strokeWidth={2} />
          </div>
          <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'white', margin: 0 }}>Farmers Market</h1>
        </div>
        <button onClick={() => setShowForm(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#65a30d', border: 'none', borderRadius: '10px', padding: '8px 14px', color: 'white', fontSize: '13px', fontWeight: 700, cursor: 'pointer', minHeight: 0 }}>
          <Plus size={15} /> List Booth
        </button>
      </header>

      <div style={{ backgroundColor: '#f7fee7', borderBottom: '1px solid #d9f99d', padding: '12px 20px' }}>
        <p style={{ fontSize: '14px', color: '#3f6212', fontWeight: 600, margin: '0 0 2px' }}>Downtown Natchez Farmers Market</p>
        <p style={{ fontSize: '13px', color: '#65a30d', margin: 0 }}>Every Saturday 8:00 AM — 12:00 PM</p>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {loading && <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>Loading...</div>}

        {!loading && vendors.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <ShoppingBasket size={36} color='#65a30d' strokeWidth={1.5} style={{ margin: '0 auto 12px', display: 'block' }} />
            <p style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>No vendors listed yet</p>
            <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 20px' }}>Are you a vendor? Get your booth listed for free!</p>
            <button onClick={() => setShowForm(true)} style={{ height: '48px', minHeight: 0, backgroundColor: '#65a30d', border: 'none', borderRadius: '12px', color: 'white', fontSize: '15px', fontWeight: 700, cursor: 'pointer', padding: '0 24px' }}>List My Booth — Free</button>
          </div>
        )}

        {vendors.map(vendor => (
          <div key={vendor.id} style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #d9f99d' }}>
            {vendor.image_url && (
              <div style={{ position: 'relative', height: '180px', overflow: 'hidden', backgroundColor: '#000' }}>
                <img src={vendor.image_url} alt='' style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(20px)', transform: 'scale(1.1)', opacity: 0.6 }} />
                <img src={vendor.image_url} alt={vendor.vendor_name} style={{ position: 'relative', width: '100%', height: '100%', objectFit: 'contain', zIndex: 1 }} />
              </div>
            )}
            <div style={{ padding: '14px 16px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>{vendor.vendor_name}</h3>
              {vendor.products && <p style={{ fontSize: '14px', color: '#65a30d', fontWeight: 600, margin: '0 0 6px' }}>{vendor.products}</p>}
              {vendor.description && <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 8px', lineHeight: 1.5 }}>{vendor.description}</p>}
              {vendor.market_days && <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}><Calendar size={13} color='#65a30d' /><span style={{ fontSize: '13px', color: '#3f6212', fontWeight: 600 }}>{vendor.market_days}</span></div>}
              {vendor.contact_phone && <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}><a href={'tel:' + vendor.contact_phone} style={{ flex: 1, height: '44px', minHeight: 0, backgroundColor: '#65a30d', borderRadius: '12px', color: 'white', fontSize: '15px', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Phone size={15} />Call</a>{vendor.website && <a href={vendor.website} target='_blank' rel='noopener noreferrer' style={{ flex: 1, height: '44px', minHeight: 0, backgroundColor: '#f7fee7', border: '1px solid #d9f99d', borderRadius: '12px', color: '#3f6212', fontSize: '14px', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Globe size={14} />Website</a>}</div>}
            </div>
          </div>
        ))}

        <div style={{ backgroundColor: '#f7fee7', borderRadius: '16px', padding: '16px', border: '1px solid #d9f99d' }}>
          <p style={{ fontSize: '14px', fontWeight: 700, color: '#3f6212', margin: '0 0 4px' }}>Are you a Farmers Market vendor?</p>
          <p style={{ fontSize: '13px', color: '#65a30d', margin: '0 0 12px' }}>Get your booth listed for free and reach the whole Miss-Lou community!</p>
          <button onClick={() => setShowForm(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#65a30d', border: 'none', borderRadius: '12px', height: '44px', minHeight: 0, color: 'white', fontSize: '14px', fontWeight: 700, cursor: 'pointer', width: '100%' }}>
            <Plus size={15} /> List My Booth — Free
          </button>
        </div>
      </div>

      {showForm && <VendorForm onClose={() => setShowForm(false)} onSuccess={load} />}
      <div style={{ padding: '4px 20px 16px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Powered by <a href='https://klickifyagency.com' target='_blank' rel='noopener noreferrer' style={{ color: '#e94560', fontWeight: 600, textDecoration: 'none' }}>Klickify Agency</a></p>
      </div>
      <BottomNav />
    </div>
  )
}