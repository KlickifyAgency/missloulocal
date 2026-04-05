'use client'
import { useState, useEffect } from 'react'
import { ArrowLeft, PawPrint, Phone, Mail, MapPin, Heart, Search, Plus, X, CheckCircle, User, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import BottomNav from '@/components/layout/BottomNav'

const petTypes = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Other']

function ContactModal({ post, onClose }: { post: any, onClose: () => void }) {
  const [form, setForm] = useState({ sender_name: '', sender_email: '', sender_phone: '', message: '' })
  const [status, setStatus] = useState<'idle'|'loading'|'success'>('idle')

  async function send() {
    if (!form.sender_name || !form.sender_email || !form.message) return
    setStatus('loading')
    await fetch('/api/pets/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, owner_email: post.contact_email, owner_name: post.contact_name, pet_name: post.pet_name, pet_type: post.pet_type })
    })
    setStatus('success')
  }

  const inp = { width: '100%', height: '52px', borderRadius: '12px', border: '1.5px solid #e2e8f0', padding: '0 16px', fontSize: '16px', outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'inherit' }

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ backgroundColor: 'white', borderRadius: '24px 24px 0 0', padding: '24px 20px 40px', width: '100%', maxWidth: '480px', maxHeight: '85vh', overflowY: 'auto' as const }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <p style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: 0 }}>I have information!</p>
          <button onClick={onClose} style={{ width: '32px', height: '32px', minHeight: 0, backgroundColor: '#f1f5f9', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} color='#64748b' /></button>
        </div>
        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <CheckCircle size={40} color='#16a34a' strokeWidth={1.5} style={{ margin: '0 auto 12px', display: 'block' }} />
            <p style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>Message sent!</p>
            <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 20px' }}>The owner will receive your message by email right away.</p>
            <button onClick={onClose} style={{ height: '48px', minHeight: 0, backgroundColor: '#f97316', border: 'none', borderRadius: '12px', color: 'white', fontSize: '15px', fontWeight: 700, cursor: 'pointer', width: '100%' }}>Done</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ backgroundColor: '#fff7ed', borderRadius: '12px', padding: '12px', marginBottom: '4px' }}>
              <p style={{ fontSize: '13px', color: '#9a3412', margin: 0 }}>Your message will be sent directly to the owner by email.</p>
            </div>
            <input value={form.sender_name} onChange={e => setForm(p => ({...p, sender_name: e.target.value}))} placeholder='Your name *' style={inp} />
            <input value={form.sender_email} onChange={e => setForm(p => ({...p, sender_email: e.target.value}))} placeholder='Your email *' type='email' style={inp} />
            <input value={form.sender_phone} onChange={e => setForm(p => ({...p, sender_phone: e.target.value}))} placeholder='Your phone (optional)' type='tel' style={inp} />
            <textarea value={form.message} onChange={e => setForm(p => ({...p, message: e.target.value}))} placeholder='Where did you see the pet? Any details that can help...' style={{ width: '100%', minHeight: '100px', borderRadius: '12px', border: '1.5px solid #e2e8f0', padding: '12px 16px', fontSize: '16px', outline: 'none', resize: 'vertical' as const, fontFamily: 'inherit', boxSizing: 'border-box' as const }} />
            <button onClick={send} disabled={status === 'loading'} style={{ height: '52px', minHeight: 0, backgroundColor: '#f97316', border: 'none', borderRadius: '14px', color: 'white', fontSize: '16px', fontWeight: 700, cursor: 'pointer', width: '100%' }}>
              {status === 'loading' ? 'Sending...' : 'Send Message to Owner'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function ReportForm({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [petType, setPetType] = useState('lost')
  const [form, setForm] = useState({ type: 'lost', pet_name: '', pet_type: 'Dog', description: '', contact_name: '', contact_email: '', contact_phone: '', location: '', image_url: '' })
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState('')

  async function uploadPhoto(file: File | Blob) {
    setUploading(true)
    try {
      const formData = new FormData()
      const f = file instanceof File ? file : new File([file], 'pet.jpg', { type: 'image/jpeg' })
      formData.append('file', f)
      const res = await fetch('/api/pets/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setForm(p => ({ ...p, image_url: data.url }))
      setPreview(data.url)
    } catch(e) { console.error('Upload error:', e) }
    setUploading(false)
  }

  async function submit() {
    if (!form.description || !form.contact_email || !form.contact_name) { setStatus('error'); return }
    setStatus('loading')
    const payload = { ...form, type: petType }
    const res = await fetch('/api/pets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    const data = await res.json()
    if (data.success) { setStatus('success'); setTimeout(() => { onSuccess(); onClose(); }, 2000) }
    else setStatus('error')
  }

  const inp = { width: '100%', height: '52px', borderRadius: '12px', border: '1.5px solid #e2e8f0', padding: '0 16px', fontSize: '16px', outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'inherit', backgroundColor: 'white' }

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ backgroundColor: 'white', borderRadius: '24px 24px 0 0', padding: '24px 20px 40px', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto' as const }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <p style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Report a Pet</p>
          <button onClick={onClose} style={{ width: '32px', height: '32px', minHeight: 0, backgroundColor: '#f1f5f9', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} color='#64748b' /></button>
        </div>

        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <CheckCircle size={40} color='#16a34a' strokeWidth={1.5} style={{ margin: '0 auto 12px', display: 'block' }} />
            <p style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>Posted!</p>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Your report is now live. We hope you find your pet soon!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['lost', 'found'].map(t => (
                  <button type='button' key={t} onClick={() => setPetType(t)} style={{ flex: 1, height: '48px', minHeight: 0, backgroundColor: petType === t ? (t === 'lost' ? '#dc2626' : '#16a34a') : '#f1f5f9', border: 'none', borderRadius: '12px', color: petType === t ? 'white' : '#64748b', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>{t === 'lost' ? 'Lost Pet' : 'Found Pet'}</button>
                ))}
              </div>
              <button type='button' onClick={() => setPetType('needs-home')} style={{ height: '48px', minHeight: 0, backgroundColor: petType === 'needs-home' ? '#7c3aed' : '#f1f5f9', border: 'none', borderRadius: '12px', color: petType === 'needs-home' ? 'white' : '#64748b', fontSize: '14px', fontWeight: 700, cursor: 'pointer', width: '100%' }}>Needs a Home</button>
            </div>

            <select value={form.pet_type} onChange={e => setForm(p => ({...p, pet_type: e.target.value}))} style={inp}>
              {petTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>

            <input value={form.pet_name} onChange={e => setForm(p => ({...p, pet_name: e.target.value}))} placeholder="Pet's name (if known)" style={inp} />
            <input value={form.location} onChange={e => setForm(p => ({...p, location: e.target.value}))} placeholder='Last seen / Found at location' style={inp} />
            <textarea value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} placeholder='Describe the pet — color, size, collar, any markings... *' style={{ width: '100%', minHeight: '90px', borderRadius: '12px', border: '1.5px solid #e2e8f0', padding: '12px 16px', fontSize: '16px', outline: 'none', resize: 'vertical' as const, fontFamily: 'inherit', boxSizing: 'border-box' as const }} />
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>Pet Photo (optional)</label>
              {preview ? (
                <div style={{ position: 'relative', marginBottom: '4px' }}>
                  <img src={preview} alt='Pet' style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '12px', border: '1.5px solid #e2e8f0' }} />
                  <button onClick={() => { setPreview(''); setForm(p => ({...p, image_url: ''})) }} style={{ position: 'absolute', top: '8px', right: '8px', width: '28px', height: '28px', minHeight: 0, backgroundColor: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>×</button>
                </div>
              ) : (
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '52px', borderRadius: '12px', border: '2px dashed #e2e8f0', backgroundColor: '#f8fafc', cursor: 'pointer', fontSize: '14px', color: '#64748b', fontWeight: 600 }}>
                  {uploading ? 'Uploading...' : '📷 Take or Choose a Photo'}
                  <input type='file' accept='image/*' onChange={e => { if (e.target.files?.[0]) uploadPhoto(e.target.files[0]) }} style={{ display: 'none' }} />
                </label>
              )}
            </div>

            <div style={{ height: '1px', backgroundColor: '#f1f5f9' }} />
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Your contact info (shared only when someone responds):</p>
            <input value={form.contact_name} onChange={e => setForm(p => ({...p, contact_name: e.target.value}))} placeholder='Your name *' style={inp} />
            <input value={form.contact_email} onChange={e => setForm(p => ({...p, contact_email: e.target.value}))} placeholder='Your email * (people will contact you here)' type='email' style={inp} />
            <input value={form.contact_phone} onChange={e => setForm(p => ({...p, contact_phone: e.target.value}))} placeholder='Your phone (optional)' type='tel' style={inp} />

            {status === 'error' && <p style={{ fontSize: '13px', color: '#dc2626', backgroundColor: '#fef2f2', padding: '10px 14px', borderRadius: '10px', margin: 0 }}>Please fill in description, your name and email.</p>}


            <button onClick={submit} disabled={status === 'loading'} style={{ height: '54px', minHeight: 0, backgroundColor: petType === 'lost' ? '#dc2626' : petType === 'needs-home' ? '#7c3aed' : '#16a34a', border: 'none', borderRadius: '14px', color: 'white', fontSize: '17px', fontWeight: 700, cursor: 'pointer', width: '100%' }}>
              {status === 'loading' ? 'Posting...' : petType === 'lost' ? 'Post Lost Pet Alert' : petType === 'needs-home' ? 'Post Needs a Home Alert' : 'Post Found Pet Alert'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function FindMyPetPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all'|'lost'|'found'>('all')
  const [showForm, setShowForm] = useState(false)
  const [contactPost, setContactPost] = useState<any>(null)

  async function load() {
    setLoading(true)
    const res = await fetch('/api/pets')
    const data = await res.json()
    setPosts(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filtered = posts.filter(p => filter === 'all' || p.type === filter)
  const lostCount = posts.filter(p => p.type === 'lost').length
  const foundCount = posts.filter(p => p.type === 'found').length
  const needsHomeCount = posts.filter(p => p.type === 'needs-home').length

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingBottom: '80px' }}>
      <header style={{ backgroundColor: '#0f3460', padding: '0 20px', height: '64px', display: 'flex', alignItems: 'center', gap: '16px', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href='/' style={{ width: '40px', height: '40px', minHeight: 0, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ArrowLeft size={20} color='white' strokeWidth={2} />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
          <div style={{ width: '36px', height: '36px', backgroundColor: '#f97316', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PawPrint size={18} color='white' strokeWidth={2} />
          </div>
          <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'white', margin: 0 }}>Find My Pet</h1>
        </div>
        <button onClick={() => setShowForm(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#f97316', border: 'none', borderRadius: '10px', padding: '8px 14px', color: 'white', fontSize: '13px', fontWeight: 700, cursor: 'pointer', minHeight: 0 }}>
          <Plus size={15} /> Report
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', padding: '14px 16px 0' }}>
        <div style={{ backgroundColor: '#fef2f2', borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
          <p style={{ fontSize: '24px', fontWeight: 800, color: '#dc2626', margin: '0 0 2px' }}>{lostCount}</p>
          <p style={{ fontSize: '12px', color: '#dc2626', fontWeight: 600, margin: 0 }}>Lost Pets</p>
        </div>
        <div style={{ backgroundColor: '#f0fdf4', borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
          <p style={{ fontSize: '22px', fontWeight: 800, color: '#16a34a', margin: '0 0 2px' }}>{foundCount}</p>
          <p style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600, margin: 0 }}>Found</p>
        </div>
        <div style={{ backgroundColor: '#f5f3ff', borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
          <p style={{ fontSize: '22px', fontWeight: 800, color: '#7c3aed', margin: '0 0 2px' }}>{needsHomeCount}</p>
          <p style={{ fontSize: '11px', color: '#7c3aed', fontWeight: 600, margin: 0 }}>Needs Home</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', padding: '12px 16px' }}>
        {(['all', 'lost', 'found', 'needs-home'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f as any)} style={{ flex: 1, height: '38px', minHeight: 0, backgroundColor: filter === f ? '#0f3460' : 'white', border: '1px solid ' + (filter === f ? '#0f3460' : '#e2e8f0'), borderRadius: '10px', color: filter === f ? 'white' : '#64748b', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>{f === 'all' ? 'All' : f === 'lost' ? 'Lost' : f === 'found' ? 'Found' : 'Needs Home'}</button>
        ))}
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {loading && <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>Loading...</div>}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <PawPrint size={36} color='#f97316' strokeWidth={1.5} style={{ margin: '0 auto 12px', display: 'block' }} />
            <p style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>No reports yet</p>
            <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 20px' }}>Be the first to post a lost or found pet alert in Natchez!</p>
            <button onClick={() => setShowForm(true)} style={{ height: '48px', minHeight: 0, backgroundColor: '#f97316', border: 'none', borderRadius: '12px', color: 'white', fontSize: '15px', fontWeight: 700, cursor: 'pointer', padding: '0 24px' }}>Post an Alert</button>
          </div>
        )}

        {filtered.map(post => (
          <div key={post.id} style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid ' + (post.type === 'lost' ? '#fecaca' : post.type === 'needs-home' ? '#ddd6fe' : '#bbf7d0') }}>
            {post.image_url && (
            <div style={{ position: 'relative', height: '260px', overflow: 'hidden', backgroundColor: '#000' }}>
              <img src={post.image_url} alt='' style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(20px)', transform: 'scale(1.1)', opacity: 0.6 }} />
              <img src={post.image_url} alt={post.pet_name || post.pet_type} style={{ position: 'relative', width: '100%', height: '100%', objectFit: 'contain', zIndex: 1 }} />
            </div>
          )}
            <div style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ backgroundColor: post.type === 'lost' ? '#dc2626' : post.type === 'needs-home' ? '#7c3aed' : '#16a34a', color: 'white', fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '20px', textTransform: 'uppercase' as const }}>{post.type}</span>
                  <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>{post.pet_type}</span>
                </div>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
              {post.pet_name && <p style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>{post.pet_name}</p>}
              <p style={{ fontSize: '14px', color: '#374151', margin: '0 0 8px', lineHeight: 1.5 }}>{post.description}</p>
              {post.location && <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}><MapPin size={13} color='#94a3b8' /><span style={{ fontSize: '13px', color: '#64748b' }}>{post.location}</span></div>}
              <div style={{ display: 'flex', gap: '8px' }}>
                {post.contact_phone && <a href={'tel:' + post.contact_phone} style={{ flex: 1, height: '44px', minHeight: 0, backgroundColor: '#16a34a', borderRadius: '12px', color: 'white', fontSize: '14px', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Phone size={15} />Call</a>}
                <button onClick={() => setContactPost(post)} style={{ flex: 2, height: '44px', minHeight: 0, backgroundColor: '#f97316', border: 'none', borderRadius: '12px', color: 'white', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><MessageCircle size={15} />I have info!</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && <ReportForm onClose={() => setShowForm(false)} onSuccess={load} />}
      {contactPost && <ContactModal post={contactPost} onClose={() => setContactPost(null)} />}

      <div style={{ padding: '16px 20px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Powered by <a href='https://klickifyagency.com' target='_blank' rel='noopener noreferrer' style={{ color: '#e94560', fontWeight: 600, textDecoration: 'none' }}>Klickify Agency</a></p>
      </div>
      <BottomNav />
    </div>
  )
}