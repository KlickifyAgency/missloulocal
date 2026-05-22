import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Phone, MapPin, ExternalLink, ChevronRight } from 'lucide-react'
import BottomNav from '@/components/layout/BottomNav'
import { getGuide, GUIDES } from '@/lib/guides'

export async function generateStaticParams() {
  return GUIDES.map(g => ({ slug: g.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const guide = getGuide(slug)
  if (!guide) return { title: 'Guide Not Found' }
  return {
    title: guide.title,
    description: guide.metaDescription,
    alternates: { canonical: 'https://www.missloulocal.com/guides/' + slug },
    openGraph: {
      title: guide.title,
      description: guide.metaDescription,
      url: 'https://www.missloulocal.com/guides/' + slug,
      siteName: 'MissLouLocal',
      locale: 'en_US',
      type: 'article',
    },
    keywords: guide.keywords.join(', '),
  }
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const guide = getGuide(slug)
  if (!guide) notFound()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )

  const { data: catRows } = await supabase
    .from('categories')
    .select('id')
    .in('slug', guide.categorySlugs)

  const catIds = (catRows ?? []).map(r => r.id)

  const { data: rawBusinesses } = catIds.length
    ? await supabase
        .from('businesses')
        .select('id, name, slug, phone, address, city, state, website, tier')
        .in('category_id', catIds)
        .eq('is_active', true)
        .order('tier', { ascending: false })
        .order('name')
        .limit(guide.maxBusinesses)
    : { data: [] }

  const businesses = rawBusinesses ?? []
  const sorted = [
    ...businesses.filter(b => b.tier === 'premium'),
    ...businesses.filter(b => b.tier === 'featured'),
    ...businesses.filter(b => b.tier !== 'premium' && b.tier !== 'featured'),
  ]

  const publishedDate = new Date(guide.publishedDate).toISOString()

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.h1,
    description: guide.metaDescription,
    url: 'https://www.missloulocal.com/guides/' + slug,
    datePublished: publishedDate,
    dateModified: publishedDate,
    author: { '@type': 'Organization', name: 'MissLouLocal', url: 'https://www.missloulocal.com' },
    publisher: { '@type': 'Organization', name: 'MissLouLocal', url: 'https://www.missloulocal.com' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.missloulocal.com/guides/' + slug },
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  const listLd = sorted.length ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: guide.h1,
    url: 'https://www.missloulocal.com/guides/' + slug,
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
  } : null

  const formattedDate = new Date(guide.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingBottom: '80px' }}>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      {listLd && <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(listLd) }} />}

      <header style={{ backgroundColor: '#0f3460', padding: '0 20px', height: '64px', display: 'flex', alignItems: 'center', gap: '16px', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href='/guides' style={{ width: '40px', height: '40px', minHeight: 0, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ArrowLeft size={20} color='white' strokeWidth={2} />
        </Link>
        <h1 style={{ fontSize: '16px', fontWeight: 700, color: 'white', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>MissLouLocal Guides</h1>
      </header>

      <article style={{ padding: '28px 20px 0', maxWidth: '680px', margin: '0 auto' }}>
        <div style={{ marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#e94560', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Local Guide</span>
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '0 0 12px', lineHeight: 1.25 }}>{guide.h1}</h1>
        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '20px' }}>
          Updated {formattedDate} · By MissLouLocal
        </div>

        <p style={{ fontSize: '15px', color: '#334155', lineHeight: 1.75, margin: '0 0 32px', borderLeft: '3px solid #e94560', paddingLeft: '16px' }}>
          {guide.intro}
        </p>

        {guide.sections.map((section, i) => (
          <section key={i} style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '19px', fontWeight: 700, color: '#0f172a', margin: '0 0 12px', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>{section.heading}</h2>
            <p style={{ fontSize: '15px', color: '#334155', lineHeight: 1.75, margin: 0 }}>{section.body}</p>
          </section>
        ))}

        {sorted.length > 0 && (
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '19px', fontWeight: 700, color: '#0f172a', margin: '0 0 16px', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
              Local Listings — {guide.h1}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {sorted.map(biz => (
                <Link
                  key={biz.id}
                  href={'/business/' + biz.slug}
                  style={{ backgroundColor: 'white', borderRadius: '14px', padding: '16px', border: '1px solid #e2e8f0', textDecoration: 'none', display: 'block', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{biz.name}</span>
                        {(biz.tier === 'premium' || biz.tier === 'featured') && (
                          <span style={{ fontSize: '10px', fontWeight: 700, color: '#ea580c', backgroundColor: '#fff7ed', borderRadius: '6px', padding: '2px 6px', border: '1px solid #fed7aa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {biz.tier}
                          </span>
                        )}
                      </div>
                      {biz.address && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                          <MapPin size={12} color='#94a3b8' strokeWidth={2} />
                          <span style={{ fontSize: '13px', color: '#64748b' }}>{biz.address}{biz.city ? ', ' + biz.city : ''}</span>
                        </div>
                      )}
                      {biz.phone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Phone size={12} color='#94a3b8' strokeWidth={2} />
                          <span style={{ fontSize: '13px', color: '#64748b' }}>{biz.phone}</span>
                        </div>
                      )}
                    </div>
                    <ChevronRight size={16} color='#cbd5e1' strokeWidth={2} style={{ flexShrink: 0, marginTop: '2px' }} />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div style={{ backgroundColor: '#0f3460', borderRadius: '20px', padding: '24px 20px', textAlign: 'center', marginBottom: '32px' }}>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', margin: '0 0 16px', lineHeight: 1.6 }}>
            See the full list of verified local businesses
          </p>
          <Link
            href={guide.ctaHref}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#e94560', borderRadius: '14px', padding: '14px 24px', color: 'white', fontSize: '15px', fontWeight: 700, textDecoration: 'none', minHeight: 0 }}
          >
            {guide.ctaLabel}
            <ExternalLink size={15} strokeWidth={2} />
          </Link>
        </div>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '19px', fontWeight: 700, color: '#0f172a', margin: '0 0 16px', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {guide.faqs.map((faq, i) => (
              <div key={i} style={{ backgroundColor: 'white', borderRadius: '14px', padding: '16px 18px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>{faq.q}</h3>
                <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: 1.65 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <div style={{ textAlign: 'center', padding: '0 0 24px' }}>
          <Link href='/guides' style={{ fontSize: '14px', color: '#1e40af', fontWeight: 600, textDecoration: 'none' }}>
            ← Back to all MissLouLocal Guides
          </Link>
        </div>
      </article>

      <BottomNav />
    </div>
  )
}
