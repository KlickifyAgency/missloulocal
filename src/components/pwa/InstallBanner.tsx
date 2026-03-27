'use client'
import { useEffect, useState } from 'react'
import { Download, X, Share } from 'lucide-react'

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showBanner, setShowBanner] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const standalone = window.matchMedia('(display-mode: standalone)').matches
    const wasDismissed = localStorage.getItem('pwa-dismissed') === 'true'
    
    setIsIOS(ios)
    setIsStandalone(standalone)
    setDismissed(wasDismissed)

    if (standalone || wasDismissed) return

    if (ios) {
      setTimeout(() => setShowBanner(true), 3000)
      return
    }

    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setTimeout(() => setShowBanner(true), 3000)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  function dismiss() {
    setShowBanner(false)
    localStorage.setItem('pwa-dismissed', 'true')
    setDismissed(true)
  }

  async function install() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setShowBanner(false)
    setDeferredPrompt(null)
  }

  if (!showBanner || isStandalone || dismissed) return null

  return (
    <div style={{ position: 'fixed', bottom: '80px', left: '16px', right: '16px', backgroundColor: '#0f3460', borderRadius: '20px', padding: '16px 20px', zIndex: 100, boxShadow: '0 8px 32px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', animation: 'slideUp 0.4s ease-out' }}>
      <style>{'@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}'}</style>
      
      <button onClick={dismiss} style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', minHeight: 0 }}>
        <X size={14} color='white' />
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
        <div style={{ width: '48px', height: '48px', backgroundColor: '#e94560', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <img src='/icon-192x192.png' style={{ width: '40px', height: '40px', borderRadius: '8px' }} alt='MissLouLocal' />
        </div>
        <div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'white' }}>Add to Home Screen</div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Get the full app experience — no App Store needed</div>
        </div>
      </div>

      {isIOS ? (
        <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <Share size={18} color='#e94560' strokeWidth={2} style={{ flexShrink: 0, marginTop: '2px' }} />
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: 1.5 }}>
            Tap the <strong style={{ color: 'white' }}>Share</strong> button in Safari, then tap <strong style={{ color: 'white' }}>"Add to Home Screen"</strong>
          </p>
        </div>
      ) : (
        <button onClick={install} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#e94560', borderRadius: '14px', height: '48px', minHeight: 0, color: 'white', fontSize: '16px', fontWeight: 700, border: 'none', cursor: 'pointer', width: '100%', boxShadow: '0 4px 16px rgba(233,69,96,0.4)' }}>
          <Download size={18} strokeWidth={2.5} />
          Install App — It's Free
        </button>
      )}
    </div>
  )
}
