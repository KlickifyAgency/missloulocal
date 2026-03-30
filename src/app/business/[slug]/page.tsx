import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Phone, MapPin, Globe, Star, CheckCircle, Navigation } from 'lucide-react'
import BottomNav from '@/components/layout/BottomNav'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { data: biz } = await supabase.from('businesses').select('*').eq('slug', params.slug).single()
  if (!biz) return { title: 'Business Not Found' }
  return {
    title: biz.name + ' — Natchez, MS | MissLouLocal',
    description: biz.description || biz.name + ' located at ' + biz.address + '. Find phone, hours, and directions on MissLouLocal — the Natchez & Miss-Lou local directory.',
    openGraph: {
      title: biz.name + ' | MissLouLocal',
      description: biz.description || 'Find ' + biz.name + ' on MissLouLocal — Natchez local directory',
      url: 'https://www.missloulocal.com/business/' + biz.slug,
      siteName: 'MissLouLocal',
      locale: 'en_US',
      type: 'website',
    },
    alternates: { canonical: 'https://www.missloulocal.com/business/' + biz.slug }
  }
}

export default async function BusinessPage({ params }: { params: { slug: string } }) {
  const { data: biz } = await supabase.from('businesses').select('*, categories(name, slug, color)').eq('slug', params.slug).single()
  if (!biz) notFound()

  const stars = biz.google_rating ? Math.round(biz.google_rating) : 0
  const catColor = (biz.categories as any)?.color || '#0f3460'
  const catName = (biz.categories as any)?.name || 'Local Business'
  const catSlug = (biz.categories as any)?.slug || ''

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: biz.name,
    address: { '@type': 'PostalAddress', streetAddress: biz.address, addressLocality: biz.city || 'Natchez', addressRegion: biz.state || 'MS', postalCode: biz.zip || '39120', addressCountry: 'US' },
    telephone: biz.phone,
    url: biz.website,
    ...(biz.google_rating && { aggregateRating: { '@type': 'AggregateRating', ratingValue: biz.google_rating, reviewCount: biz.google_review_count } }),
    ...(biz.latitude && { geo: { '@type': 'GeoCoordinates', latitude: biz.latitude, longitude: biz.longitude } }),
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingBottom: '80px' }}>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header style={{ backgroundColor: '#0f3460', padding: '0 20px', height: '64px', display: 'flex', alignItems: 'center', gap: '16px', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href={catSlug ? '/category/' + catSlug : '/'} style={{ width: '40px', height: '40px', minHeight: 0, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ArrowLeft size={20} color='white' strokeWidth={2} />
        </Link>
        <h1 style={{ fontSize: '17px', fontWeight: 700, color: 'white', margin: 0, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{biz.name}</h1>
      </header>

      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: biz.tier === 'premium' ? '2px solid ' + catColor : '1px solid #f1f5f9' }}>
          
          <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9' }}>
            {biz.tier === 'premium' && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', backgroundColor: '#e94560', borderRadius: '20px', padding: '4px 12px', marginBottom: '12px' }}>
                <Star size={11} color='white' fill='white' />
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'white', textTransform: 'uppercase' as const, letterSpacing: '1px' }}>Premium Listing</span>
              </div>
            )}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: catColor + '15', borderRadius: '20px', padding: '4px 12px', marginBottom: '12px', marginLeft: biz.tier === 'premium' ? '8px' : '0' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: catColor }}>{catName}</span>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px', lineHeight: 1.2 }}>{biz.name}</h2>
            {biz.is_verified && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <CheckCircle size={16} color='#16a34a' fill='#16a34a' />
                <span style={{ fontSize: '13px', color: '#16a34a', fontWeight: 600 }}>Verified Owner</span>
              </div>
            )}
            {biz.google_rating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <span style={{ fontSize: '16px', color: '#f59e0b' }}>{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{biz.google_rating}</span>
                <span style={{ fontSize: '13px', color: '#64748b' }}>({biz.google_review_count?.toLocaleString()} reviews)</span>
                <img src='https://www.google.com/favicon.ico' alt='Google' style={{ width: '14px', height: '14px' }} />
              </div>
            )}
            {biz.description && <p style={{ fontSize: '15px', color: '#64748b', margin: 0, lineHeight: 1.7 }}>{biz.description}</p>}
          </div>

          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {biz.address && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <MapPin size={18} color={catColor} strokeWidth={2} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '15px', color: '#374151', lineHeight: 1.5 }}>{biz.address}</span>
              </div>
            )}
            {biz.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Phone size={18} color={catColor} strokeWidth={2} style={{ flexShrink: 0 }} />
                <a href={'tel:' + biz.phone} style={{ fontSize: '15px', color: '#374151', textDecoration: 'none', fontWeight: 600 }}>{biz.phone}</a>
              </div>
            )}
            {biz.website && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Globe size={18} color={catColor} strokeWidth={2} style={{ flexShrink: 0 }} />
                <a href={biz.website} target='_blank' rel='noopener noreferrer' style={{ fontSize: '15px', color: catColor, textDecoration: 'none', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{biz.website.replace(/https?:\/\//, '')}</a>
              </div>
            )}
          </div>

          <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {biz.phone && (
              <a href={'tel:' + biz.phone} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', backgroundColor: catColor, borderRadius: '14px', height: '56px', minHeight: 0, color: 'white', fontSize: '17px', fontWeight: 800, textDecoration: 'none', width: '100%' }}>
                <Phone size={20} strokeWidth={2.5} /> Call Now
              </a>
            )}
            {biz.latitude && biz.longitude && (
              <a href={'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(biz.address || '')} target='_blank' rel='noopener noreferrer' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', backgroundColor: '#f1f5f9', borderRadius: '14px', height: '50px', minHeight: 0, color: '#374151', fontSize: '15px', fontWeight: 700, textDecoration: 'none', width: '100%' }}>
                <Navigation size={18} strokeWidth={2} /> Take Me There
              </a>
            )}
            {biz.website && (
              <a href={biz.website} target='_blank' rel='noopener noreferrer' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', backgroundColor: '#f1f5f9', borderRadius: '14px', height: '50px', minHeight: 0, color: '#374151', fontSize: '15px', fontWeight: 700, textDecoration: 'none', width: '100%' }}>
                <Globe size={18} strokeWidth={2} /> Visit Website
              </a>
            )}
            {biz.google_place_id && (
              <a href={'https://search.google.com/local/writereview?placeid=' + biz.google_place_id} target='_blank' rel='noopener noreferrer' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', backgroundColor: '#fff8f1', border: '1px solid #fed7aa', borderRadius: '14px', height: '50px', minHeight: 0, color: '#ea580c', fontSize: '15px', fontWeight: 700, textDecoration: 'none', width: '100%' }}>
                <Star size={18} strokeWidth={2} /> Write a Google Review
              </a>
            )}
          </div>
        </div>

        <div style={{ marginTop: '16px', backgroundColor: '#f0f9ff', borderRadius: '16px', padding: '16px', border: '1px solid #bae6fd', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: '#0369a1', margin: '0 0 8px' }}>Is this your business?</p>
          <Link href={'/?claim=' + biz.slug} style={{ fontSize: '14px', fontWeight: 700, color: '#0369a1', textDecoration: 'none' }}>Claim this listing for free →</Link>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}