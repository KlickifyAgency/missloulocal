'use client'
import { useState } from 'react'
import { ArrowLeft, Tag, Phone, Mail, Gift, CheckCircle, Send, Building2 } from 'lucide-react'
import Link from 'next/link'
import BottomNav from '@/components/layout/BottomNav'

export default function SubmitDealPage() {
  const [form, setForm] = useState({ business_name: '', business_phone: '', business_email: '', deal_title: '', deal_description: '', discount_text: '', expires_days: '30' })
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')
  const [error, setError] = useState('')

  function update(field: string, value: string) { setForm(prev => ({ ...prev, [field]: value })) }

  async function submit() {
    if (!form.business_name || !form.deal_title || !form.discount_text) {
      setError('Please fill in your business name, deal title and discount.'); return
    }
    setStatus('loading'); setError('')
    try {
      const res = await fetch('/api/submit-deal', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.success) setStatus('success')
      else { setError(data.error || 'Something went wrong.'); setStatus('error') }
    } catch(e) { setError('Connection error. Please try again.'); setStatus('error') }
  }

  const inputStyle = { width: '100%', height: '56px', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '0 16px', fontSize: '17px', backgroundColor: 'white', outline: 'none', boxSizing: 'border-box' as const }
  const labelStyle = { fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'block' }

  if (status === 'success') return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingBottom: '80px' }}>
      <header style={{ backgroundColor: '#0f3460', padding: '0 20px', height: '64px', display: 'flex', alignItems: 'center', gap: '16px', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href='/' style={{ width: '40px', height: '40px', minHeight: 0, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ArrowLeft size={20} color='white' strokeWidth={2} />
        </Link>
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'white', margin: 0 }}>Submit a Deal</h1>
      </header>
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ width: '72px', height: '72px', backgroundColor: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <CheckCircle size={36} color='#16a34a' strokeWidth={1.5} />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>Deal Submitted!</h2>
        <p style={{ fontSize: '16px', color: '#64748b', margin: '0 0 8px', lineHeight: 1.6 }}>Thank you! We will review your deal and publish it within 24 hours. We may contact you to confirm the details.</p>
        <p style={{ fontSize: '14px', color: '#94a3b8', margin: '0 0 32px' }}>Questions? <a href='mailto:support@klickifyagency.com' style={{ color: '#0f3460', fontWeight: 600 }}>support@klickifyagency.com</a></p>
        <Link href='/deals' style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ea580c', borderRadius: '14px', height: '52px', minHeight: 0, color: 'white', fontSize: '16px', fontWeight: 700, textDecoration: 'none', padding: '0 32px' }}>See Today's Deals</Link>
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
          <div style={{ width: '36px', height: '36px', backgroundColor: '#ea580c', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Tag size={18} color='white' strokeWidth={2} />
          </div>
          <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'white', margin: 0 }}>Submit a Deal</h1>
        </div>
      </header>

      <div style={{ backgroundColor: '#fff7ed', borderBottom: '1px solid #fed7aa', padding: '14px 20px' }}>
        <p style={{ fontSize: '14px', color: '#9a3412', margin: 0, lineHeight: 1.5 }}>Promote your business with a special offer. We will review and publish within 24 hours — completely free!</p>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ backgroundColor: '#fff7ed', borderRadius: '16px', padding: '16px', border: '1px solid #fed7aa' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, color: '#9a3412', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Your Business Info</p>
        </div>

        <div>
          <label style={labelStyle}>Business Name *</label>
          <div style={{ position: 'relative' }}>
            <Building2 size={18} color='#94a3b8' style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input value={form.business_name} onChange={e => update('business_name', e.target.value)} placeholder='Your business name' style={{ ...inputStyle, paddingLeft: '44px' }} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Phone Number</label>
          <div style={{ position: 'relative' }}>
            <Phone size={18} color='#94a3b8' style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input value={form.business_phone} onChange={e => update('business_phone', e.target.value)} placeholder='601-000-0000' type='tel' style={{ ...inputStyle, paddingLeft: '44px' }} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Email Address</label>
          <div style={{ position: 'relative' }}>
            <Mail size={18} color='#94a3b8' style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input value={form.business_email} onChange={e => update('business_email', e.target.value)} placeholder='your@email.com' type='email' style={{ ...inputStyle, paddingLeft: '44px' }} />
          </div>
        </div>

        <div style={{ backgroundColor: '#fff7ed', borderRadius: '16px', padding: '16px', border: '1px solid #fed7aa' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, color: '#9a3412', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Your Deal Details</p>
        </div>

        <div>
          <label style={labelStyle}>Deal Title *</label>
          <div style={{ position: 'relative' }}>
            <Gift size={18} color='#94a3b8' style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input value={form.deal_title} onChange={e => update('deal_title', e.target.value)} placeholder='e.g. 10% Off Your First Visit' style={{ ...inputStyle, paddingLeft: '44px' }} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Discount Text *</label>
          <div style={{ position: 'relative' }}>
            <Tag size={18} color='#94a3b8' style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input value={form.discount_text} onChange={e => update('discount_text', e.target.value)} placeholder='e.g. 10% OFF or BOGO FREE or FREE CLASS' style={{ ...inputStyle, paddingLeft: '44px' }} />
          </div>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0' }}>This appears as the badge on your deal card.</p>
        </div>

        <div>
          <label style={labelStyle}>Deal Description</label>
          <textarea value={form.deal_description} onChange={e => update('deal_description', e.target.value)} placeholder='Describe your deal — what does the customer get? Any conditions?' style={{ width: '100%', minHeight: '100px', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '14px 16px', fontSize: '16px', backgroundColor: 'white', outline: 'none', resize: 'vertical', boxSizing: 'border-box' as const, fontFamily: 'inherit' }} />
        </div>

        <div>
          <label style={labelStyle}>Deal expires in</label>
          <select value={form.expires_days} onChange={e => update('expires_days', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
            <option value='7'>7 days</option>
            <option value='14'>14 days</option>
            <option value='30'>30 days</option>
            <option value='60'>60 days</option>
            <option value='90'>90 days</option>
          </select>
        </div>

        {error && <p style={{ fontSize: '14px', color: '#dc2626', backgroundColor: '#fef2f2', padding: '12px 16px', borderRadius: '12px', margin: 0 }}>{error}</p>}

        <button onClick={submit} disabled={status === 'loading'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', backgroundColor: status === 'loading' ? '#94a3b8' : '#ea580c', borderRadius: '16px', height: '60px', minHeight: 0, color: 'white', fontSize: '18px', fontWeight: 700, border: 'none', cursor: status === 'loading' ? 'not-allowed' : 'pointer', width: '100%', boxShadow: '0 4px 16px rgba(234,88,12,0.25)' }}>
          {status === 'loading' ? 'Submitting...' : <><Send size={20} strokeWidth={2} />Submit My Deal — Free</>}
        </button>

        <p style={{ fontSize: '13px', color: '#94a3b8', textAlign: 'center', margin: 0 }}>We will review and publish within 24 hours. Questions? <a href='mailto:support@klickifyagency.com' style={{ color: '#0f3460', fontWeight: 600 }}>support@klickifyagency.com</a></p>
      </div>

      <div style={{ padding: '4px 20px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: '12px', color: '#94a3b8' }}>Powered by <a href='https://klickifyagency.com' target='_blank' rel='noopener noreferrer' style={{ color: '#e94560', fontWeight: 600, textDecoration: 'none' }}>Klickify Agency</a></div>
      </div>
      <BottomNav />
    </div>
  )
}