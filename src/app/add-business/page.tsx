'use client'
import { useState } from 'react'
import { ArrowLeft, Building2, Phone, Mail, MapPin, Globe, CheckCircle, Send } from 'lucide-react'
import Link from 'next/link'
import BottomNav from '@/components/layout/BottomNav'

const categories = [
  { name: 'Restaurants & Food',   slug: 'restaurants-food' },
  { name: 'Medical & Health',     slug: 'medical-health' },
  { name: 'Home Services',        slug: 'home-services' },
  { name: 'Auto Services',        slug: 'auto-services' },
  { name: 'Shopping & Retail',    slug: 'shopping-retail' },
  { name: 'Personal Care',        slug: 'personal-care' },
  { name: 'Legal & Financial',    slug: 'legal-financial' },
  { name: 'Real Estate & Hotels', slug: 'real-estate-hotels' },
  { name: 'Medical Specialists',  slug: 'medical-specialists' },
  { name: 'Churches & Faith',     slug: 'churches-faith' },
  { name: 'Arts & Education',     slug: 'arts-education' },
  { name: 'Tours & Attractions',  slug: 'tours-attractions' },
  { name: 'Pet Services',         slug: 'pet-services' },
  { name: 'Walking Downtown',     slug: 'walking-downtown' },
]

export default function AddBusinessPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', category_slug: '', website: '', description: '', service_area_only: false })
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')
  const [error, setError] = useState('')

  function update(field: string, value: any) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function submit() {
    if (!form.name || !form.phone || !form.category_slug) {
      setError('Please fill in business name, phone and category.')
      return
    }
    setStatus('loading')
    setError('')
    try {
      const res = await fetch('/api/submit-business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.success) setStatus('success')
      else { setError(data.error || 'Something went wrong.'); setStatus('error') }
    } catch(e) {
      setError('Connection error. Please try again.')
      setStatus('error')
    }
  }

  const inputStyle = { width: '100%', height: '56px', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '0 16px', fontSize: '17px', backgroundColor: 'white', outline: 'none', boxSizing: 'border-box' as const }
  const labelStyle = { fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'block' }

  if (status === 'success') return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingBottom: '80px' }}>
      <header style={{ backgroundColor: '#0f3460', padding: '0 20px', height: '64px', display: 'flex', alignItems: 'center', gap: '16px', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href='/' style={{ width: '40px', height: '40px', minHeight: 0, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ArrowLeft size={20} color='white' strokeWidth={2} />
        </Link>
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'white', margin: 0 }}>Add My Business</h1>
      </header>
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ width: '72px', height: '72px', backgroundColor: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <CheckCircle size={36} color='#16a34a' strokeWidth={1.5} />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>Submitted!</h2>
        <p style={{ fontSize: '16px', color: '#64748b', margin: '0 0 8px', lineHeight: 1.6 }}>Thank you for submitting your business. We will review it and add it to the directory within 24 hours.</p>
        <p style={{ fontSize: '14px', color: '#94a3b8', margin: '0 0 32px' }}>Questions? Email us at <a href='mailto:support@klickifyagency.com' style={{ color: '#0f3460', fontWeight: 600 }}>support@klickifyagency.com</a></p>
        <Link href='/' style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f3460', borderRadius: '14px', height: '52px', minHeight: 0, color: 'white', fontSize: '16px', fontWeight: 700, textDecoration: 'none', padding: '0 32px' }}>Back to Home</Link>
      </div>
      <BottomNav />
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingBottom: '80px' }}>
      <header style={{ backgroundColor: '#0f3460', padding: '0 20px', height: '64px', display: 'flex', alignItems: 'center', gap: '16px', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href='/' style={{ width: '40px', height: '40px', minHeight: 0, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ArrowLeft size={20} color='white' strokeWidth={2} />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', backgroundColor: '#e94560', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={18} color='white' strokeWidth={2} />
          </div>
          <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'white', margin: 0 }}>Add My Business</h1>
        </div>
      </header>

      <div style={{ backgroundColor: '#eff6ff', borderBottom: '1px solid #bfdbfe', padding: '14px 20px' }}>
        <p style={{ fontSize: '14px', color: '#1e40af', margin: 0, lineHeight: 1.5 }}>Get your business listed in the Miss-Lou directory — completely free. We will review and publish within 24 hours.</p>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        <div>
          <label style={labelStyle}>Business Name *</label>
          <div style={{ position: 'relative' }}>
            <Building2 size={18} color='#94a3b8' style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input value={form.name} onChange={e => update('name', e.target.value)} placeholder='e.g. Joes Plumbing' style={{ ...inputStyle, paddingLeft: '44px' }} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Category *</label>
          <select value={form.category_slug} onChange={e => update('category_slug', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
            <option value=''>Select a category...</option>
            {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Phone Number *</label>
          <div style={{ position: 'relative' }}>
            <Phone size={18} color='#94a3b8' style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input value={form.phone} onChange={e => update('phone', e.target.value)} placeholder='601-000-0000' type='tel' style={{ ...inputStyle, paddingLeft: '44px' }} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Email Address</label>
          <div style={{ position: 'relative' }}>
            <Mail size={18} color='#94a3b8' style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input value={form.email} onChange={e => update('email', e.target.value)} placeholder='your@email.com' type='email' style={{ ...inputStyle, paddingLeft: '44px' }} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Website</label>
          <div style={{ position: 'relative' }}>
            <Globe size={18} color='#94a3b8' style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input value={form.website} onChange={e => update('website', e.target.value)} placeholder='www.yourbusiness.com' style={{ ...inputStyle, paddingLeft: '44px' }} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Short Description</label>
          <textarea value={form.description} onChange={e => update('description', e.target.value)} placeholder='Tell us what your business does in a few words...' style={{ width: '100%', minHeight: '100px', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '14px 16px', fontSize: '16px', backgroundColor: 'white', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', backgroundColor: 'white', borderRadius: '14px', padding: '16px', border: '1px solid #e2e8f0' }}>
            <input type='checkbox' checked={form.service_area_only} onChange={e => update('service_area_only', e.target.checked)} style={{ width: '22px', height: '22px', marginTop: '2px', flexShrink: 0, cursor: 'pointer' }} />
            <div>
              <p style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>We come to you</p>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Check this if you are a mobile service (plumber, tree service, cleaning, etc.) and do not have a physical storefront.</p>
            </div>
          </div>
        </div>

        {!form.service_area_only && (
          <div>
            <label style={labelStyle}>Business Address</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={18} color='#94a3b8' style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input value={form.address} onChange={e => update('address', e.target.value)} placeholder='123 Main St, Natchez, MS 39120' style={{ ...inputStyle, paddingLeft: '44px' }} />
            </div>
          </div>
        )}

        {error && <p style={{ fontSize: '14px', color: '#dc2626', backgroundColor: '#fef2f2', padding: '12px 16px', borderRadius: '12px', margin: 0 }}>{error}</p>}

        <button onClick={submit} disabled={status === 'loading'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', backgroundColor: status === 'loading' ? '#94a3b8' : '#0f3460', borderRadius: '16px', height: '60px', minHeight: 0, color: 'white', fontSize: '18px', fontWeight: 700, border: 'none', cursor: status === 'loading' ? 'not-allowed' : 'pointer', width: '100%', boxShadow: '0 4px 16px rgba(15,52,96,0.25)' }}>
          {status === 'loading' ? 'Submitting...' : <><Send size={20} strokeWidth={2} />Submit My Business</>}
        </button>

        <p style={{ fontSize: '13px', color: '#94a3b8', textAlign: 'center', margin: 0 }}>By submitting you agree to be listed in the MissLouLocal directory. Questions? <a href='mailto:support@klickifyagency.com' style={{ color: '#0f3460', fontWeight: 600 }}>support@klickifyagency.com</a></p>
      </div>

      <div style={{ padding: '4px 20px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: '12px', color: '#94a3b8' }}>Powered by <a href='https://klickifyagency.com' target='_blank' rel='noopener noreferrer' style={{ color: '#e94560', fontWeight: 600, textDecoration: 'none' }}>Klickify Agency</a></div>
      </div>
      <BottomNav />
    </div>
  )
}