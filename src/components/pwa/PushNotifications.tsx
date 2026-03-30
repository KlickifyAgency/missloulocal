'use client'
import { useState, useEffect } from 'react'
import { Bell, BellOff, X } from 'lucide-react'

export default function PushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      setPermission(Notification.permission)
      if (Notification.permission === 'default') {
        setTimeout(() => setShow(true), 5000)
      }
    }
  }, [])

  async function subscribe() {
    setLoading(true)
    try {
      const permission = await Notification.requestPermission()
      setPermission(permission)
      if (permission !== 'granted') { setShow(false); setLoading(false); return }

      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      })

      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: sub, topics: ['pets', 'yardsales', 'events', 'deals'] })
      })
      setShow(false)
    } catch(e) { console.error(e) }
    setLoading(false)
  }

  if (!show || permission !== 'default') return null

  return (
    <div style={{ position: 'fixed', bottom: '80px', left: '16px', right: '16px', zIndex: 100, backgroundColor: '#0f3460', borderRadius: '20px', padding: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', maxWidth: '420px', margin: '0 auto' }}>
      <button type='button' onClick={() => setShow(false)} style={{ position: 'absolute', top: '12px', right: '12px', width: '28px', height: '28px', minHeight: 0, backgroundColor: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <X size={14} color='white' />
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <div style={{ width: '44px', height: '44px', backgroundColor: '#e94560', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Bell size={22} color='white' />
        </div>
        <div>
          <p style={{ fontSize: '15px', fontWeight: 700, color: 'white', margin: 0 }}>Stay in the loop!</p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>Get alerts for lost pets, yard sales & local events</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button type='button' onClick={() => setShow(false)} style={{ flex: 1, height: '44px', minHeight: 0, backgroundColor: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '14px', cursor: 'pointer' }}>
          Not now
        </button>
        <button type='button' onClick={subscribe} disabled={loading} style={{ flex: 2, height: '44px', minHeight: 0, backgroundColor: '#e94560', border: 'none', borderRadius: '12px', color: 'white', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <Bell size={16} /> {loading ? 'Enabling...' : 'Enable Notifications'}
        </button>
      </div>
    </div>
  )
}