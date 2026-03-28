'use client'
import { useEffect, useState } from 'react'
import { ArrowLeft, Star, Phone, MapPin, Clock, Tag, Navigation, Gift, CheckCircle, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import BottomNav from '@/components/layout/BottomNav'

function timeLeft(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days > 1) return days + ' days left'
  if (days === 1) return 'Last day!'
  return 'Expires soon!'
}

function takeMeThere(address: string) {
  window.open('https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(address), '_blank')
}

function DealCard({ deal, featured }: { deal: any, featured: boolean }) {
  const [redeemed, setRedeemed] = useState(false)
  const [redeeming, setRedeeming] = useState(false)
  const biz = deal.businesses

  async function redeem() {
    setRedeeming(true)
    try {
      await fetch('/api/deals/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deal_id: deal.id })
      })
      setRedeemed(true)
    } catch(e) {}
    setRedeeming(false)
  }

  if (featured) return (
    <div style={{ background: 'linear-gradient(135deg, #7c2d12 0%, #9a3412 100%)', borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', boxShadow: '0 8px 24px rgba(124,45,18,0.25)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', backgroundColor: '#ea580c', borderRadius: '50%', opacity: 0.15 }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#ea580c', borderRadius: '20px', padding: '5px 12px' }}>
          <Star size={12} color='white' fill='white' />
          <span style={{ fontSize: '11px', fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: '1px' }}>Featured Deal</span>
        </div>
        <div style={{ backgroundColor: '#fbbf24', borderRadius: '20px', padding: '5px 14px' }}>
          <span style={{ fontSize: '15px', fontWeight: 900, color: '#78350f' }}>{deal.discount_text}</span>
        </div>
      </div>
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'white', margin: '0 0 4px', lineHeight: 1.2 }}>{deal.title}</h2>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.6 }}>{deal.description}</p>
      </div>
      {biz && (
        <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '15px', fontWeight: 700, color: 'white' }}>{biz.name}</span>
          {biz.address && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={13} color='rgba(255,255,255,0.6)' /><span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{biz.address}</span></div>}
        </div>
      )}
      {deal.expires_at && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={13} color='rgba(255,255,255,0.5)' />
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>{timeLeft(deal.expires_at)}</span>
        </div>
      )}
      <div style={{ display: 'flex', gap: '10px' }}>
        {biz?.phone && <a href={'tel:' + biz.phone} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#ea580c', borderRadius: '14px', height: '52px', minHeight: 0, color: 'white', fontSize: '16px', fontWeight: 700, textDecoration: 'none' }}><Phone size={18} strokeWidth={2.5} />Call Now</a>}
        {biz?.address && <button onClick={() => takeMeThere(biz.address)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '14px', height: '52px', minHeight: 0, color: 'white', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}><Navigation size={16} />Take Me There</button>}
      </div>
      {redeemed ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: 'rgba(74,222,128,0.2)', borderRadius: '14px', height: '52px', border: '1px solid rgba(74,222,128,0.4)' }}>
          <CheckCircle size={18} color='#4ade80' fill='#4ade80' />
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#4ade80' }}>Deal Saved! Show this at the business</span>
        </div>
      ) : (
        <button onClick={redeem} disabled={redeeming} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#4ade80', borderRadius: '14px', height: '52px', minHeight: 0, color: '#14532d', fontSize: '16px', fontWeight: 800, border: 'none', cursor: 'pointer', width: '100%', boxShadow: '0 4px 12px rgba(74,222,128,0.3)' }}>
          <Gift size={18} strokeWidth={2.5} />{redeeming ? 'Saving...' : 'Redeem This Deal'}
        </button>
      )}
    </div>
  )

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{deal.title}</h3>
          {biz && <span style={{ fontSize: '13px', color: '#64748b' }}>{biz.name}</span>}
        </div>
        <div style={{ backgroundColor: '#fff7ed', borderRadius: '12px', padding: '6px 12px', flexShrink: 0 }}>
          <span style={{ fontSize: '14px', fontWeight: 900, color: '#ea580c' }}>{deal.discount_text}</span>
        </div>
      </div>
      {deal.description && <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>{deal.description}</p>}
      {biz?.address && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={13} color='#94a3b8' /><span style={{ fontSize: '13px', color: '#64748b' }}>{biz.address}</span></div>}
      {deal.expires_at && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={13} color='#94a3b8' /><span style={{ fontSize: '12px', color: '#94a3b8' }}>{timeLeft(deal.expires_at)}</span></div>}
      <div style={{ display: 'flex', gap: '10px' }}>
        {biz?.phone && <a href={'tel:' + biz.phone} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#16a34a', borderRadius: '14px', height: '50px', minHeight: 0, color: 'white', fontSize: '16px', fontWeight: 700, textDecoration: 'none' }}><Phone size={17} strokeWidth={2.5} />Call</a>}
        {biz?.address && <button onClick={() => takeMeThere(biz.address)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#0f3460', border: 'none', borderRadius: '14px', height: '50px', minHeight: 0, color: 'white', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}><Navigation size={16} />Take Me There</button>}
      </div>
      {redeemed ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#f0fdf4', borderRadius: '12px', height: '46px', border: '1px solid #bbf7d0' }}>
          <CheckCircle size={16} color='#16a34a' fill='#16a34a' />
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#15803d' }}>Deal Saved! Show this at the business</span>
        </div>
      ) : (
        <button onClick={redeem} disabled={redeeming} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', height: '46px', minHeight: 0, color: '#15803d', fontSize: '14px', fontWeight: 700, cursor: 'pointer', width: '100%' }}>
          <Gift size={16} strokeWidth={2.5} />{redeeming ? 'Saving...' : 'Redeem This Deal'}
        </button>
      )}
    </div>
  )
}

export default function DealsPage() {
  const [deals, setDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/deals')
      .then(r => r.json())
      .then(data => { setDeals(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const featured = deals.filter(d => d.is_featured)
  const regular = deals.filter(d => !d.is_featured)

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
          <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'white', margin: 0 }}>Today's Deals</h1>
        </div>
      </header>

      <div style={{ backgroundColor: '#fff7ed', borderBottom: '1px solid #fed7aa', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '14px', color: '#ea580c', fontWeight: 600 }}>{loading ? 'Loading...' : deals.length + ' active deals'}</span>
        <span style={{ fontSize: '13px', color: '#64748b' }}>Natchez & Miss-Lou</span>
      </div>

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid #ea580c', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
            <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
            <p style={{ fontSize: '16px', color: '#64748b', margin: 0 }}>Loading deals...</p>
          </div>
        )}

        {!loading && deals.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <Tag size={32} color='#ea580c' strokeWidth={1.5} />
            <p style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '16px 0 8px' }}>No deals right now</p>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Check back soon!</p>
          </div>
        )}

        {featured.length > 0 && !loading && (
          <>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '1px', margin: '4px 0 0' }}>Featured Deals</p>
            {featured.map(deal => <DealCard key={deal.id} deal={deal} featured={true} />)}
          </>
        )}

        {regular.length > 0 && !loading && (
          <>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', margin: '8px 0 0' }}>More Deals</p>
            {regular.map(deal => <DealCard key={deal.id} deal={deal} featured={false} />)}
          </>
        )}

        <div style={{ backgroundColor: '#eff6ff', borderRadius: '16px', padding: '20px', border: '1px solid #bfdbfe', marginTop: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ width: '36px', height: '36px', backgroundColor: '#1e40af', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MessageCircle size={18} color='white' strokeWidth={2} />
            </div>
            <div>
              <p style={{ fontSize: '15px', fontWeight: 700, color: '#1e3a8a', margin: 0 }}>Have a deal to share?</p>
              <p style={{ fontSize: '13px', color: '#3b82f6', margin: 0 }}>We will publish it for you — free for now!</p>
            </div>
          </div>
          <p style={{ fontSize: '13px', color: '#1e40af', margin: '0 0 14px', lineHeight: 1.5 }}>Want to reach locals and tourists with a special offer? Contact us and we will take care of everything.</p>
          <a href='mailto:support@klickifyagency.com?subject=I want to add a deal to MissLouLocal' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#1e40af', borderRadius: '12px', height: '48px', minHeight: 0, color: 'white', fontSize: '15px', fontWeight: 700, textDecoration: 'none', width: '100%' }}>
            Contact Us — It is Free
          </a>
        </div>

      </div>

      <div style={{ padding: '4px 20px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: '12px', color: '#94a3b8' }}>Powered by <a href='https://klickifyagency.com' target='_blank' rel='noopener noreferrer' style={{ color: '#e94560', fontWeight: 600, textDecoration: 'none' }}>Klickify Agency</a></div>
      </div>
      <BottomNav />
    </div>
  )
}