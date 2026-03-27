'use client'
import { useEffect, useState } from 'react'
import { ArrowLeft, CalendarDays, MapPin, Clock, ExternalLink, Star } from 'lucide-react'
import Link from 'next/link'
import BottomNav from '@/components/layout/BottomNav'

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

function isToday(dateStr: string) {
  const d = new Date(dateStr)
  const today = new Date()
  return d.toDateString() === today.toDateString()
}

function isThisWeek(dateStr: string) {
  const d = new Date(dateStr)
  const today = new Date()
  const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  return d >= today && d <= weekFromNow
}

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/events')
      .then(r => r.json())
      .then(data => { setEvents(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const featured = events.filter(e => e.is_featured)
  const regular = events.filter(e => !e.is_featured)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingBottom: '80px' }}>
      <header style={{ backgroundColor: '#0f3460', padding: '0 20px', height: '64px', display: 'flex', alignItems: 'center', gap: '16px', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href='/' style={{ width: '40px', height: '40px', minHeight: 0, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ArrowLeft size={20} color='white' strokeWidth={2} />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', backgroundColor: '#db2777', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CalendarDays size={18} color='white' strokeWidth={2} />
          </div>
          <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'white', margin: 0 }}>Local Events</h1>
        </div>
      </header>

      <div style={{ backgroundColor: '#fdf2f8', borderBottom: '1px solid #f9a8d4', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '14px', color: '#db2777', fontWeight: 600 }}>{loading ? 'Loading...' : events.length + ' upcoming events'}</span>
        <span style={{ fontSize: '13px', color: '#64748b' }}>Natchez & Miss-Lou</span>
      </div>

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid #db2777', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
            <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
            <p style={{ fontSize: '16px', color: '#64748b', margin: 0 }}>Loading events...</p>
          </div>
        )}

        {!loading && events.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <CalendarDays size={32} color='#db2777' strokeWidth={1.5} />
            <p style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '16px 0 8px' }}>No upcoming events</p>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Check back soon for new events!</p>
          </div>
        )}

        {featured.length > 0 && !loading && (
          <>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#db2777', textTransform: 'uppercase', letterSpacing: '1px', margin: '4px 0 0' }}>Featured Events</p>
            {featured.map((event: any) => (
              <div key={event.id} style={{ background: 'linear-gradient(135deg, #831843 0%, #9d174d 100%)', borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 8px 24px rgba(131,24,67,0.25)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: '#db2777', borderRadius: '20px', padding: '4px 10px' }}>
                    <Star size={11} color='white' fill='white' />
                    <span style={{ fontSize: '11px', fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: '1px' }}>Featured</span>
                  </div>
                  {isThisWeek(event.starts_at) && (
                    <div style={{ backgroundColor: '#fbbf24', borderRadius: '20px', padding: '4px 10px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#78350f', textTransform: 'uppercase', letterSpacing: '0.5px' }}>This Week</span>
                    </div>
                  )}
                </div>
                <h2 style={{ fontSize: '19px', fontWeight: 800, color: 'white', margin: 0, lineHeight: 1.3 }}>{event.title}</h2>
                {event.description && <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', margin: 0, lineHeight: 1.6 }}>{event.description}</p>}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CalendarDays size={14} color='rgba(255,255,255,0.6)' />
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>{formatDate(event.starts_at)}{event.ends_at && event.ends_at !== event.starts_at ? ' — ' + formatDate(event.ends_at) : ''}</span>
                  </div>
                  {event.starts_at && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={14} color='rgba(255,255,255,0.6)' /><span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>{formatTime(event.starts_at)}</span></div>}
                  {event.location && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={14} color='rgba(255,255,255,0.6)' /><span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>{event.location}</span></div>}
                </div>
                {event.ticket_url && (
                  <a href={event.ticket_url} target='_blank' rel='noopener noreferrer' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: 'white', borderRadius: '14px', height: '48px', minHeight: 0, color: '#831843', fontSize: '15px', fontWeight: 700, textDecoration: 'none', width: '100%' }}>
                    <ExternalLink size={16} strokeWidth={2} />
                    More Info & Tickets
                  </a>
                )}
              </div>
            ))}
          </>
        )}

        {regular.length > 0 && !loading && (
          <>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', margin: '8px 0 0' }}>Upcoming Events</p>
            {regular.map((event: any) => (
              <div key={event.id} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ width: '48px', height: '48px', backgroundColor: '#fdf2f8', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: '16px', fontWeight: 800, color: '#db2777', lineHeight: 1 }}>{new Date(event.starts_at).getDate()}</span>
                    <span style={{ fontSize: '10px', color: '#db2777', textTransform: 'uppercase', fontWeight: 600 }}>{new Date(event.starts_at).toLocaleString('en-US', { month: 'short' })}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px', lineHeight: 1.3 }}>{event.title}</h3>
                    {isToday(event.starts_at) && <span style={{ fontSize: '11px', fontWeight: 700, color: '#db2777', backgroundColor: '#fdf2f8', padding: '2px 8px', borderRadius: '20px' }}>Today</span>}
                    {isThisWeek(event.starts_at) && !isToday(event.starts_at) && <span style={{ fontSize: '11px', fontWeight: 700, color: '#0891b2', backgroundColor: '#ecfeff', padding: '2px 8px', borderRadius: '20px' }}>This Week</span>}
                  </div>
                </div>
                {event.description && <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>{event.description}</p>}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={13} color='#94a3b8' /><span style={{ fontSize: '13px', color: '#64748b' }}>{formatTime(event.starts_at)}</span></div>
                  {event.location && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={13} color='#94a3b8' /><span style={{ fontSize: '13px', color: '#64748b' }}>{event.location}</span></div>}
                </div>
                {event.ticket_url && (
                  <a href={event.ticket_url} target='_blank' rel='noopener noreferrer' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#fdf2f8', borderRadius: '12px', height: '44px', minHeight: 0, color: '#db2777', fontSize: '14px', fontWeight: 600, textDecoration: 'none', width: '100%', border: '1px solid #f9a8d4' }}>
                    <ExternalLink size={15} strokeWidth={2} />
                    More Info
                  </a>
                )}
              </div>
            ))}
          </>
        )}

        <div style={{ backgroundColor: '#eff6ff', borderRadius: '16px', padding: '16px', border: '1px solid #bfdbfe', marginTop: '8px' }}>
          <p style={{ fontSize: '14px', fontWeight: 700, color: '#1e40af', margin: '0 0 4px' }}>Have an event to share?</p>
          <p style={{ fontSize: '13px', color: '#3b82f6', margin: 0 }}>Email us at <a href='mailto:support@klickifyagency.com' style={{ color: '#1e40af', fontWeight: 600 }}>events@missloulocal.com</a> and we will add it to the calendar.</p>
        </div>
      </div>

      <div style={{ padding: '4px 20px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: '12px', color: '#94a3b8' }}>Powered by <a href='https://klickifyagency.com' target='_blank' rel='noopener noreferrer' style={{ color: '#e94560', fontWeight: 600, textDecoration: 'none' }}>Klickify Agency</a></div>
      </div>
      <BottomNav />
    </div>
  )
}