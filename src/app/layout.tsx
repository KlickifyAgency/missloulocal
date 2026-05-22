import type { Metadata } from 'next'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import './globals.css'
import InstallBanner from '@/components/pwa/InstallBanner'
import RegisterSW from '@/components/pwa/RegisterSW'
import PushNotifications from '@/components/pwa/PushNotifications'
import { Analytics } from '@vercel/analytics/react'
import { GoogleAnalytics } from '@next/third-parties/google'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans', weight: ['400', '500', '600', '700', '800'] })
const dmSerifDisplay = DM_Serif_Display({ subsets: ['latin'], weight: '400', variable: '--font-display' })

export const metadata: Metadata = {
  title: { default: 'MissLouLocal — Natchez, MS Local Business Directory', template: '%s | MissLouLocal' },
  description: 'Find local businesses, restaurants, doctors, and services in Natchez, MS and the Miss-Lou area. 1,100+ businesses listed. Free to search.',
  metadataBase: new URL('https://www.missloulocal.com'),
  alternates: { canonical: 'https://www.missloulocal.com' },
  openGraph: {
    title: 'MissLouLocal — Natchez, MS Local Business Directory',
    description: 'Find local businesses, restaurants, doctors, and services in Natchez, MS and the Miss-Lou area. 1,100+ businesses listed.',
    url: 'https://www.missloulocal.com',
    siteName: 'MissLouLocal',
    locale: 'en_US',
    type: 'website',
  },
  twitter: { card: 'summary', title: 'MissLouLocal', description: 'Natchez, MS local business directory. 1,100+ businesses.' },
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
        <PushNotifications />
        <Analytics />
        <GoogleAnalytics gaId="G-X98NNEKHKV" />
      </body>
    </html>
  )
}
