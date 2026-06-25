import { createClient } from '@supabase/supabase-js'
import { Search, Tag, CalendarDays, BookOpen, ChevronRight, ArrowRight, Newspaper, Star } from 'lucide-react'
import {
  Wrench, UtensilsCrossed, HeartPulse, Car, ShoppingBag,
  Scissors, Scale, Building2, Church,
  Palette, Compass, PawPrint, Footprints, ShoppingBasket, Heart, ShoppingCart,
  Dumbbell, Ribbon, Pill
} from 'lucide-react'
import Link from 'next/link'
import BottomNav from '@/components/layout/BottomNav'
import HomeClaimHandler from '@/components/home/HomeClaimHandler'

const categories = [
  { name: 'Walking Downtown',     slug: 'walking-downtown',    icon: Footprints,      color: '#1e40af', bg: '#eff6ff' },
  { name: 'Farmers Market',       slug: 'farmers-market',     icon: ShoppingBasket,  color: '#65a30d', bg: '#f7fee7' },
  { name: 'Yard Sales',           slug: 'yard-sales',         icon: ShoppingCart,    color: '#0891b2', bg: '#ecfeff' },
  { name: 'Find My Pet',          slug: 'find-my-pet',        icon: Heart,           color: '#f97316', bg: '#fff7ed' },
  { name: 'Restaurants & Food',   slug: 'restaurants-food',   icon: UtensilsCrossed, color: '#dc2626', bg: '#fef2f2' },
  { name: 'Medical & Health',     slug: 'medical-health',     icon: HeartPulse,      color: '#16a34a', bg: '#f0fdf4' },
  { name: 'Home Services',        slug: 'home-services',      icon: Wrench,          color: '#2563eb', bg: '#eff6ff' },
  { name: 'Auto Services',        slug: 'auto-services',      icon: Car,             color: '#475569', bg: '#f8fafc' },
  { name: 'Shopping & Retail',    slug: 'shopping-retail',    icon: ShoppingBag,     color: '#9333ea', bg: '#faf5ff' },
  { name: 'Personal Care',        slug: 'personal-care',      icon: Scissors,        color: '#e11d48', bg: '#fff1f2' },
  { name: 'Legal & Financial',    slug: 'legal-financial',    icon: Scale,           color: '#0891b2', bg: '#ecfeff' },
  { name: 'Real Estate & Hotels', slug: 'real-estate-hotels', icon: Building2,       color: '#ea580c', bg: '#fff7ed' },
  { name: 'Fitness & Wellness',   slug: 'fitness-wellness',   icon: Dumbbell,        color: '#f97316', bg: '#fff7ed' },
  { name: 'Churches & Faith',     slug: 'churches-faith',     icon: Church,          color: '#7c3aed', bg: '#faf5ff' },
  { name: 'Arts & Education',     slug: 'arts-education',     icon: Palette,         color: '#f59e0b', bg: '#fffbeb' },
  { name: 'Tours & Attractions',  slug: 'tours-attractions',  icon: Compass,         color: '#0369a1', bg: '#e0f2fe' },
  { name: 'Pet Services',         slug: 'pet-services',       icon: PawPrint,        color: '#d97706', bg: '#fffbeb' },
  { name: 'Funeral Services',     slug: 'funeral-services',   icon: Ribbon,          color: '#6b7280', bg: '#f9fafb' },
  { name: 'Pharmacy',             slug: 'pharmacy',           icon: Pill,            color: '#0891b2', bg: '#ecfeff' },
]

export default async function HomePage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
  const { count } = await supabase.from('businesses').select('*', { count: 'exact', head: true }).eq('is_active', true)
  const bizCount = count ?? 1135

  const { data: rawFeatured } = await supabase
    .from('businesses')
    .select('id, name, slug, description, photos, photo_url, google_rating, google_review_count, categories(name, slug)')
    .eq('tier', 'premium')
    .eq('is_active', true)
    .order('name')
  // Deduplicate by name (same business can have different slugs across categories)
  const featuredBizList = [...new Map((rawFeatured ?? []).map(b => [b.name, b])).values()]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MissLouLocal',
    url: 'https://www.missloulocal.com',
    description: 'Local business directory for Natchez, MS and the Miss-Lou area. ' + bizCount + '+ businesses listed.',
    areaServed: { '@type': 'City', name: 'Natchez', addressRegion: 'MS', addressCountry: 'US' },
    contactPoint: { '@type': 'ContactPoint', email: 'info@klickifyagency.com', contactType: 'customer support' },
  }

  return (
    <>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomeClaimHandler />
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingBottom: '80px' }}>
        <style>{'@keyframes pulse-blue{0%,100%{box-shadow:0 8px 24px rgba(30,64,175,0.35),0 0 0 0 rgba(30,64,175,0.4)}50%{box-shadow:0 8px 40px rgba(30,64,175,0.75),0 0 0 8px rgba(30,64,175,0)}}'}</style>
        <header style={{ backgroundColor: 'transparent', padding: '0 20px', height: '0px', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50 }}></header>

        <div>
          <img src='/hero-bg.png' alt='MissLouLocal — Natchez, MS Local Business Directory' style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>

        <div style={{ backgroundColor: 'white', padding: '16px 20px' }}>
          <Link href='/search' style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#1e40af', borderRadius: '16px', padding: '0 20px', height: '56px', color: 'white', fontSize: '16px', width: '100%', minHeight: 0, textDecoration: 'none', border: 'none' }}>
            <Search size={20} strokeWidth={2} color='white' style={{ flexShrink: 0 }} />
            <span>Search {bizCount.toLocaleString()}+ local businesses...</span>
          </Link>
        </div>

        <div style={{ padding: '20px 20px 0', display: 'flex', gap: '12px' }}>
          <Link href='/deals' style={{ flex: 1, backgroundColor: '#fff7ed', borderRadius: '14px', padding: '14px', display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', minHeight: 0, height: 'auto', border: '1px solid #fed7aa' }}>
            <div style={{ width: '36px', height: '36px', backgroundColor: '#ea580c', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Tag size={18} color='white' strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#9a3412', lineHeight: 1.2 }}>Today's Deals</div>
              <div style={{ fontSize: '11px', color: '#ea580c' }}>Save locally</div>
            </div>
          </Link>
          <Link href='/events' style={{ flex: 1, backgroundColor: '#fdf2f8', borderRadius: '14px', padding: '14px', display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', minHeight: 0, height: 'auto', border: '1px solid #f9a8d4' }}>
            <div style={{ width: '36px', height: '36px', backgroundColor: '#db2777', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CalendarDays size={18} color='white' strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#831843', lineHeight: 1.2 }}>Local Events</div>
              <div style={{ fontSize: '11px', color: '#db2777' }}>What's happening</div>
            </div>
          </Link>
        </div>

        {featuredBizList && featuredBizList.length > 0 && (
          <div style={{ padding: '24px 0 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', marginBottom: '14px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Featured Businesses</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: '#e94560', borderRadius: '20px', padding: '3px 10px' }}>
                <Star size={11} color='white' fill='white' />
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: '1px' }}>Premium</span>
              </div>
            </div>
            <style>{'#featured-scroll::-webkit-scrollbar{display:none}'}</style>
            <div id='featured-scroll' style={{ display: 'flex', gap: '12px', overflowX: 'auto', padding: '4px 20px 12px', scrollbarWidth: 'none' }}>
              {featuredBizList.map((biz: any) => {
                const photo = biz.photos?.[0] ?? biz.photo_url ?? null
                return (
                  <Link key={biz.id} href={'/business/' + biz.slug} style={{ textDecoration: 'none', flexShrink: 0, width: '250px', height: '230px' }}>
                    <div style={{ background: 'linear-gradient(135deg, #0f3460 0%, #16213e 100%)', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 6px 24px rgba(15,52,96,0.3)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                      {photo
                        ? <img src={photo} alt={biz.name} style={{ width: '100%', height: '120px', objectFit: 'cover', display: 'block', flexShrink: 0 }} />
                        : <div style={{ width: '100%', height: '120px', backgroundColor: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Star size={32} color='rgba(255,255,255,0.2)' /></div>
                      }
                      <div style={{ padding: '12px 14px 14px', flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: '5px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>{biz.name}</div>
                        {biz.google_rating && (
                          <div style={{ fontSize: '12px', color: '#fbbf24', fontWeight: 700, marginBottom: '5px' }}>{'★'.repeat(Math.round(biz.google_rating))} {biz.google_rating}</div>
                        )}
                        {biz.description && (
                          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{biz.description}</div>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        <div style={{ padding: '24px 20px 0' }}>
          <Link href='/category/walking-downtown' style={{ background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)', borderRadius: '20px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none', minHeight: 0, height: 'auto', boxShadow: '0 8px 24px rgba(30,64,175,0.35)', position: 'relative', overflow: 'hidden', animation: 'pulse-blue 2s ease-in-out infinite' }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
            <div style={{ width: '56px', height: '56px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(255,255,255,0.3)' }}>
              <Footprints size={28} strokeWidth={1.8} color='white' />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '4px' }}>For Tourists & Visitors</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'white', lineHeight: 1.2 }}>Walking Downtown</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', marginTop: '4px' }}>Historic district — everything within walking distance</div>
            </div>
          </Link>
        </div>

        <div style={{ padding: '24px 20px 0' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: '0 0 16px', textAlign: 'center' }}>Browse by Category</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {categories.filter(c => c.slug !== 'walking-downtown').map(({ name, slug, icon: Icon, color, bg }) => {
              const finalHref = slug === 'find-my-pet' ? '/find-my-pet' : slug === 'yard-sales' ? '/yard-sales' : slug === 'farmers-market' ? '/farmers-market' : '/category/' + slug
              return (
                <Link key={slug} href={finalHref} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '16px 14px', display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', minHeight: 0, height: 'auto', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
                  <div style={{ width: '44px', height: '44px', backgroundColor: bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={22} strokeWidth={1.8} color={color} />
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#334155', lineHeight: 1.3 }}>{name}</span>
                </Link>
              )
            })}
          </div>
        </div>

        <div style={{ padding: '24px 20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Local Guides</h2>
            <Link href='/guides' style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600, color: '#e94560', textDecoration: 'none' }}>
              All guides <ArrowRight size={14} strokeWidth={2.5} />
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { href: '/guides/best-restaurants-natchez-ms', label: 'Best Restaurants in Natchez', sub: 'Where to eat in the Miss-Lou area', color: '#dc2626', bg: '#fef2f2' },
              { href: '/guides/things-to-do-natchez-ms', label: 'Things To Do in Natchez', sub: 'Attractions, tours & historic sites', color: '#0369a1', bg: '#e0f2fe' },
              { href: '/guides/walking-tour-downtown-natchez', label: 'Walking Tour: Downtown Natchez', sub: 'Everything within walking distance', color: '#1e40af', bg: '#eff6ff' },
              { href: '/guides/best-doctors-natchez-ms', label: 'Doctors & Medical Services', sub: '200+ healthcare providers listed', color: '#16a34a', bg: '#f0fdf4' },
            ].map(({ href, label, sub, color, bg }) => (
              <Link key={href} href={href} style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'white', borderRadius: '14px', padding: '14px', textDecoration: 'none', border: '1px solid #e2e8f0', minHeight: 0, height: 'auto', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: bg, borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <BookOpen size={20} color={color} strokeWidth={1.8} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>{label}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{sub}</div>
                </div>
                <ChevronRight size={16} color='#cbd5e1' strokeWidth={2} style={{ flexShrink: 0 }} />
              </Link>
            ))}
          </div>
        </div>

        <div style={{ padding: '24px 20px 0' }}>
          <Link href='/articles' style={{ display: 'flex', alignItems: 'center', gap: '14px', backgroundColor: 'white', borderRadius: '16px', padding: '16px', textDecoration: 'none', border: '1px solid #e2e8f0', minHeight: 0, height: 'auto', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '12px' }}>
            <div style={{ width: '44px', height: '44px', backgroundColor: '#fdf2f8', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid #f9a8d4' }}>
              <Newspaper size={22} color='#db2777' strokeWidth={1.8} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '3px' }}>Local Articles — Natchez, MS</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>New article every Friday · History, food, living & more</div>
            </div>
            <ChevronRight size={18} color='#cbd5e1' strokeWidth={2} style={{ flexShrink: 0 }} />
          </Link>
        </div>

        <div style={{ padding: '24px 20px 0' }}>
          <Link href='/add-business' style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'white', borderRadius: '16px', padding: '16px 20px', textDecoration: 'none', border: '2px dashed #cbd5e1', minHeight: 0, height: 'auto' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#eff6ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '22px', color: '#1e40af', fontWeight: 700 }}>+</span>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Add Your Business — Free</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>Get listed in the Miss-Lou directory</div>
            </div>
          </Link>
        </div>

        <div style={{ padding: '32px 20px 16px', textAlign: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <a href='https://www.facebook.com/profile.php?id=61576576566619' target='_blank' rel='noopener noreferrer' style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#1877f2', borderRadius: '20px', padding: '8px 20px', textDecoration: 'none' }}>
              <svg width='18' height='18' viewBox='0 0 24 24' fill='white'><path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'/></svg>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'white' }}>Follow MissLouLocal on Facebook</span>
            </a>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Powered by <a href='https://klickifyagency.com' target='_blank' rel='noopener noreferrer' style={{ color: '#e94560', fontWeight: 600, textDecoration: 'none' }}>Klickify Agency</a></div>
          </div>
        </div>
        <BottomNav />
      </div>
    </>
  )
}
