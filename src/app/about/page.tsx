import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import BottomNav from '@/components/layout/BottomNav'

export default function Page() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingBottom: '80px' }}>
      <header style={{ backgroundColor: '#0f3460', padding: '0 20px', height: '64px', display: 'flex', alignItems: 'center', gap: '16px', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href='/' style={{ width: '40px', height: '40px', minHeight: 0, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ArrowLeft size={20} color='white' strokeWidth={2} />
        </Link>
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'white', margin: 0 }}>About MissLouLocal</h1>
      </header>
      <div style={{ padding: '48px 20px', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', backgroundColor: '#e0f2fe', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <div style={{ width: '24px', height: '24px', backgroundColor: '#0369a1', borderRadius: '6px' }} />
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', margin: '0 0 12px' }}>About MissLouLocal</h2>
        <p style={{ fontSize: '16px', color: '#64748b', margin: '0 0 32px', lineHeight: 1.6 }}>Your local directory for Natchez and the Miss-Lou area.</p>
        <p style={{ fontSize: '14px', color: '#94a3b8', fontStyle: 'italic' }}>Coming soon — we are working on this section!</p>
      </div>
      <div style={{ padding: '4px 20px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: '12px', color: '#94a3b8' }}>Powered by <a href='https://klickifyagency.com' target='_blank' rel='noopener noreferrer' style={{ color: '#e94560', fontWeight: 600, textDecoration: 'none' }}>Klickify Agency</a></div>
      </div>
      <BottomNav />
    </div>
  )
}