import Link from 'next/link'

const a = { color: '#64748b', textDecoration: 'underline' } as const

export default function LegalLinks() {
  return (
    <nav aria-label='Legal' style={{ textAlign: 'center', fontSize: '12px', color: '#64748b', padding: '16px 16px 96px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px 14px' }}>
      <Link href='/privacy' style={a}>Privacy</Link>
      <Link href='/terms' style={a}>Terms</Link>
      <Link href='/cookies' style={a}>Cookies</Link>
      <a href='#' data-cookie-settings style={a}>Cookie settings</a>
    </nav>
  )
}
