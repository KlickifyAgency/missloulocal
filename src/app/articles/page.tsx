import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, BookOpen, ChevronRight, Calendar, Newspaper } from 'lucide-react'
import BottomNav from '@/components/layout/BottomNav'
import { promises as fs } from 'fs'
import path from 'path'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Local Articles — Natchez, MS | MissLouLocal',
  description: 'In-depth local articles about Natchez, MS — history, food, attractions, living, and more. New article every Friday.',
  alternates: { canonical: 'https://www.missloulocal.com/articles' },
  openGraph: {
    title: 'Local Articles — Natchez, MS | MissLouLocal',
    description: 'In-depth local articles about Natchez, MS — history, food, attractions, living, and more.',
    url: 'https://www.missloulocal.com/articles',
    siteName: 'MissLouLocal',
    locale: 'en_US',
    type: 'website',
  },
}

type ArticleIndex = {
  slug: string
  title: string
  h1: string
  meta_description: string
  topic_category: string
  published_at: string
}

const categoryColors: Record<string, { color: string; bg: string; label: string }> = {
  tourism:  { color: '#0369a1', bg: '#e0f2fe', label: 'Tourism' },
  food:     { color: '#dc2626', bg: '#fef2f2', label: 'Food & Drink' },
  history:  { color: '#7c3aed', bg: '#faf5ff', label: 'History' },
  living:   { color: '#16a34a', bg: '#f0fdf4', label: 'Living Here' },
  events:   { color: '#db2777', bg: '#fdf2f8', label: 'Events' },
  outdoors: { color: '#65a30d', bg: '#f7fee7', label: 'Outdoors' },
}

async function getArticleIndex(): Promise<ArticleIndex[]> {
  try {
    const indexPath = path.join(process.cwd(), 'src/app/articles/data/index.json')
    const raw = await fs.readFile(indexPath, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export default async function ArticlesPage() {
  const list = await getArticleIndex()

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.missloulocal.com' },
      { '@type': 'ListItem', position: 2, name: 'Articles', item: 'https://www.missloulocal.com/articles' },
    ],
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingBottom: '80px' }}>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <header style={{ backgroundColor: '#0f3460', padding: '0 20px', height: '64px', display: 'flex', alignItems: 'center', gap: '16px', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href='/' style={{ width: '40px', height: '40px', minHeight: 0, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ArrowLeft size={20} color='white' strokeWidth={2} />
        </Link>
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'white', margin: 0 }}>Natchez Articles</h1>
      </header>

      <div style={{ padding: '28px 20px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ width: '60px', height: '60px', backgroundColor: '#fdf2f8', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', border: '1px solid #f9a8d4' }}>
            <Newspaper size={28} color='#db2777' strokeWidth={1.8} />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>Natchez, MS — Local Articles</h2>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0, lineHeight: 1.6 }}>
            In-depth local content about Natchez and the Miss-Lou area — new article every Friday.
          </p>
        </div>

        {list.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <BookOpen size={32} color='#94a3b8' strokeWidth={1.5} style={{ marginBottom: '12px' }} />
            <p style={{ fontSize: '16px', fontWeight: 700, color: '#334155', margin: '0 0 6px' }}>First article coming this Friday</p>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>New articles publish every week — check back soon.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {list.map(article => {
              const cat = categoryColors[article.topic_category] ?? { color: '#0f3460', bg: '#eff6ff', label: 'Local' }
              const date = new Date(article.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              return (
                <Link
                  key={article.slug}
                  href={'/articles/' + article.slug}
                  style={{ backgroundColor: 'white', borderRadius: '16px', padding: '16px', border: '1px solid #e2e8f0', textDecoration: 'none', display: 'block', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ width: '44px', height: '44px', backgroundColor: cat.bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <BookOpen size={20} color={cat.color} strokeWidth={1.8} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '10px', fontWeight: 700, color: cat.color, backgroundColor: cat.bg, borderRadius: '6px', padding: '2px 7px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{cat.label}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: '#94a3b8' }}>
                          <Calendar size={10} strokeWidth={2} />{date}
                        </span>
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', lineHeight: 1.3, marginBottom: '4px' }}>{article.h1}</div>
                      <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {article.meta_description}
                      </p>
                    </div>
                    <ChevronRight size={16} color='#cbd5e1' strokeWidth={2} style={{ flexShrink: 0, marginTop: '4px' }} />
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        <div style={{ marginTop: '24px', backgroundColor: '#0f3460', borderRadius: '20px', padding: '22px 20px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', margin: '0 0 14px', lineHeight: 1.6 }}>
            New article every Friday — all about Natchez & the Miss-Lou area
          </p>
          <Link href='/guides' style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#e94560', borderRadius: '12px', padding: '12px 20px', color: 'white', fontSize: '14px', fontWeight: 700, textDecoration: 'none', minHeight: 0 }}>
            Browse Local Guides
          </Link>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
