'use client'
import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showBanner, setShowBanner] = useState(false)
  const [browser, setBrowser] = useState('')
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches
    const wasDismissed = localStorage.getItem('pwa-dismissed') === 'true'
    setIsStandalone(standalone)
    if (standalone || wasDismissed) return

    const ua = navigator.userAgent
    const isIOS = /iPad|iPhone|iPod/.test(ua)
    const isAndroid = /Android/.test(ua)
    const isChrome = /CriOS/.test(ua) || (/Chrome/.test(ua) && !/Edg/.test(ua))
    const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua) && !/CriOS/.test(ua)
    const isFirefox = /FxiOS/.test(ua) || /Firefox/.test(ua)

    if (isIOS && isChrome) setBrowser('ios-chrome')
    else if (isIOS && isSafari) setBrowser('ios-safari')
    else if (isIOS && isFirefox) setBrowser('ios-firefox')
    else if (isAndroid) setBrowser('android')
    else setBrowser('desktop')

    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)

    setTimeout(() => setShowBanner(true), 4000)
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

  const steps: Record<string, { title: string; steps: string[] }> = {
    'ios-chrome': {
      title: 'iPhone — Chrome',
      steps: [
        'Tap the Share button (box with arrow) at the bottom of Chrome',
        'Scroll down and tap "Add to Home Screen"',
        'Tap "Add" in the top right corner'
      ]
    },
    'ios-safari': {
      title: 'iPhone — Safari',
      steps: [
        'Tap the Share button at the bottom of Safari',
        'Tap "Add to Home Screen"',
        'Tap "Add" in the top right corner'
      ]
    },
    'ios-firefox': {
      title: 'iPhone — Firefox',
      steps: [
        'Tap the 3 lines menu at the bottom right',
        'Tap "Share"',
        'Tap "Add to Home Screen"'
      ]
    },
    'android': {
      title: 'Android — Chrome',
      steps: [
        'Tap the 3 dots menu at the top right',
        'Tap "Add to Home Screen"',
        'Tap "Add" to confirm'
      ]
    }
  }

  const instruction = steps[browser]

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

      {deferredPrompt ? (
        <button onClick={install} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', backgroundColor: '#e94560', borderRadius: '14px', height: '52px', minHeight: 0, color: 'white', fontSize: '16px', fontWeight: 700, border: 'none', cursor: 'pointer', width: '100%', boxShadow: '0 4px 16px rgba(233,69,96,0.4)' }}>
          <Download size={18} strokeWidth={2.5} />
          Install App — It is Free
        </button>
      ) : instruction ? (
        <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px 14px' }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>{instruction.title}</p>
          {instruction.steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: i < instruction.steps.length - 1 ? '8px' : 0 }}>
              <div style={{ width: '22px', height: '22px', backgroundColor: '#e94560', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                <span style={{ color: 'white', fontSize: '11px', fontWeight: 700 }}>{i + 1}</span>
              </div>
              <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', lineHeight: 1.4 }}>{step}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}