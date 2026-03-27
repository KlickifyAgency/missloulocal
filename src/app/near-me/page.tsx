'use client'
import { useEffect, useState } from 'react'
import { ArrowLeft, Phone, MapPin, Navigation, Clock, CheckCircle, ExternalLink } from 'lucide-react'
import { Wrench, UtensilsCrossed, HeartPulse, Church, Home, CalendarDays, Scale, Car, Scissors, PawPrint, Settings, ShoppingBag, Palette, Compass } from 'lucide-react'
import Link from 'next/link'
import BottomNav from '@/components/layout/BottomNav'

const iconMap: Record<string, any> = { 'home-services': Wrench, 'restaurants-food': UtensilsCrossed, 'medical-health': HeartPulse, 'churches-community': Church, 'real-estate-rentals': Home, 'events': CalendarDays, 'legal-financial': Scale, 'transportation': Car, 'personal-care': Scissors, 'pet-services': PawPrint, 'auto-services': Settings, 'shopping-retail': ShoppingBag, 'arts-education': Palette, 'tours-entertainment': Compass }
const categoryColors: Record<string, { color: string; bg: string }> = { 'home-services': { color: '#2563eb', bg: '#eff6ff' }, 'restaurants-food': { color: '#dc2626', bg: '#fef2f2' }, 'medical-health': { color: '#16a34a', bg: '#f0fdf4' }, 'churches-community': { color: '#7c3aed', bg: '#faf5ff' }, 'real-estate-rentals': { color: '#ea580c', bg: '#fff7ed' }, 'events': { color: '#db2777', bg: '#fdf2f8' }, 'legal-financial': { color: '#0891b2', bg: '#ecfeff' }, 'transportation': { color: '#65a30d', bg: '#f7fee7' }, 'personal-care': { color: '#e11d48', bg: '#fff1f2' }, 'pet-services': { color: '#d97706', bg: '#fffbeb' }, 'auto-services': { color: '#475569', bg: '#f8fafc' }, 'shopping-retail': { color: '#9333ea', bg: '#faf5ff' }, 'arts-education': { color: '#0d9488', bg: '#f0fdfa' }, 'tours-entertainment': { color: '#0369a1', bg: '#e0f2fe' } }

const MAX_MILES = 3

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 3958.8
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

function takeMeThere(address: string) {
  if (!address) return
  window.open('https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(address), '_blank')
}

export default function NearMePage() {
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')
  const [businesses, setBusinesses] = useState<any[]>([])
  const [location, setLocation] = useState<{lat: number, lon: number} | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => { requestLocation() }, [])

  function requestLocation() {
    setStatus('loading')
    if (!navigator.geolocation) {
      setStatus('error')
      setErrorMsg('Your browser does not support location services.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lon = pos.coords.longitude
        setLocation({ lat, lon })
        fetch('/api/businesses/all')
          .then(r => r.json())
          .then(data => {
            const withDist = data
              .filter((b: any) => b.latitude && b.longitude)
              .map((b: any) => ({ ...b, distance: getDistance(lat, lon, b.latitude, b.longitude) }))
              .filter((b: any) => b.distance <= MAX_MILES)
              .sort((a: any, b: any) => a.distance - b.distance)
            const nearby = withDist.length > 0
              ? withDist
              : data
                  .filter((b: any) => b.address && b.address.toLowerCase().includes('natchez'))
                  .slice(0, 25)
                  .map((b: any) => ({ ...b, distance: null }))
            setBusinesses(nearby)
            setStatus('success')
          })
          .catch(() => { setStatus('error'); setErrorMsg('Could not load businesses. Please try again.') })
      },
      () => {
        fetch('/api/businesses/all')
          .then(r => r.json())
          .then(data => {
            const nearby = data
              .filter((b: any) => b.address && b.address.toLowerCase().includes('natchez'))
              .slice(0, 25)
              .map((b: any) => ({ ...b, distance: null }))
            setBusinesses(nearby)
            setStatus('success')
          })
          .catch(() => { setStatus('error'); setErrorMsg('Could not load businesses.') })
      },
      { timeout: 8000 }
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingBottom: '80px' }}>
      <header style={{ backgroundColor: '#0f3460', padding: '0 20px', height: '64px', display: 'flex', alignItems: 'center', gap: '16px', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href='/' style={{ width: '40px', height: '40px', minHeight: 0, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ArrowLeft size={20} color='white' strokeWidth={2} />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
          <div style={{ width: '36px', height: '36px', backgroundColor: '#e94560', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Navigation size={18} color='white' strokeWidth={2.5} />
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'white', margin: 0, lineHeight: 1 }}>Near Me</h1>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Within 3 miles</p>
          </div>
        </div>
        {location && <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', backgroundColor: '#4ade80', borderRadius: '50%' }} /><span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>GPS on</span></div>}
      </header>

      {status === 'loading' && (
        <div style={{ padding: '80px 20px', textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', border: '4px solid #e94560', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 24px', animation: 'spin 1s linear infinite' }} />
          <style>{'@keyframes spin { to { transform: rotate(360deg) } }'}</style>
          <p style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>Finding nearby businesses...</p>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Please allow location access when prompted</p>
        </div>
      )}

      {status === 'error' && (
        <div style={{ padding: '60px 20px', textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', backgroundColor: '#fef2f2', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <MapPin size={28} color='#dc2626' strokeWidth={1.5} />
          </div>
          <p style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>Location unavailable</p>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 24px' }}>{errorMsg}</p>
          <button onClick={requestLocation} style={{ backgroundColor: '#e94560', color: 'white', border: 'none', borderRadius: '14px', height: '52px', padding: '0 32px', fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}>Try Again</button>
        </div>
      )}

      {status === 'success' && (
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#0f3460' }}>{businesses.length} businesses {location ? 'within 3 miles' : 'in Natchez'}</span>
            {location && <span style={{ fontSize: '12px', color: '#94a3b8' }}>Sorted by distance</span>}
          </div>

          {businesses.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <MapPin size={28} color='#94a3b8' strokeWidth={1.5} />
              <p style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: '16px 0 8px' }}>No businesses found nearby</p>
              <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Try browsing all categories instead</p>
            </div>
          )}

          {businesses.map((biz: any) => {
            const catColor = categoryColors[biz.category_slug] ?? { color: '#0f3460', bg: '#f1f5f9' }
            const Icon = iconMap[biz.category_slug] ?? MapPin
            return (
              <div key={biz.id} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '48px', height: '48px', backgroundColor: catColor.bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={24} color={catColor.color} strokeWidth={1.8} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{biz.name}</span>
                      {biz.is_verified && <CheckCircle size={15} color='#0f3460' fill='#0f3460' />}
                    </div>
                    {biz.distance != null && (
                      <span style={{ fontSize: '12px', color: '#e94560', fontWeight: 700 }}>
                        {biz.distance < 0.1 ? 'Less than 500 ft away' : biz.distance < 1 ? (biz.distance * 5280).toFixed(0) + ' ft away' : biz.distance.toFixed(1) + ' mi away'}
                      </span>
                    )}
                  </div>
                </div>

                {biz.address && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color='#94a3b8' strokeWidth={2} />
                    <span style={{ fontSize: '13px', color: '#64748b' }}>{biz.address}</span>
                  </div>
                )}

                {!biz.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f8fafc', borderRadius: '10px', padding: '10px 12px', border: '1px dashed #cbd5e1' }}>
                    <Clock size={14} color='#94a3b8' />
                    <span style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>Directory being updated — check back soon</span>
                  </div>
                )}

                {biz.phone && (
                  <a href={'tel:' + biz.phone} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', backgroundColor: '#16a34a', borderRadius: '14px', height: '52px', minHeight: 0, color: 'white', fontSize: '17px', fontWeight: 700, textDecoration: 'none', width: '100%' }}>
                    <Phone size={18} strokeWidth={2.5} />
                    {biz.phone}
                  </a>
                )}

                {biz.address && (
                  <button onClick={() => takeMeThere(biz.address)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#0f3460', borderRadius: '14px', height: '48px', minHeight: 0, color: 'white', fontSize: '15px', fontWeight: 700, border: 'none', cursor: 'pointer', width: '100%' }}>
                    <Navigation size={17} strokeWidth={2.5} />
                    Take Me There
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      <div style={{ padding: '4px 20px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: '12px', color: '#94a3b8' }}>Powered by <a href='https://klickifyagency.com' target='_blank' rel='noopener noreferrer' style={{ color: '#e94560', fontWeight: 600, textDecoration: 'none' }}>Klickify Agency</a></div>
      </div>
      <BottomNav />
    </div>
  )
}