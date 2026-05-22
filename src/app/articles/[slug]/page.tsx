import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Calendar, ExternalLink } from 'lucide-react'
import BottomNav from '@/components/layout/BottomNav'

export const revalidate = 3600

type Section = { heading: string; body: string }
type FAQ     = { q: string; a: string }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
  const { data: a } = await supabase.from('articles').select('title, meta_description, slug').eq('slug', slug).single()
  if (!a) return { title: 'Article Not Found' }
  return {
    title: a.title,
    description: a.meta_description,
    alternates: { canonical: 'https://www.missloulocal.com/articles/' + a.slug },
    openGraph: {
      title: a.title,
      description: a.meta_description,
      url: 'https://www.missloulocal.com/articles/' + a.slug,
      siteName: 'MissLouLocal',
      locale: 'en_US',
      type: 'article',
    },
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )

  const { data: a } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!a) notFound()

  const sections: Section[] = a.sections ?? []
  const faqs: FAQ[]         = a.faqs ?? []
  const keywords: string[]  = a.keywords ?? []
  const published           = new Date(a.published_at)

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.h1,
    description: a.meta_description,
    url: 'https://www.missloulocal.com/articles/' + slug,
    datePublished: published.toISOString(),
    dateModified: published.toISOString(),
    keywords: keywords.join(', '),
    author: { '@type': 'Organization', name: 'MissLouLocal', url: 'https://www.missloulocal.com' },
    publisher: { '@type': 'Organization', name: 'MissLouLocal', url: 'https://www.missloulocal.com' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.missloulocal.com/articles/' + slug },
  }

  const faqLd = faqs.length ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  } : null

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',     item: 'https://www.missloulocal.com' },
      { '@type': 'ListItem', position: 2, name: 'Articles', item: 'https://www.missloulocal.com/articles' },
      { '@type': 'ListItem', position: 3, name: a.h1,       item: 'https://www.missloulocal.com/articles/' + slug },
    ],
  }

  const formattedDate = published.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingBottom: '80px' }}>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      {faqLd && <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <header style={{ backgroundColor: '#0f3460', padding: '0 20px', height: '64px', display: 'flex', alignItems: 'center', gap: '16px', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href='/articles' style={{ width: '40px', height: '40px', minHeight: 0, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ArrowLeft size={20} color='white' strokeWidth={2} />
        </Link>
        <h1 style={{ fontSize: '16px', fontWeight: 700, color: 'white', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>MissLouLocal Articles</h1>
      </header>

      <article style={{ padding: '28px 20px 0', maxWidth: '680px', margin: '0 auto' }}>
        <div style={{ marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#e94560', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Natchez, MS</span>
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', margin: '0 0 12px', lineHeight: 1.25 }}>{a.h1}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#94a3b8', marginBottom: '20px' }}>
          <Calendar size={12} strokeWidth={2} />
          {formattedDate} · By MissLouLocal
        </div>

        <p style={{ fontSize: '15px', color: '#334155', lineHeight: 1.75, margin: '0 0 32px', borderLeft: '3px solid #e94560', paddingLeft: '16px' }}>
          {a.intro}
        </p>

        {sections.map((section, i) => (
          <section key={i} style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '19px', fontWeight: 700, color: '#0f172a', margin: '0 0 12px', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>{section.heading}</h2>
            <p style={{ fontSize: '15px', color: '#334155', lineHeight: 1.75, margin: 0 }}>{section.body}</p>
          </section>
        ))}

        <div style={{ backgroundColor: '#0f3460', borderRadius: '20px', padding: '22px 20px', textAlign: 'center', marginBottom: '32px' }}>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', margin: '0 0 14px', lineHeight: 1.6 }}>
            Find local businesses, services, and events in Natchez
          </p>
          <Link href='/search' style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#e94560', borderRadius: '12px', padding: '12px 22px', color: 'white', fontSize: '14px', fontWeight: 700, textDecoration: 'none', minHeight: 0 }}>
            Search MissLouLocal <ExternalLink size={14} strokeWidth={2} />
          </Link>
        </div>

        {faqs.length > 0 && (
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '19px', fontWeight: 700, color: '#0f172a', margin: '0 0 16px', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
              Frequently Asked Questions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {faqs.map((faq, i) => (
                <div key={i} style={{ backgroundColor: 'white', borderRadius: '14px', padding: '16px 18px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>{faq.q}</h3>
                  <p style={{ fontSize: '14px', color: '#475569', margin: 0, lineHeight: 1.65 }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div style={{ textAlign: 'center', padding: '0 0 24px' }}>
          <Link href='/articles' style={{ fontSize: '14px', color: '#1e40af', fontWeight: 600, textDecoration: 'none' }}>
            ← More Natchez Articles
          </Link>
        </div>
      </article>

      <BottomNav />
    </div>
  )
}
