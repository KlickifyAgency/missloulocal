'use client'
import { Home, Grid3x3, Star, CalendarDays, Navigation, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/',           icon: Home,        label: 'Home'    },
  { href: '/categories', icon: Grid3x3,     label: 'Browse'  },
  { href: '/near-me',    icon: Navigation,  label: 'Near Me', special: true },
  { href: '/deals',      icon: Star,        label: 'Deals'   },
  { href: '/events',     icon: CalendarDays,label: 'Events'  },
]

export default function BottomNav() {
  const pathname = usePathname()
  return (
    <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, backgroundColor: 'white', borderTop: '1px solid #f1f5f9', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: '64px', padding: '0 4px' }}>
        {navItems.map(({ href, icon: Icon, label, special }) => {
          const active = pathname === href
          if (special) return (
            <Link key={href} href={href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px', flex: 1, textDecoration: 'none', minHeight: 0, height: 'auto' }}>
              <div style={{ backgroundColor: '#e94560', borderRadius: '20px', padding: '8px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', boxShadow: '0 4px 12px rgba(233,69,96,0.35)', marginBottom: '2px' }}>
                <Navigation size={18} color='white' strokeWidth={2.5} />
                <span style={{ fontSize: '10px', fontWeight: 800, color: 'white', letterSpacing: '0.3px', whiteSpace: 'nowrap' }}>Near Me</span>
              </div>
            </Link>
          )
          return (
            <Link key={href} href={href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px', flex: 1, textDecoration: 'none', minHeight: 0, height: 'auto' }}>
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} color={active ? '#0f3460' : '#94a3b8'} />
              <span style={{ fontSize: '10px', fontWeight: 600, color: active ? '#0f3460' : '#94a3b8' }}>{label}</span>
            </Link>
          )
        })}
        <Link href='/admin' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px', flex: 1, textDecoration: 'none', minHeight: 0, height: 'auto' }}>
          <Settings size={22} strokeWidth={pathname === '/admin' ? 2.5 : 1.8} color={pathname === '/admin' ? '#0f3460' : '#94a3b8'} />
          <span style={{ fontSize: '10px', fontWeight: 600, color: pathname === '/admin' ? '#0f3460' : '#94a3b8' }}>Admin</span>
        </Link>
      </div>
    </nav>
  )
}