'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, Phone, MapPin, Clock, CheckCircle, Star, Globe, Navigation, Shield } from 'lucide-react'
import { Wrench, UtensilsCrossed, HeartPulse, Car, ShoppingBag, Scissors, Scale, Building2, Stethoscope, Church, Palette, Compass, PawPrint, Footprints, ShoppingBasket } from 'lucide-react'
import Link from 'next/link'
import BottomNav from '@/components/layout/BottomNav'
import ClaimModal from '@/components/claim/ClaimModal'

const iconMap: Record<string, any> = {
  'restaurants-food': UtensilsCrossed, 'medical-health': HeartPulse, 'home-services': Wrench,
  'auto-services': Car, 'shopping-retail': ShoppingBag, 'personal-care': Scissors,
  'legal-financial': Scale, 'real-estate-hotels': Building2, 'medical-specialists': Stethoscope,
  'churches-faith': Church, 'arts-education': Palette, 'tours-attractions': Compass,
  'pet-services': PawPrint, 'walking-downtown': Footprints
}

const categoryMeta: Record<string, { name: string; color: string; bg: string }> = {
  'restaurants-food':    { name: 'Restaurants & Food',   color: '#dc2626', bg: '#fef2f2' },
  'medical-health':      { name: 'Medical & Health',     color: '#16a34a', bg: '#f0fdf4' },
  'home-services':       { name: 'Home Services',        color: '#2563eb', bg: '#eff6ff' },
  'auto-services':       { name: 'Auto Services',        color: '#475569', bg: '#f8fafc' },
  'shopping-retail':     { name: 'Shopping & Retail',    color: '#9333ea', bg: '#faf5ff' },
  'personal-care':       { name: 'Personal Care',        color: '#e11d48', bg: '#fff1f2' },
  'legal-financial':     { name: 'Legal & Financial',    color: '#0891b2', bg: '#ecfeff' },
  'real-estate-hotels':  { name: 'Real Estate & Hotels', color: '#ea580c', bg: '#fff7ed' },
  'medical-specialists': { name: 'Medical Specialists',  color: '#0d9488', bg: '#f0fdfa' },
  'churches-faith':      { name: 'Churches & Faith',     color: '#7c3aed', bg: '#faf5ff' },
  'arts-education':      { name: 'Arts & Education',     color: '#f59e0b', bg: '#fffbeb' },
  'tours-attractions':   { name: 'Tours & Attractions',  color: '#0369a1', bg: '#e0f2fe' },
  'pet-services':        { name: 'Pet Services',         color: '#d97706', bg: '#fffbeb' },
  'walking-downtown':    { name: 'Walking Downtown',     color: '#1e40af', bg: '#eff6ff' },
  'farmers-market':      { name: 'Farmers Market',       color: '#65a30d', bg: '#f7fee7' },
}

function takeMeThere(address: string) {
  if (!address) return
  window.open('https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(address), '_blank')
}

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  const [businesses, setBusinesses] = useState<any[]>([])
  const [claimBiz, setClaimBiz] = useState<{id:string,name:string}|null>(null)
  const [loading, setLoading] = useState(true)

  const meta = categoryMeta[slug] ?? { name: 'Services', color: '#0f3460', bg: '#eff6ff' }
  const Icon = iconMap[slug] ?? Wrench

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    fetch('/api/businesses?slug=' + slug)
      .then(r => r.json())
      .then(data => { setBusinesses(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [slug])

  const sorted = [
    ...businesses.filter(b => b.tier === 'premium'),
    ...businesses.filter(b => b.tier === 'featured'),
    ...businesses.filter(b => b.tier !== 'premium' && b.tier !== 'featured'),
  ]

  const isDowntown = slug === 'walking-downtown'

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingBottom: '80px' }}>
      <header style={{ backgroundColor: isDowntown ? '#1e3a8a' : '#0f3460', padding: '0 20px', height: '64px', display: 'flex', alignItems: 'center', gap: '16px', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href='/' style={{ width: '40px', height: '40px', minHeight: 0, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ArrowLeft size={20} color='white' strokeWidth={2} />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <div style={{ width: '36px', height: '36px', backgroundColor: meta.color + '30', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={20} color='white' strokeWidth={1.8} />
          </div>
          <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'white', margin: 0 }}>{meta.name}</h1>
        </div>
      </header>

      {isDowntown && (
        <div style={{ backgroundColor: '#fef3c7', borderBottom: '2px solid #b45309', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Footprints size={16} color='#b45309' strokeWidth={2} />
          <span style={{ fontSize: '13px', color: '#78350f', fontWeight: 600 }}>Walkable historic downtown — all within steps of each other</span>
        </div>
      )}

      <div style={{ backgroundColor: isDowntown ? '#dbeafe' : meta.bg, borderBottom: '1px solid ' + meta.color + '20', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '14px', color: meta.color, fontWeight: 600 }}>{loading ? 'Loading...' : businesses.length + ' businesses listed'}</span>
        <span style={{ fontSize: '13px', color: '#64748b' }}>Natchez area</span>
      </div>

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid ' + meta.color, borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
            <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
            <p style={{ fontSize: '16px', color: '#64748b', margin: 0 }}>Loading businesses...</p>
          </div>
        )}

        {!loading && businesses.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <Clock size={28} color={meta.color} strokeWidth={1.5} />
            <p style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '16px 0 8px' }}>Coming Soon</p>
            <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>We are actively adding businesses in this category.</p>
          </div>
        )}

        {sorted.map((biz: any) => {
          const isPremium = biz.tier === 'premium'
          const isFeatured = biz.tier === 'featured'
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
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{ width: '56px', height: '56px', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(255,255,255,0.2)' }}>
                  <Icon size={28} color='white' strokeWidth={1.6} />
                </div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'white', margin: '0 0 6px', lineHeight: 1.2 }}>{biz.name}</h2>
                  {biz.google_rating && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', color: '#fbbf24', fontWeight: 700 }}>{'★'.repeat(Math.round(biz.google_rating))} {biz.google_rating}</span>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>({biz.google_review_count?.toLocaleString()} Google reviews)</span>
                      <img src='https://www.google.com/favicon.ico' alt='G' style={{ width: '12px', height: '12px', borderRadius: '2px' }} />
                    </div>
                  )}
                  {biz.description && <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.6 }}>{biz.description}</p>}
                </div>
              </div>
              {biz.address && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={14} color='rgba(255,255,255,0.5)' strokeWidth={2} /><span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{biz.address}</span></div>}
              {biz.phone && <a href={'tel:' + biz.phone} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', backgroundColor: '#e94560', borderRadius: '14px', height: '56px', minHeight: 0, color: 'white', fontSize: '18px', fontWeight: 800, textDecoration: 'none', width: '100%', boxShadow: '0 4px 16px rgba(233,69,96,0.4)' }}><Phone size={20} strokeWidth={2.5} />{biz.phone}</a>}
              {biz.latitude && biz.longitude && <button onClick={() => takeMeThere(biz.address)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '14px', height: '46px', minHeight: 0, color: 'white', fontSize: '14px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', width: '100%' }}><Navigation size={16} strokeWidth={2} />Take Me There</button>}
              {biz.website && <a href={biz.website} target='_blank' rel='noopener noreferrer' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', height: '46px', minHeight: 0, color: 'white', fontSize: '14px', fontWeight: 600, textDecoration: 'none', width: '100%', border: '1px solid rgba(255,255,255,0.2)' }}><Globe size={16} strokeWidth={2} />Visit Website</a>}
            </div>
          )
          return (
            <div key={biz.id} style={{ backgroundColor: isDowntown ? '#f0f7ff' : 'white', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: isFeatured ? '2px solid ' + meta.color : isDowntown ? '1px solid #93c5fd' : '1px solid #f1f5f9' }}>
              {isFeatured && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Star size={12} color={meta.color} fill={meta.color} /><span style={{ fontSize: '11px', fontWeight: 700, color: meta.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Featured</span></div>}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', backgroundColor: meta.bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={24} color={meta.color} strokeWidth={1.8} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{biz.name}</span>
                    {biz.is_verified && <CheckCircle size={15} color='#0f3460' fill='#0f3460' />}
                  </div>
                  {biz.description && <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>{biz.description}</p>}
                </div>
              </div>
              {biz.address && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} color='#94a3b8' strokeWidth={2} /><span style={{ fontSize: '13px', color: '#64748b' }}>{biz.address}</span></div>}
              {!biz.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f8fafc', borderRadius: '10px', padding: '10px 12px', border: '1px dashed #cbd5e1' }}><Clock size={14} color='#94a3b8' /><span style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>Call info coming soon</span></div>}
              {biz.phone && <a href={'tel:' + biz.phone} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', backgroundColor: '#16a34a', borderRadius: '14px', height: '52px', minHeight: 0, color: 'white', fontSize: '17px', fontWeight: 700, textDecoration: 'none', width: '100%' }}><Phone size={18} strokeWidth={2.5} />{biz.phone}</a>}
              {biz.latitude && biz.longitude && <button onClick={() => takeMeThere(biz.address)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: isDowntown ? '#1e40af' : '#0f3460', borderRadius: '14px', height: '48px', minHeight: 0, color: 'white', fontSize: '15px', fontWeight: 700, border: 'none', cursor: 'pointer', width: '100%' }}><Navigation size={17} strokeWidth={2.5} />Take Me There</button>}
              {biz.is_claimed
                ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', height: '36px' }}><CheckCircle size={14} color='#16a34a' /><span style={{ fontSize: '13px', color: '#16a34a', fontWeight: 600 }}>Verified Owner</span></div>
                : <button onClick={() => setClaimBiz({id: biz.id, name: biz.name})} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#fbbf24', border: 'none', borderRadius: '12px', height: '44px', minHeight: 0, color: '#78350f', fontSize: '14px', fontWeight: 700, cursor: 'pointer', width: '100%', boxShadow: '0 2px 8px rgba(251,191,36,0.4)' }}><Shield size={15} strokeWidth={2.5} />Is this your business? Claim it free</button>
              }
              
              {biz.website && <a href={biz.website} target='_blank' rel='noopener noreferrer' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#f1f5f9', borderRadius: '14px', height: '44px', minHeight: 0, color: '#475569', fontSize: '14px', fontWeight: 600, textDecoration: 'none', width: '100%' }}><Globe size={16} strokeWidth={2} />Visit Website</a>}
            </div>
          )
        })}
      </div>

      <div style={{ padding: '8px 20px 4px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Missing a business? <a href='mailto:support@klickifyagency.com' style={{ color: '#e94560', fontWeight: 600, textDecoration: 'none' }}>Contact us to get listed</a></p>
      </div>
      <div style={{ padding: '4px 20px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: '12px', color: '#94a3b8' }}>Powered by <a href='https://klickifyagency.com' target='_blank' rel='noopener noreferrer' style={{ color: '#e94560', fontWeight: 600, textDecoration: 'none', display: 'inline', minHeight: 0, height: 'auto' }}>Klickify Agency</a></div>
      </div>
      {claimBiz && <ClaimModal businessId={claimBiz.id} businessName={claimBiz.name} onClose={() => setClaimBiz(null)} />}
      <BottomNav />
    </div>
  )
}