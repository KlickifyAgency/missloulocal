import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ChevronRight, BookOpen } from 'lucide-react'
import BottomNav from '@/components/layout/BottomNav'
import { GUIDES } from '@/lib/guides'

export const metadata: Metadata = {
  title: 'Local Guides — Natchez, MS | MissLouLocal',
  description: 'Local guides for Natchez, MS — best restaurants, things to do, walking tours, doctors, home services, and more. Updated 2026.',
  alternates: { canonical: 'https://www.missloulocal.com/guides' },
  openGraph: {
    title: 'Local Guides — Natchez, MS | MissLouLocal',
    description: 'Local guides for Natchez, MS — best restaurants, things to do, walking tours, doctors, home services, and more.',
    url: 'https://www.missloulocal.com/guides',
    siteName: 'MissLouLocal',
    locale: 'en_US',
    type: 'website',
  },
}

const guideColors: Record<string, { color: string; bg: string }> = {
  'best-restaurants-natchez-ms':              { color: '#dc2626', bg: '#fef2f2' },
  'things-to-do-natchez-ms':                  { color: '#0369a1', bg: '#e0f2fe' },
  'walking-tour-downtown-natchez':            { color: '#1e40af', bg: '#eff6ff' },
  'best-doctors-natchez-ms':                  { color: '#16a34a', bg: '#f0fdf4' },
  'best-home-services-natchez-ms':            { color: '#2563eb', bg: '#eff6ff' },
  'natchez-farmers-market-guide':             { color: '#65a30d', bg: '#f7fee7' },
  'best-auto-repair-natchez-ms':              { color: '#475569', bg: '#f8fafc' },
  'best-shopping-natchez-ms':                 { color: '#9333ea', bg: '#faf5ff' },
  'best-hair-salons-natchez-ms':              { color: '#e11d48', bg: '#fff1f2' },
  'best-lawyers-financial-services-natchez-ms': { color: '#0891b2', bg: '#ecfeff' },
  'best-hotels-real-estate-natchez-ms':       { color: '#ea580c', bg: '#fff7ed' },
  'churches-natchez-ms':                      { color: '#7c3aed', bg: '#faf5ff' },
  'arts-education-natchez-ms':                { color: '#f59e0b', bg: '#fffbeb' },
  'best-vets-pet-services-natchez-ms':        { color: '#d97706', bg: '#fffbeb' },
  'funeral-homes-natchez-ms':                 { color: '#6b7280', bg: '#f9fafb' },
  'best-gyms-fitness-natchez-ms':             { color: '#f97316', bg: '#fff7ed' },
  'pharmacies-natchez-ms':                    { color: '#0891b2', bg: '#ecfeff' },
}

export default function GuidesIndexPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'MissLouLocal Local Guides — Natchez, MS',
    description: 'Local guides for Natchez, MS covering restaurants, attractions, walking tours, healthcare, home services, and farmers market.',
    url: 'https://www.missloulocal.com/guides',
    hasPart: GUIDES.map(g => ({
      '@type': 'Article',
      name: g.h1,
      url: 'https://www.missloulocal.com/guides/' + g.slug,
      description: g.metaDescription,
    })),
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingBottom: '80px' }}>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header style={{ backgroundColor: '#0f3460', padding: '0 20px', height: '64px', display: 'flex', alignItems: 'center', gap: '16px', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href='/' style={{ width: '40px', height: '40px', minHeight: 0, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ArrowLeft size={20} color='white' strokeWidth={2} />
        </Link>
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'white', margin: 0 }}>Local Guides</h1>
      </header>

      <div style={{ padding: '28px 20px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '64px', height: '64px', backgroundColor: '#eff6ff', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', border: '2px solid #bfdbfe' }}>
            <BookOpen size={28} color='#1e40af' strokeWidth={1.8} />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '0 0 10px' }}>Natchez, MS Local Guides</h2>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0, lineHeight: 1.6, maxWidth: '320px', display: 'inline-block' }}>
            Everything you need to know about living in and visiting the Miss-Lou area — written by locals.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {GUIDES.map(guide => {
            const colors = guideColors[guide.slug] ?? { color: '#0f3460', bg: '#eff6ff' }
            const formattedDate = new Date(guide.publishedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
            return (
              <Link
                key={guide.slug}
                href={'/guides/' + guide.slug}
                style={{ backgroundColor: 'white', borderRadius: '16px', padding: '18px', border: '1px solid #e2e8f0', textDecoration: 'none', display: 'block', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ width: '46px', height: '46px', backgroundColor: colors.bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid ' + colors.color + '33' }}>
                    <BookOpen size={22} color={colors.color} strokeWidth={1.8} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: colors.color, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                      Local Guide · {formattedDate}
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', lineHeight: 1.3, marginBottom: '6px' }}>{guide.h1}</div>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {guide.metaDescription}
                    </p>
                  </div>
                  <ChevronRight size={18} color='#cbd5e1' strokeWidth={2} style={{ flexShrink: 0, marginTop: '4px' }} />
                </div>
              </Link>
            )
          })}
        </div>

        <div style={{ marginTop: '28px', backgroundColor: '#0f3460', borderRadius: '20px', padding: '22px 20px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', margin: '0 0 16px', lineHeight: 1.6 }}>
            Own a business in Natchez? Get listed free.
          </p>
          <Link href='/add-business' style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#e94560', borderRadius: '14px', padding: '13px 24px', color: 'white', fontSize: '15px', fontWeight: 700, textDecoration: 'none', minHeight: 0 }}>
            Add Your Business — Free
          </Link>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
