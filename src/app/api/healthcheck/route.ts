import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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
  const base = "https://www.missloulocal.com"
  const checks = await Promise.all([
    checkEndpoint(base + "/api/businesses/count", "Business Count API"),
    checkEndpoint(base + "/api/search?q=restaurant", "Search API"),
    checkEndpoint(base + "/api/businesses/by-slug?slug=test", "By-Slug API"),
    checkEndpoint(base + "/api/businesses/count", "Businesses DB"),
    checkEndpoint(base + "/api/yard-sales", "Yard Sales API"),
    checkEndpoint(base + "/api/pets", "Pets API"),
  ])

  // Check DB directly
  const { error: dbError } = await supabase
    .from("businesses")
    .select("id")
    .limit(1)
  checks.push({ name: "Supabase DB", ok: !dbError, status: dbError ? 500 : 200 })

  const failed = checks.filter(c => !c.ok)

  // NOTE (2026-09-06): this route no longer sends its own alert email.
  // It is polled every 5 min by /home/missloulocal-crons/healthcheck.js on the
  // VPS, which owns alerting (retries, 2-consecutive-failure threshold, 1h
  // cooldown, recovery notice) and already reports the failed checks below.
  // Emailing from here duplicated every alert and had no throttle at all —
  // a sustained sub-service outage meant 12 identical emails per hour.

  return NextResponse.json({
    ok: failed.length === 0,
    timestamp: new Date().toISOString(),
    checks
  })
}
