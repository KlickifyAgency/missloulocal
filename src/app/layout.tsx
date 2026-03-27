import type { Metadata } from 'next'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import './globals.css'
import InstallBanner from '@/components/pwa/InstallBanner'
import RegisterSW from '@/components/pwa/RegisterSW'
import { Analytics } from '@vercel/analytics/react'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' })
const dmSerifDisplay = DM_Serif_Display({ subsets: ['latin'], weight: '400', variable: '--font-display' })

export const metadata: Metadata = {
  title: 'MissLouLocal — Natchez & Miss-Lou Directory',
  description: 'Find local businesses, services, restaurants, and events in Natchez and the Miss-Lou area.',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'MissLouLocal' },
  icons: { apple: '/apple-touch-icon.png', icon: '/icon-192x192.png' },
  other: { 'mobile-web-app-capable': 'yes', 'theme-color': '#0f3460' },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en'>
      <head>
        <link rel='manifest' href='/manifest.webmanifest' />
        <meta name='theme-color' content='#0f3460' />
        <meta name='viewport' content='width=device-width, initial-scale=1, viewport-fit=cover' />
        <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
      </head>
      <body className={`${dmSans.variable} ${dmSerifDisplay.variable}`} style={{ margin: 0, padding: 0, fontFamily: 'var(--font-sans)', backgroundColor: '#f8fafc' }}>
        {children}
        <InstallBanner />
        <RegisterSW />
        <Analytics />
      </body>
    </html>
  )
}
