'use client'
import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Phone, MapPin, Search, Clock, CheckCircle, Navigation, Star, Globe } from 'lucide-react'
import { Wrench, UtensilsCrossed, HeartPulse, Church, Home, CalendarDays, Scale, Car, Scissors, PawPrint, Settings, ShoppingBag, Palette, Compass } from 'lucide-react'
import Link from 'next/link'
import BottomNav from '@/components/layout/BottomNav'

const iconMap: Record<string, any> = { 'home-services': Wrench, 'restaurants-food': UtensilsCrossed, 'medical-health': HeartPulse, 'churches-community': Church, 'real-estate-rentals': Home, 'events': CalendarDays, 'legal-financial': Scale, 'transportation': Car, 'personal-care': Scissors, 'pet-services': PawPrint, 'auto-services': Settings, 'shopping-retail': ShoppingBag, 'arts-education': Palette, 'tours-entertainment': Compass }
const categoryColors: Record<string, { color: string; bg: string }> = { 'home-services': { color: '#2563eb', bg: '#eff6ff' }, 'restaurants-food': { color: '#dc2626', bg: '#fef2f2' }, 'medical-health': { color: '#16a34a', bg: '#f0fdf4' }, 'churches-community': { color: '#7c3aed', bg: '#faf5ff' }, 'real-estate-rentals': { color: '#ea580c', bg: '#fff7ed' }, 'events': { color: '#db2777', bg: '#fdf2f8' }, 'legal-financial': { color: '#0891b2', bg: '#ecfeff' }, 'transportation': { color: '#65a30d', bg: '#f7fee7' }, 'personal-care': { color: '#e11d48', bg: '#fff1f2' }, 'pet-services': { color: '#d97706', bg: '#fffbeb' }, 'auto-services': { color: '#475569', bg: '#f8fafc' }, 'shopping-retail': { color: '#9333ea', bg: '#faf5ff' }, 'arts-education': { color: '#0d9488', bg: '#f0fdfa' }, 'tours-entertainment': { color: '#0369a1', bg: '#e0f2fe' } }

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<any>(null)

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 300) }, [])

  function handleSearch(q: string) {
    setQuery(q)
    clearTimeout(timerRef.current)
    if (q.length < 2) { setResults([]); setSearched(false); return }
    setLoading(true)
    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch('/api/search?q=' + encodeURIComponent(q))
        const data = await res.json()
        setResults(Array.isArray(data) ? data : [])
        setSearched(true)
      } catch(e) {
        setResults([])
        setSearched(true)
      } finally {
        setLoading(false)
      }
    }, 400)
  }

  function takeMeThere(address: string) {
    if (!address) return
    window.open('https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(address), '_blank')
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingBottom: '80px' }}>
      <header style={{ backgroundColor: '#0f3460', padding: '0 16px', height: '64px', display: 'flex', alignItems: 'center', gap: '12px', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href='/' style={{ width: '40px', height: '40px', minHeight: 0, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ArrowLeft size={20} color='white' strokeWidth={2} />
        </Link>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: '12px', padding: '0 14px', height: '44px' }}>
          <Search size={18} color='rgba(255,255,255,0.6)' strokeWidth={2} />
          <input ref={inputRef} value={query} onChange={e => handleSearch(e.target.value)} placeholder='Search businesses...' style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'white', fontSize: '17px', minHeight: 0, height: '100%' }} />
          {query && <button onClick={() => handleSearch('')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '22px', lineHeight: 1, padding: 0, minHeight: 0 }}>×</button>}
        </div>
      </header>

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {!searched && !loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ width: '64px', height: '64px', backgroundColor: '#eff6ff', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Search size={30} color='#2563eb' strokeWidth={1.5} />
            </div>
            <p style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>Search local businesses</p>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Type a name to find it instantly</p>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ width: '36px', height: '36px', border: '3px solid #2563eb', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto', animation: 'spin 0.8s linear infinite' }} />
            <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
          </div>
        )}

        {searched && !loading && results.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>No results for "{query}"</p>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Try a different name or browse by category</p>
          </div>
        )}

        {searched && !loading && results.length > 0 && (
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#0f3460', margin: '0 0 4px' }}>{results.length} result{results.length !== 1 ? 's' : ''} for "{query}"</p>
        )}

        {results.map((biz: any) => {
          const isPremium = biz.tier === 'premium'
          const slug = biz.categories?.slug ?? ''
          const catColor = categoryColors[slug] ?? { color: '#0f3460', bg: '#f1f5f9' }
          const Icon = iconMap[slug] ?? MapPin

          if (isPremium) return (
            <div key={biz.id} style={{ background: 'linear-gradient(135deg, #0f3460 0%, #16213e 100%)', borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', boxShadow: '0 8px 32px rgba(15,52,96,0.25)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', backgroundColor: '#e94560', borderRadius: '50%', opacity: 0.1 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: '#e94560', borderRadius: '20px', padding: '4px 10px' }}>
                  <Star size={11} color='white' fill='white' />
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: '1px' }}>Premium Listing</span>
                </div>
                {biz.is_verified && <CheckCircle size={16} color='#4ade80' fill='#4ade80' />}
              </div>
              {biz.photos && biz.photos.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', borderRadius: '12px', overflow: 'hidden', height: '140px' }}>
                  {biz.photos.slice(0, 3).map((photo: string, i: number) => (
                    <img key={i} src={photo} alt={biz.name} style={{ flex: 1, objectFit: 'cover', minWidth: 0 }} />
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{ width: '56px', height: '56px', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(255,255,255,0.2)' }}>
                  <Icon size={28} color='white' strokeWidth={1.6} />
                </div>
                <div style={{ flex: 1 }}>
                  <Link href={'/business/' + biz.slug} style={{ fontSize: '20px', fontWeight: 800, color: 'white', margin: '0 0 6px', lineHeight: 1.2, textDecoration: 'none', display: 'block' }}>{biz.name}</Link>
                  {biz.google_rating && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', color: '#fbbf24', fontWeight: 700 }}>{'★'.repeat(Math.round(biz.google_rating))} {biz.google_rating}</span>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>({biz.google_review_count?.toLocaleString()} Google reviews)</span>
                    </div>
                  )}
                  {biz.description && <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.6 }}>{biz.description}</p>}
                </div>
              </div>
              {biz.address && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={14} color='rgba(255,255,255,0.5)' strokeWidth={2} /><span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{biz.address}</span></div>}
              {biz.phone && <a href={'tel:' + biz.phone} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', backgroundColor: '#e94560', borderRadius: '14px', height: '56px', minHeight: 0, color: 'white', fontSize: '18px', fontWeight: 800, textDecoration: 'none', width: '100%', boxShadow: '0 4px 16px rgba(233,69,96,0.4)' }}><Phone size={20} strokeWidth={2.5} />{biz.phone}</a>}
              {biz.address && biz.latitude && biz.longitude && <button onClick={() => takeMeThere(biz.address)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '14px', height: '46px', minHeight: 0, color: 'white', fontSize: '14px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', width: '100%' }}><Navigation size={16} strokeWidth={2} />Take Me There</button>}
              {biz.website && <a href={biz.website} target='_blank' rel='noopener noreferrer' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', height: '46px', minHeight: 0, color: 'white', fontSize: '14px', fontWeight: 600, textDecoration: 'none', width: '100%', border: '1px solid rgba(255,255,255,0.2)' }}><Globe size={16} strokeWidth={2} />Visit Website</a>}
            </div>
          )

          return (
            <div key={biz.id} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', backgroundColor: catColor.bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={24} color={catColor.color} strokeWidth={1.8} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <Link href={'/business/' + biz.slug} style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', textDecoration: 'none' }}>{biz.name}</Link>
                    {biz.is_verified && <CheckCircle size={15} color='#0f3460' fill='#0f3460' />}
                  </div>
                  {biz.categories?.name && <span style={{ fontSize: '12px', color: catColor.color, fontWeight: 600, backgroundColor: catColor.bg, padding: '2px 8px', borderRadius: '20px' }}>{biz.categories.name}</span>}
                </div>
              </div>
              {biz.address && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} color='#94a3b8' strokeWidth={2} /><span style={{ fontSize: '13px', color: '#64748b' }}>{biz.address}</span></div>}
              {!biz.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f8fafc', borderRadius: '10px', padding: '10px 12px', border: '1px dashed #cbd5e1' }}><Clock size={14} color='#94a3b8' /><span style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>Directory being updated — check back soon</span></div>}
              {biz.phone && <a href={'tel:' + biz.phone} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', backgroundColor: '#16a34a', borderRadius: '14px', height: '52px', minHeight: 0, color: 'white', fontSize: '17px', fontWeight: 700, textDecoration: 'none', width: '100%' }}><Phone size={18} strokeWidth={2.5} />{biz.phone}</a>}
              {biz.address && biz.latitude && biz.longitude && <button onClick={() => takeMeThere(biz.address)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#0f3460', borderRadius: '14px', height: '48px', minHeight: 0, color: 'white', fontSize: '15px', fontWeight: 700, border: 'none', cursor: 'pointer', width: '100%' }}><Navigation size={17} strokeWidth={2.5} />Take Me There</button>}
            </div>
          )
        })}
      </div>

      <div style={{ padding: '4px 20px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: '12px', color: '#94a3b8' }}>Powered by <a href='https://klickifyagency.com' target='_blank' rel='noopener noreferrer' style={{ color: '#e94560', fontWeight: 600, textDecoration: 'none' }}>Klickify Agency</a></div>
      </div>
      <BottomNav />
    </div>
  )
}