import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Phone, MapPin, Clock, CheckCircle, Star, Globe, Navigation } from 'lucide-react'
import { Wrench, UtensilsCrossed, HeartPulse, Car, ShoppingBag, Scissors, Scale, Building2, Church, Palette, Compass, PawPrint, Footprints, ShoppingBasket, ShoppingCart, Heart, Dumbbell, Ribbon, Pill } from 'lucide-react'
import BottomNav from '@/components/layout/BottomNav'
import CategoryClaimButton from '@/components/category/CategoryClaimButton'

const iconMap: Record<string, any> = {
  'restaurants-food': UtensilsCrossed, 'medical-health': HeartPulse, 'home-services': Wrench,
  'auto-services': Car, 'shopping-retail': ShoppingBag, 'personal-care': Scissors,
  'legal-financial': Scale, 'real-estate-hotels': Building2, 'churches-faith': Church,
  'arts-education': Palette, 'tours-attractions': Compass, 'pet-services': PawPrint,
  'walking-downtown': Footprints, 'farmers-market': ShoppingBasket, 'yard-sales': ShoppingCart,
  'find-my-pet': Heart, 'fitness-wellness': Dumbbell, 'funeral-services': Ribbon, 'pharmacy': Pill,
}

const categoryMeta: Record<string, { name: string; color: string; bg: string; description: string }> = {
  'restaurants-food':    { name: 'Restaurants & Food',   color: '#dc2626', bg: '#fef2f2', description: 'Find the best restaurants, cafes, and food spots in Natchez and the Miss-Lou area.' },
  'medical-health':      { name: 'Medical & Health',     color: '#16a34a', bg: '#f0fdf4', description: 'Doctors, clinics, dentists, and healthcare providers in Natchez, MS.' },
  'home-services':       { name: 'Home Services',        color: '#2563eb', bg: '#eff6ff', description: 'Plumbers, electricians, contractors, and home repair services in the Miss-Lou area.' },
  'auto-services':       { name: 'Auto Services',        color: '#475569', bg: '#f8fafc', description: 'Auto repair shops, mechanics, and car services in Natchez, MS.' },
  'shopping-retail':     { name: 'Shopping & Retail',    color: '#9333ea', bg: '#faf5ff', description: 'Local shops, boutiques, and retail stores in Natchez and the Miss-Lou area.' },
  'personal-care':       { name: 'Personal Care',        color: '#e11d48', bg: '#fff1f2', description: 'Hair salons, spas, barbers, and personal care services in Natchez, MS.' },
  'legal-financial':     { name: 'Legal & Financial',    color: '#0891b2', bg: '#ecfeff', description: 'Attorneys, accountants, and financial services in the Miss-Lou area.' },
  'real-estate-hotels':  { name: 'Real Estate & Hotels', color: '#ea580c', bg: '#fff7ed', description: 'Real estate agents, hotels, and lodging in Natchez, MS.' },
  'churches-faith':      { name: 'Churches & Faith',     color: '#7c3aed', bg: '#faf5ff', description: 'Churches, places of worship, and faith communities in the Miss-Lou area.' },
  'arts-education':      { name: 'Arts & Education',     color: '#f59e0b', bg: '#fffbeb', description: 'Art galleries, schools, tutoring, and educational services in Natchez, MS.' },
  'tours-attractions':   { name: 'Tours & Attractions',  color: '#0369a1', bg: '#e0f2fe', description: 'Tours, historic sites, and attractions in Natchez, MS — the Antebellum capital of the South.' },
  'pet-services':        { name: 'Pet Services',         color: '#d97706', bg: '#fffbeb', description: 'Vets, groomers, pet stores, and animal services in the Miss-Lou area.' },
  'walking-downtown':    { name: 'Walking Downtown',     color: '#1e40af', bg: '#eff6ff', description: 'Historic downtown Natchez businesses — all walkable. Perfect for tourists and visitors.' },
  'funeral-services':    { name: 'Funeral Services',     color: '#6b7280', bg: '#f9fafb', description: 'Funeral homes and memorial services in Natchez and the Miss-Lou area.' },
  'fitness-wellness':    { name: 'Fitness & Wellness',   color: '#f97316', bg: '#fff7ed', description: 'Gyms, yoga studios, and wellness centers in Natchez, MS.' },
  'pharmacy':            { name: 'Pharmacy',             color: '#0891b2', bg: '#ecfeff', description: 'Pharmacies and drug stores in Natchez and the Miss-Lou area.' },
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const meta = categoryMeta[slug]
  if (!meta) return { title: 'Category Not Found' }
  return {
    title: meta.name + ' in Natchez, MS | MissLouLocal',
    description: meta.description,
    openGraph: {
      title: meta.name + ' in Natchez, MS | MissLouLocal',
      description: meta.description,
      url: 'https://www.missloulocal.com/category/' + slug,
      siteName: 'MissLouLocal',
      locale: 'en_US',
      type: 'website',
    },
    alternates: { canonical: 'https://www.missloulocal.com/category/' + slug },
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const meta = categoryMeta[slug]
  if (!meta) notFound()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )

  const { data: categoryRow } = await supabase.from('categories').select('id').eq('slug', slug).single()
  if (!categoryRow) notFound()

  const { data: businesses } = await supabase
    .from('businesses')
    .select('*')
    .eq('category_id', categoryRow.id)
    .eq('is_active', true)
    .order('tier', { ascending: false })
    .order('name')

  const bizList = businesses ?? []
  const sorted = [
    ...bizList.filter(b => b.tier === 'premium'),
    ...bizList.filter(b => b.tier === 'featured'),
    ...bizList.filter(b => b.tier !== 'premium' && b.tier !== 'featured'),
  ]

  const Icon = iconMap[slug] ?? Wrench
  const isDowntown = slug === 'walking-downtown'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: meta.name + ' in Natchez, MS',
    description: meta.description,
    url: 'https://www.missloulocal.com/category/' + slug,
    numberOfItems: sorted.length,
    itemListElement: sorted.slice(0, 10).map((biz, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'LocalBusiness',
        name: biz.name,
        url: 'https://www.missloulocal.com/business/' + biz.slug,
        ...(biz.address && { address: { '@type': 'PostalAddress', streetAddress: biz.address, addressLocality: biz.city || 'Natchez', addressRegion: biz.state || 'MS', addressCountry: 'US' } }),
        ...(biz.phone && { telephone: biz.phone }),
      },
    })),
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingBottom: '80px' }}>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header style={{ backgroundColor: isDowntown ? '#1e3a8a' : '#0f3460', padding: '0 20px', height: '64px', display: 'flex', alignItems: 'center', gap: '16px', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href='/' style={{ width: '40px', height: '40px', minHeight: 0, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ArrowLeft size={20} color='white' strokeWidth={2} />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <div style={{ width: '36px', height: '36px', backgroundColor: meta.color + '30', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={20} color='white' strokeWidth={1.8} />
          </div>
          <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'white', margin: 0 }}>{meta.name}</h1>
        </div>
      </header>

      {isDowntown && (
        <div style={{ backgroundColor: '#fef3c7', borderBottom: '2px solid #b45309', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Footprints size={16} color='#b45309' strokeWidth={2} />
          <span style={{ fontSize: '13px', color: '#78350f', fontWeight: 600 }}>Walkable historic downtown — all within steps of each other</span>
        </div>
      )}

      <div style={{ backgroundColor: isDowntown ? '#dbeafe' : meta.bg, borderBottom: '1px solid ' + meta.color + '20', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '14px', color: meta.color, fontWeight: 600 }}>{sorted.length} businesses listed</span>
        <span style={{ fontSize: '13px', color: '#64748b' }}>Natchez area</span>
      </div>

      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {sorted.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <Clock size={28} color={meta.color} strokeWidth={1.5} />
            <p style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '16px 0 8px' }}>Coming Soon</p>
            <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>We are actively adding businesses in this category.</p>
          </div>
        )}

        {sorted.map((biz: any) => {
          const isPremium = biz.tier === 'premium'
          const isFeatured = biz.tier === 'featured'
          if (isPremium) return (
            <div key={biz.id} style={{ background: 'linear-gradient(135deg, #0f3460 0%, #16213e 100%)', borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', boxShadow: '0 8px 32px rgba(15,52,96,0.25)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', backgroundColor: '#e94560', borderRadius: '50%', opacity: 0.1 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: '#e94560', borderRadius: '20px', padding: '4px 10px' }}>
                  <Star size={11} color='white' fill='white' />
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: '1px' }}>Premium Listing</span>
                </div>
                {biz.is_verified && <CheckCircle size={16} color='#4ade80' fill='#4ade80' />}
              </div>
              {biz.photos && biz.photos.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', marginBottom: '4px', borderRadius: '12px', overflow: 'hidden', height: '140px' }}>
                  {biz.photos.slice(0, 3).map((photo: string, i: number) => (
                    <img key={i} src={photo} alt={biz.name + ' photo'} style={{ flex: 1, objectFit: 'cover', minWidth: 0 }} />
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{ width: '56px', height: '56px', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(255,255,255,0.2)' }}>
                  <Icon size={28} color='white' strokeWidth={1.6} />
                </div>
                <div style={{ flex: 1 }}>
                  <Link href={'/business/' + biz.slug} style={{ fontSize: '20px', fontWeight: 800, color: 'white', margin: '0 0 6px', lineHeight: 1.2, textDecoration: 'none', display: 'block' }}>{biz.name}</Link>
                  {biz.google_rating && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', color: '#fbbf24', fontWeight: 700 }}>{'★'.repeat(Math.round(biz.google_rating))} {biz.google_rating}</span>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>({biz.google_review_count?.toLocaleString()} Google reviews)</span>
                    </div>
                  )}
                  {biz.description && <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.6 }}>{biz.description}</p>}
                </div>
              </div>
              {biz.address && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={14} color='rgba(255,255,255,0.5)' strokeWidth={2} /><span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{biz.address}</span></div>}
              {biz.phone && <a href={'tel:' + biz.phone} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', backgroundColor: '#e94560', borderRadius: '14px', height: '56px', minHeight: 0, color: 'white', fontSize: '18px', fontWeight: 800, textDecoration: 'none', width: '100%', boxShadow: '0 4px 16px rgba(233,69,96,0.4)' }}><Phone size={20} strokeWidth={2.5} />{biz.phone}</a>}
              {biz.latitude && biz.longitude && <a href={'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(biz.address || '')} target='_blank' rel='noopener noreferrer' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '14px', height: '46px', minHeight: 0, color: 'white', fontSize: '14px', fontWeight: 600, textDecoration: 'none', width: '100%', border: '1px solid rgba(255,255,255,0.2)' }}><Navigation size={16} strokeWidth={2} />Take Me There</a>}
              {biz.website && <a href={biz.website} target='_blank' rel='noopener noreferrer' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', height: '46px', minHeight: 0, color: 'white', fontSize: '14px', fontWeight: 600, textDecoration: 'none', width: '100%', border: '1px solid rgba(255,255,255,0.2)' }}><Globe size={16} strokeWidth={2} />Visit Website</a>}
            </div>
          )
          return (
            <div key={biz.id} style={{ backgroundColor: isDowntown ? '#f0f7ff' : 'white', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: isFeatured ? '2px solid ' + meta.color : isDowntown ? '1px solid #93c5fd' : '1px solid #f1f5f9' }}>
              {isFeatured && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Star size={12} color={meta.color} fill={meta.color} /><span style={{ fontSize: '11px', fontWeight: 700, color: meta.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Featured</span></div>}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', backgroundColor: meta.bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={24} color={meta.color} strokeWidth={1.8} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <div>
                      <Link href={'/business/' + biz.slug} style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', display: 'block', textDecoration: 'none', lineHeight: 1.3 }}>{biz.name}</Link>
                      {biz.google_rating && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 700 }}>{'★'.repeat(Math.round(biz.google_rating))}</span>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#374151' }}>{biz.google_rating}</span>
                          <span style={{ fontSize: '10px', color: '#94a3b8' }}>({biz.google_review_count?.toLocaleString()})</span>
                        </div>
                      )}
                    </div>
                    {biz.is_verified && <CheckCircle size={15} color='#0f3460' fill='#0f3460' />}
                  </div>
                  {biz.description && <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>{biz.description}</p>}
                </div>
              </div>
              {biz.address && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} color='#94a3b8' strokeWidth={2} /><span style={{ fontSize: '13px', color: '#64748b' }}>{biz.address}</span></div>}
              {!biz.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f8fafc', borderRadius: '10px', padding: '10px 12px', border: '1px dashed #cbd5e1' }}><Clock size={14} color='#94a3b8' /><span style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>Call info coming soon</span></div>}
              {biz.phone && <a href={'tel:' + biz.phone} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', backgroundColor: '#16a34a', borderRadius: '14px', height: '52px', minHeight: 0, color: 'white', fontSize: '17px', fontWeight: 700, textDecoration: 'none', width: '100%' }}><Phone size={18} strokeWidth={2.5} />{biz.phone}</a>}
              {biz.latitude && biz.longitude && <a href={'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(biz.address || '')} target='_blank' rel='noopener noreferrer' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: isDowntown ? '#1e40af' : '#0f3460', borderRadius: '14px', height: '48px', minHeight: 0, color: 'white', fontSize: '15px', fontWeight: 700, textDecoration: 'none', width: '100%' }}><Navigation size={17} strokeWidth={2.5} />Take Me There</a>}
              <CategoryClaimButton bizId={biz.id} bizName={biz.name} isClaimed={!!biz.is_claimed} />
              {biz.website && <a href={biz.website} target='_blank' rel='noopener noreferrer' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#f1f5f9', borderRadius: '14px', height: '44px', minHeight: 0, color: '#475569', fontSize: '14px', fontWeight: 600, textDecoration: 'none', width: '100%' }}><Globe size={16} strokeWidth={2} />Visit Website</a>}
            </div>
          )
        })}
      </div>

      <div style={{ padding: '8px 20px 4px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Missing a business? <a href='mailto:support@klickifyagency.com' style={{ color: '#e94560', fontWeight: 600, textDecoration: 'none' }}>Contact us to get listed</a></p>
      </div>
      <div style={{ padding: '4px 20px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: '12px', color: '#94a3b8' }}>Powered by <a href='https://klickifyagency.com' target='_blank' rel='noopener noreferrer' style={{ color: '#e94560', fontWeight: 600, textDecoration: 'none' }}>Klickify Agency</a></div>
      </div>
      <BottomNav />
    </div>
  )
}
