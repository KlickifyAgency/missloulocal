import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, MapPin, Users, Building2, Star } from 'lucide-react'
import BottomNav from '@/components/layout/BottomNav'

export const metadata: Metadata = {
  title: 'About MissLouLocal — Natchez, MS Local Directory',
  description: 'MissLouLocal is the hyperlocal business directory for Natchez, MS and the Miss-Lou area. Find restaurants, doctors, shops, and local services — free to search, free to list.',
  alternates: { canonical: 'https://www.missloulocal.com/about' },
}

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About MissLouLocal',
    url: 'https://www.missloulocal.com/about',
    description: 'MissLouLocal is the hyperlocal business directory serving Natchez, MS and the Miss-Lou region.',
    mainEntity: {
      '@type': 'Organization',
      name: 'MissLouLocal',
      url: 'https://www.missloulocal.com',
      areaServed: { '@type': 'City', name: 'Natchez', addressRegion: 'MS', addressCountry: 'US' },
    },
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingBottom: '80px' }}>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header style={{ backgroundColor: '#0f3460', padding: '0 20px', height: '64px', display: 'flex', alignItems: 'center', gap: '16px', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href='/' style={{ width: '40px', height: '40px', minHeight: 0, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ArrowLeft size={20} color='white' strokeWidth={2} />
        </Link>
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'white', margin: 0 }}>About MissLouLocal</h1>
      </header>

      <div style={{ padding: '32px 20px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '72px', height: '72px', backgroundColor: '#eff6ff', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '2px solid #bfdbfe' }}>
            <MapPin size={32} color='#1e40af' strokeWidth={2} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>Built for Natchez. By Natchez.</h2>
          <p style={{ fontSize: '15px', color: '#64748b', margin: 0, lineHeight: 1.7, maxWidth: '340px', display: 'inline-block' }}>
            MissLouLocal is a free hyperlocal directory connecting residents and visitors with the businesses and services that make the Miss-Lou area great.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #f1f5f9', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ width: '44px', height: '44px', backgroundColor: '#f0fdf4', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Building2 size={22} color='#16a34a' strokeWidth={1.8} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>1,100+ Local Businesses</h3>
              <p style={{ fontSize: '14px', color: '#64748b', margin: 0, lineHeight: 1.6 }}>From restaurants and shops to doctors and contractors — every business in Natchez, Vidalia, and the Miss-Lou region in one place.</p>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #f1f5f9', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ width: '44px', height: '44px', backgroundColor: '#eff6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Users size={22} color='#1e40af' strokeWidth={1.8} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>Free to Search. Free to List.</h3>
              <p style={{ fontSize: '14px', color: '#64748b', margin: 0, lineHeight: 1.6 }}>Residents find what they need at no cost. Business owners can get listed for free. We believe local commerce should be accessible to everyone.</p>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #f1f5f9', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ width: '44px', height: '44px', backgroundColor: '#fff7ed', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Star size={22} color='#ea580c' strokeWidth={1.8} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>Premium Listings Available</h3>
              <p style={{ fontSize: '14px', color: '#64748b', margin: 0, lineHeight: 1.6 }}>Businesses that want to stand out can upgrade to a premium listing — featured placement, photos, deals, and more.</p>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#0f3460', borderRadius: '20px', padding: '24px 20px', textAlign: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'white', margin: '0 0 8px' }}>Own a Business in Natchez?</h3>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', margin: '0 0 20px', lineHeight: 1.6 }}>Get your business listed in front of thousands of local residents — it's free to start.</p>
          <Link href='/add-business' style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e94560', borderRadius: '14px', padding: '14px 28px', color: 'white', fontSize: '15px', fontWeight: 700, textDecoration: 'none', minHeight: 0 }}>
            Add Your Business Free
          </Link>
        </div>

        <div style={{ textAlign: 'center', padding: '0 0 16px' }}>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 4px' }}>Questions or feedback?</p>
          <a href='mailto:info@klickifyagency.com' style={{ fontSize: '14px', color: '#e94560', fontWeight: 600, textDecoration: 'none' }}>info@klickifyagency.com</a>
          <div style={{ marginTop: '16px', fontSize: '12px', color: '#94a3b8' }}>
            Powered by <a href='https://klickifyagency.com' target='_blank' rel='noopener noreferrer' style={{ color: '#e94560', fontWeight: 600, textDecoration: 'none' }}>Klickify Agency</a>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
