import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import {
  Wrench, UtensilsCrossed, HeartPulse, Car, ShoppingBag,
  Scissors, Scale, Building2, Stethoscope, Church,
  Palette, Compass, PawPrint, Footprints, ShoppingBasket
} from 'lucide-react'
import BottomNav from '@/components/layout/BottomNav'

const categories = [
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
  { name: 'Farmers Market',        slug: 'farmers-market',    icon: ShoppingBasket,  color: '#65a30d', bg: '#f7fee7' },
  { name: 'Walking Downtown',     slug: 'walking-downtown',    icon: Footprints,      color: '#1e40af', bg: '#dbeafe' },
]

export default function CategoriesPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingBottom: '80px' }}>
      <header style={{ backgroundColor: '#0f3460', padding: '0 20px', height: '64px', display: 'flex', alignItems: 'center', gap: '16px', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href='/' style={{ width: '40px', height: '40px', minHeight: 0, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ArrowLeft size={20} color='white' strokeWidth={2} />
        </Link>
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'white', margin: 0 }}>Browse Categories</h1>
      </header>
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {categories.map(({ name, slug, icon: Icon, color, bg }) => (
            <Link key={slug} href={'/category/' + slug} style={{ backgroundColor: slug === 'walking-downtown' ? '#eff6ff' : 'white', borderRadius: '16px', padding: '20px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', textDecoration: 'none', minHeight: 0, height: 'auto', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: slug === 'walking-downtown' ? '2px solid #1e40af' : '1px solid #f1f5f9' }}>
              <div style={{ width: '52px', height: '52px', backgroundColor: bg, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={26} strokeWidth={1.8} color={color} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: slug === 'walking-downtown' ? '#1e40af' : '#334155', lineHeight: 1.3, textAlign: 'center' }}>{name}</span>
            </Link>
          ))}
        </div>
      </div>
      <div style={{ padding: '4px 20px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: '12px', color: '#94a3b8' }}>Powered by <a href='https://klickifyagency.com' target='_blank' rel='noopener noreferrer' style={{ color: '#e94560', fontWeight: 600, textDecoration: 'none' }}>Klickify Agency</a></div>
      </div>
      <BottomNav />
    </div>
  )
}