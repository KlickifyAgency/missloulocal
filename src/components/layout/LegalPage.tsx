import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import BottomNav from '@/components/layout/BottomNav'

export default function LegalPage({ title, html }: { title: string; html: string }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingBottom: '80px' }}>
      <header style={{ backgroundColor: '#0f3460', padding: '0 20px', height: '64px', display: 'flex', alignItems: 'center', gap: '16px', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href='/' aria-label='Back to home' style={{ width: '40px', height: '40px', minHeight: 0, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ArrowLeft size={20} color='white' strokeWidth={2} />
        </Link>
        <span style={{ fontSize: '18px', fontWeight: 700, color: 'white' }}>{title}</span>
      </header>
      <div className='legal-body' style={{ padding: '24px 20px', maxWidth: '760px', margin: '0 auto', color: '#334155', fontSize: '15px', lineHeight: 1.7, overflowWrap: 'anywhere' }} dangerouslySetInnerHTML={{ __html: html }} />
      <BottomNav />
    </div>
  )
}
