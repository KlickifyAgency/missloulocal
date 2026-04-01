'use client'
import { Search, MapPin, Tag, CalendarDays } from 'lucide-react'
import {
  Wrench, UtensilsCrossed, HeartPulse, Car, ShoppingBag,
  Scissors, Scale, Building2, Church,
  Palette, Compass, PawPrint, Footprints, ShoppingBasket, Heart, ShoppingCart,
  Dumbbell, Ribbon, Pill
} from 'lucide-react'
import Link from 'next/link'
import BottomNav from '@/components/layout/BottomNav'

const categories = [
  { name: 'Walking Downtown',     slug: 'walking-downtown',    icon: Footprints,      color: '#1e40af', bg: '#eff6ff' },
  { name: 'Farmers Market',       slug: 'farmers-market',     icon: ShoppingBasket,  color: '#65a30d', bg: '#f7fee7' },
  { name: 'Yard Sales',          slug: 'yard-sales',         icon: ShoppingCart,    color: '#0891b2', bg: '#ecfeff' },
  { name: 'Find My Pet',          slug: 'find-my-pet',        icon: Heart,           color: '#f97316', bg: '#fff7ed', special: true },
  { name: 'Restaurants & Food',   slug: 'restaurants-food',    icon: UtensilsCrossed, color: '#dc2626', bg: '#fef2f2' },
  { name: 'Medical & Health',     slug: 'medical-health',      icon: HeartPulse,      color: '#16a34a', bg: '#f0fdf4' },
  { name: 'Home Services',        slug: 'home-services',       icon: Wrench,          color: '#2563eb', bg: '#eff6ff' },
  { name: 'Auto Services',        slug: 'auto-services',       icon: Car,             color: '#475569', bg: '#f8fafc' },
  { name: 'Shopping & Retail',    slug: 'shopping-retail',     icon: ShoppingBag,     color: '#9333ea', bg: '#faf5ff' },
  { name: 'Personal Care',        slug: 'personal-care',       icon: Scissors,        color: '#e11d48', bg: '#fff1f2' },
  { name: 'Legal & Financial',    slug: 'legal-financial',     icon: Scale,           color: '#0891b2', bg: '#ecfeff' },
  { name: 'Real Estate & Hotels', slug: 'real-estate-hotels',  icon: Building2,       color: '#ea580c', bg: '#fff7ed' },
  { name: 'Fitness & Wellness',   slug: 'fitness-wellness',    icon: Dumbbell,        color: '#f97316', bg: '#fff7ed' },
  { name: 'Churches & Faith',     slug: 'churches-faith',      icon: Church,          color: '#7c3aed', bg: '#faf5ff' },
  { name: 'Arts & Education',     slug: 'arts-education',      icon: Palette,         color: '#f59e0b', bg: '#fffbeb' },
  { name: 'Tours & Attractions',  slug: 'tours-attractions',   icon: Compass,         color: '#0369a1', bg: '#e0f2fe' },
  { name: 'Pet Services',         slug: 'pet-services',        icon: PawPrint,        color: '#d97706', bg: '#fffbeb' },
  { name: 'Funeral Services',     slug: 'funeral-services',    icon: Ribbon,           color: '#6b7280', bg: '#f9fafb' },
  { name: 'Pharmacy',             slug: 'pharmacy',            icon: Pill,            color: '#0891b2', bg: '#ecfeff' },
]

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingBottom: '80px' }}>
      <style>{'@keyframes pulse-blue{0%,100%{box-shadow:0 8px 24px rgba(30,64,175,0.35),0 0 0 0 rgba(30,64,175,0.4)}50%{box-shadow:0 8px 40px rgba(30,64,175,0.75),0 0 0 8px rgba(30,64,175,0)}}'}</style>
      <header style={{ backgroundColor: 'transparent', padding: '0 20px', height: '0px', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50 }}></header>

      <div>
        <img src='/hero-bg.png' alt='MissLouLocal' style={{ width: '100%', height: 'auto', display: 'block' }} />
      </div>
      <div style={{ backgroundColor: 'white', padding: '16px 20px' }}>
        <Link href='/search' style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#1e40af', borderRadius: '16px', padding: '0 20px', height: '56px', color: 'white', fontSize: '16px', width: '100%', minHeight: 0, textDecoration: 'none', border: 'none' }}>
          <Search size={20} strokeWidth={2} color='white' style={{ flexShrink: 0 }} />
          <span>Search businesses...</span>
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

      <div style={{ padding: '24px 20px 0' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: '0 0 16px', textAlign: 'center' }}>Browse by Category</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {categories.map(({ name, slug, icon: Icon, color, bg }) => {
            const finalHref = slug === 'find-my-pet' ? '/find-my-pet' : slug === 'yard-sales' ? '/yard-sales' : slug === 'farmers-market' ? '/farmers-market' : slug === 'walking-downtown' ? '/category/walking-downtown' : '/category/' + slug
            if (slug === 'walking-downtown') return (
              <Link key={slug} href={finalHref} style={{ gridColumn: '1 / -1', background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)', borderRadius: '20px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none', minHeight: 0, height: 'auto', boxShadow: '0 8px 24px rgba(30,64,175,0.35)', position: 'relative', overflow: 'hidden', animation: 'pulse-blue 2s ease-in-out infinite' }}>
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
            )
            return (
              <Link key={slug} href={finalHref} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '16px 14px', display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', minHeight: 0, height: 'auto', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
                <div style={{ width: '44px', height: '44px', backgroundColor: bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={22} strokeWidth={1.8} color={color} />
                </div>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#334155', lineHeight: 1.3 }}>{name}</span>
              </Link>
            )
          })}        </div>
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}><a href='https://www.facebook.com/profile.php?id=61576576566619' target='_blank' rel='noopener noreferrer' style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#1877f2', borderRadius: '20px', padding: '8px 20px', textDecoration: 'none' }}><svg width='18' height='18' viewBox='0 0 24 24' fill='white'><path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'/></svg><span style={{ fontSize: '13px', fontWeight: 700, color: 'white' }}>Follow MissLouLocal on Facebook</span></a><div style={{ fontSize: '12px', color: '#94a3b8' }}>Powered by <a href='https://klickifyagency.com' target='_blank' rel='noopener noreferrer' style={{ color: '#e94560', fontWeight: 600, textDecoration: 'none' }}>Klickify Agency</a></div></div>
      </div>
      <BottomNav />
    </div>
  )
}