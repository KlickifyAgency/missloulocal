'use client'
import { Search, MapPin, Tag, CalendarDays } from 'lucide-react'
import {
  Wrench, UtensilsCrossed, HeartPulse, Car, ShoppingBag,
  Scissors, Scale, Building2, Stethoscope, Church,
  Palette, Compass, PawPrint, Footprints, ShoppingBasket, Heart, ShoppingCart
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
  { name: 'Medical Specialists',  slug: 'medical-specialists', icon: Stethoscope,     color: '#0d9488', bg: '#f0fdfa' },
  { name: 'Churches & Faith',     slug: 'churches-faith',      icon: Church,          color: '#7c3aed', bg: '#faf5ff' },
  { name: 'Arts & Education',     slug: 'arts-education',      icon: Palette,         color: '#f59e0b', bg: '#fffbeb' },
  { name: 'Tours & Attractions',  slug: 'tours-attractions',   icon: Compass,         color: '#0369a1', bg: '#e0f2fe' },
  { name: 'Pet Services',         slug: 'pet-services',        icon: PawPrint,        color: '#d97706', bg: '#fffbeb' },
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
        <div style={{ fontSize: '12px', color: '#94a3b8' }}>Powered by <a href='https://klickifyagency.com' target='_blank' rel='noopener noreferrer' style={{ color: '#e94560', fontWeight: 600, textDecoration: 'none', display: 'inline', minHeight: 0, height: 'auto' }}>Klickify Agency</a></div>
      </div>
      <BottomNav />
    </div>
  )
}