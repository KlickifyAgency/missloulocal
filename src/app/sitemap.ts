import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const BASE = 'https://www.missloulocal.com'

const STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: BASE,                         lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
  { url: BASE + '/categories',         lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
  { url: BASE + '/deals',              lastModified: new Date(), changeFrequency: 'daily',   priority: 0.8 },
  { url: BASE + '/events',             lastModified: new Date(), changeFrequency: 'daily',   priority: 0.8 },
  { url: BASE + '/near-me',            lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
  { url: BASE + '/farmers-market',     lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
  { url: BASE + '/yard-sales',         lastModified: new Date(), changeFrequency: 'daily',   priority: 0.6 },
  { url: BASE + '/find-my-pet',        lastModified: new Date(), changeFrequency: 'daily',   priority: 0.6 },
  { url: BASE + '/search',             lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.6 },
  { url: BASE + '/add-business',       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  { url: BASE + '/about',              lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
]

const CATEGORY_SLUGS = [
  'restaurants-food', 'medical-health', 'home-services', 'auto-services',
  'shopping-retail', 'personal-care', 'legal-financial', 'real-estate-hotels',
  'churches-faith', 'arts-education', 'tours-attractions', 'pet-services',
  'walking-downtown', 'funeral-services', 'fitness-wellness', 'pharmacy',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )

  const { data: businesses } = await supabase
    .from('businesses')
    .select('slug, updated_at')
    .eq('is_active', true)
    .order('updated_at', { ascending: false })

  const categoryPages: MetadataRoute.Sitemap = CATEGORY_SLUGS.map(slug => ({
    url: BASE + '/category/' + slug,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const businessPages: MetadataRoute.Sitemap = (businesses ?? []).map(b => ({
    url: BASE + '/business/' + b.slug,
    lastModified: new Date(b.updated_at),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...STATIC_PAGES, ...categoryPages, ...businessPages]
}
