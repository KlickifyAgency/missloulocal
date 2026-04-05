'use client'
import { useState } from 'react'
import { X, Building2, Phone, Mail, User, CheckCircle, Shield, Camera } from 'lucide-react'

interface Props {
  businessId: string
  businessName: string
  onClose: () => void
}

export default function ClaimModal({ businessId, businessName, onClose }: Props) {
  const [form, setForm] = useState({ owner_name: '', owner_email: '', owner_phone: '' })
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')
  const [error, setError] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoUploading, setPhotoUploading] = useState(false)
  const [photoUploaded, setPhotoUploaded] = useState(false)

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhoto(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  async function uploadPhoto(bizId: string) {
    if (!photo) return
    setPhotoUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', photo)
      fd.append('businessId', bizId)
      await fetch('/api/businesses/upload-photo', { method: 'POST', body: fd })
      setPhotoUploaded(true)
    } catch(e) {}
    setPhotoUploading(false)
  }

  function update(field: string, value: string) { setForm(prev => ({ ...prev, [field]: value })) }

  async function submit() {
    if (!form.owner_name || !form.owner_email) { setError('Please fill in your name and email.'); return }
    setStatus('loading'); setError('')
    try {
      const res = await fetch('/api/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business_id: businessId, business_name: businessName, ...form })
      })
      const data = await res.json()
      if (data.success) setStatus('success')
      else { setError(data.error || 'Something went wrong.'); setStatus('error') }
    } catch(e) { setError('Connection error. Please try again.'); setStatus('error') }
  }

  const inputStyle = { width: '100%', height: '52px', borderRadius: '12px', border: '1.5px solid #e2e8f0', padding: '0 16px', fontSize: '16px', backgroundColor: 'white', outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'inherit' }

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ backgroundColor: 'white', borderRadius: '24px 24px 0 0', padding: '24px 20px 40px', width: '100%', maxWidth: '480px' }} onClick={e => e.stopPropagation()}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', backgroundColor: '#0f3460', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={18} color='white' strokeWidth={2} />
            </div>
            <div>
              <p style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Claim This Listing</p>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Free — no credit card needed</p>
            </div>
          </div>
          <button onClick={onClose} style={{ width: '32px', height: '32px', minHeight: 0, backgroundColor: '#f1f5f9', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={16} color='#64748b' />
          </button>
        </div>

        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ width: '64px', height: '64px', backgroundColor: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle size={32} color='#16a34a' strokeWidth={1.5} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>Check your email!</h3>
            <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 20px', lineHeight: 1.6 }}>We sent a verification link to <strong>{form.owner_email}</strong>. Click it to activate your listing.</p>
            <div style={{ backgroundColor: '#f8fafc', borderRadius: '12px', padding: '16px', marginBottom: '16px', border: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', margin: '0 0 10px' }}>📸 Add a photo to your listing</p>
              {photoPreview && <img src={photoPreview} alt='preview' style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '10px', marginBottom: '10px' }} />}
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: photoUploaded ? '#16a34a' : '#0f3460', color: 'white', borderRadius: '10px', padding: '12px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
                <Camera size={16} />
                {photoUploaded ? '✅ Photo uploaded!' : photoUploading ? 'Uploading...' : 'Choose a photo (optional)'}
                <input type='file' accept='image/*' onChange={handlePhoto} style={{ display: 'none' }} />
              </label>
              {photo && !photoUploaded && <button onClick={() => uploadPhoto(businessId)} disabled={photoUploading} style={{ width: '100%', marginTop: '8px', height: '40px', minHeight: 0, backgroundColor: '#e94560', border: 'none', borderRadius: '10px', color: 'white', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>Upload Photo</button>}
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: '8px 0 0', textAlign: 'center' }}>Free listings include 1 photo</p>
            </div>
            <button onClick={onClose} style={{ height: '48px', minHeight: 0, backgroundColor: '#0f3460', border: 'none', borderRadius: '12px', color: 'white', fontSize: '15px', fontWeight: 700, cursor: 'pointer', width: '100%' }}>Done</button>
          </div>
        ) : (
          <>
            <div style={{ backgroundColor: '#eff6ff', borderRadius: '12px', padding: '12px 14px', marginBottom: '20px' }}>
              <p style={{ fontSize: '14px', color: '#1e40af', margin: 0, fontWeight: 600 }}>{businessName}</p>
              <p style={{ fontSize: '12px', color: '#3b82f6', margin: '2px 0 0' }}>Enter your info to claim and manage this listing</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              <div style={{ position: 'relative' }}>
                <User size={16} color='#94a3b8' style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input value={form.owner_name} onChange={e => update('owner_name', e.target.value)} placeholder='Your full name *' style={{ ...inputStyle, paddingLeft: '40px' }} />
              </div>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color='#94a3b8' style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input value={form.owner_email} onChange={e => update('owner_email', e.target.value)} placeholder='Your email address *' type='email' style={{ ...inputStyle, paddingLeft: '40px' }} />
              </div>
              <div style={{ position: 'relative' }}>
                <Phone size={16} color='#94a3b8' style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input value={form.owner_phone} onChange={e => update('owner_phone', e.target.value)} placeholder='Phone number (optional)' type='tel' style={{ ...inputStyle, paddingLeft: '40px' }} />
              </div>
            </div>

            {error && <p style={{ fontSize: '13px', color: '#dc2626', backgroundColor: '#fef2f2', padding: '10px 14px', borderRadius: '10px', margin: '0 0 12px' }}>{error}</p>}

            <button onClick={submit} disabled={status === 'loading'} style={{ width: '100%', height: '52px', minHeight: 0, background: status === 'loading' ? '#94a3b8' : 'linear-gradient(135deg, #0f3460, #1e40af)', border: 'none', borderRadius: '14px', color: 'white', fontSize: '16px', fontWeight: 700, cursor: status === 'loading' ? 'not-allowed' : 'pointer', marginBottom: '12px' }}>
              {status === 'loading' ? 'Sending verification...' : 'Claim My Listing — Free'}
            </button>

            <p style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center', margin: 0 }}>We will send you a verification email. No spam, ever.</p>
          </>
        )}
      </div>
    </div>
  )
}