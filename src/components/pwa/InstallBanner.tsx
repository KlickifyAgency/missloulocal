'use client'
import { useEffect, useState } from 'react'
import { Download, X, Share } from 'lucide-react'

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showBanner, setShowBanner] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isAndroid, setIsAndroid] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const android = /Android/.test(navigator.userAgent)
    const standalone = window.matchMedia('(display-mode: standalone)').matches
    const wasDismissed = localStorage.getItem('pwa-dismissed') === 'true'

    setIsIOS(ios)
    setIsAndroid(android)
    setIsStandalone(standalone)

    if (standalone || wasDismissed) return

    if (ios) {
      setTimeout(() => setShowBanner(true), 4000)
      return
    }

    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setTimeout(() => setShowBanner(true), 4000)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  function dismiss() {
    setShowBanner(false)
    localStorage.setItem('pwa-dismissed', 'true')
  }

  async function install() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setShowBanner(false)
    setDeferredPrompt(null)
  }

  if (!showBanner || isStandalone) return null

  return (
    <div style={{ position: 'fixed', bottom: '80px', left: '16px', right: '16px', backgroundColor: '#0f3460', borderRadius: '20px', padding: '16px 20px', zIndex: 100, boxShadow: '0 8px 32px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', animation: 'slideUp 0.4s ease-out' }}>
      <style>{'@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}'}</style>

      <button onClick={dismiss} style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
        <X size={14} color='white' />
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
        <img src='/icon-192x192.png' style={{ width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0 }} alt='MissLouLocal' />
        <div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'white', marginBottom: '2px' }}>Add to Home Screen</div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Free app — no App Store needed</div>
        </div>
      </div>

      {isIOS && (
        <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px 14px' }}>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>iPhone / Safari</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div style={{ width: '24px', height: '24px', backgroundColor: '#e94560', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: 'white', fontSize: '12px', fontWeight: 700 }}>1</span>
            </div>
            <span style={{ fontSize: '14px', color: 'white' }}>Tap <strong>Share</strong> button at bottom of Safari</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '24px', height: '24px', backgroundColor: '#e94560', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: 'white', fontSize: '12px', fontWeight: 700 }}>2</span>
            </div>
            <span style={{ fontSize: '14px', color: 'white' }}>Tap <strong>"Add to Home Screen"</strong></span>
          </div>
        </div>
      )}

      {isAndroid && !deferredPrompt && (
        <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px 14px' }}>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>Android / Chrome</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div style={{ width: '24px', height: '24px', backgroundColor: '#e94560', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: 'white', fontSize: '12px', fontWeight: 700 }}>1</span>
            </div>
            <span style={{ fontSize: '14px', color: 'white' }}>Tap the <strong>3 dots menu</strong> (top right)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '24px', height: '24px', backgroundColor: '#e94560', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: 'white', fontSize: '12px', fontWeight: 700 }}>2</span>
            </div>
            <span style={{ fontSize: '14px', color: 'white' }}>Tap <strong>"Add to Home Screen"</strong></span>
          </div>
        </div>
      )}

      {deferredPrompt && (
        <button onClick={install} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', backgroundColor: '#e94560', borderRadius: '14px', height: '52px', minHeight: 0, color: 'white', fontSize: '16px', fontWeight: 700, border: 'none', cursor: 'pointer', width: '100%', boxShadow: '0 4px 16px rgba(233,69,96,0.4)' }}>
          <Download size={18} strokeWidth={2.5} />
          Install App — It is Free
        </button>
      )}
    </div>
  )
}