import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
const resend = new Resend(process.env.RESEND_API_KEY)

async function checkEndpoint(url: string, name: string) {
  for (let i = 0; i < 2; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
      return { name, ok: res.ok, status: res.status }
    } catch(e: any) {
      if (i === 1) return { name, ok: false, status: 0, error: e.message }
      await new Promise(r => setTimeout(r, 2000))
    }
  }
  return { name, ok: false, status: 0 }
}

export async function GET() {
  const base = 'https://www.missloulocal.com'
  const checks = await Promise.all([
    checkEndpoint(base + '/api/businesses/count', 'Business Count API'),
    checkEndpoint(base + '/api/search?q=restaurant', 'Search API'),
    checkEndpoint(base + '/api/businesses/by-slug?slug=test', 'By-Slug API'),
    checkEndpoint(base + '/api/businesses/count', 'Businesses DB'),
    checkEndpoint(base + '/api/yard-sales', 'Yard Sales API'),
    checkEndpoint(base + '/api/pets', 'Pets API'),
  ])

  // Check DB directly
  const { error: dbError } = await supabase
    .from('businesses')
    .select('id')
    .limit(1)
  checks.push({ name: 'Supabase DB', ok: !dbError, status: dbError ? 500 : 200 })

  const failed = checks.filter(c => !c.ok)
  const allOk = failed.length === 0

  if (!allOk) {
    const failList = failed.map(f => 
      '<li><strong>' + f.name + '</strong> — Status: ' + f.status + '</li>'
    ).join('')

    await resend.emails.send({
      from: 'MissLouLocal Monitor <noreply@klickifyagency.com>',
      to: 'support@klickifyagency.com',
      subject: '🚨 MissLouLocal Health Check FAILED — ' + failed.length + ' issue(s)',
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px">
          <div style="background:#dc2626;padding:20px;border-radius:12px 12px 0 0;text-align:center">
            <h1 style="color:white;margin:0">🚨 Health Check Failed</h1>
            <p style="color:rgba(255,255,255,0.8);margin:4px 0 0">MissLouLocal — ${new Date().toLocaleString()}</p>
          </div>
          <div style="background:white;padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px">
            <p style="color:#0f172a;font-size:16px"><strong>${failed.length} service(s) are DOWN:</strong></p>
            <ul style="color:#dc2626;font-size:15px">${failList}</ul>
            <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0"/>
            <p style="color:#64748b;font-size:13px">All checks:</p>
            <ul style="font-size:13px;color:#374151">
              ${checks.map(c => '<li>' + (c.ok ? '✅' : '❌') + ' ' + c.name + '</li>').join('')}
            </ul>
            <a href="https://www.missloulocal.com" style="display:inline-block;background:#0f3460;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;margin-top:16px">Check the app →</a>
          </div>
        </div>
      `
    })
  }

  return NextResponse.json({ 
    ok: allOk, 
    timestamp: new Date().toISOString(),
    checks 
  })
}