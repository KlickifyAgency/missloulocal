import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import https from 'https'

function searchPlace(name: string, lat: number, lng: number): Promise<{place_id: string, rating: number, count: number} | null> {
  return new Promise((resolve) => {
    const query = encodeURIComponent(name + ' Natchez MS')
    const url = `/maps/api/place/findplacefromtext/json?input=${query}&inputtype=textquery&locationbias=circle:5000@${lat},${lng}&fields=place_id,rating,user_ratings_total&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`
    const req = https.get({ hostname: 'maps.googleapis.com', path: url }, res => {
      let d = ''
      res.on('data', c => d += c)
      res.on('end', () => {
        try {
          const json = JSON.parse(d)
          const c = json.candidates?.[0]
          resolve(c ? { place_id: c.place_id, rating: c.rating || null, count: c.user_ratings_total || null } : null)
        } catch { resolve(null) }
      })
    })
    req.on('error', () => resolve(null))
  })
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: businesses } = await supabase
    .from('businesses')
    .select('id, name, latitude, longitude')
    .not('latitude', 'is', null)
    .not('longitude', 'is', null)
    .eq('is_active', true)

  if (!businesses) return NextResponse.json({ error: 'No businesses' }, { status: 500 })

  let updated = 0
  for (const b of businesses) {
    const result = await searchPlace(b.name, b.latitude, b.longitude)
    if (result) {
      await supabase.from('businesses').update({
        google_place_id: result.place_id,
        google_rating: result.rating,
        google_review_count: result.count
      }).eq('id', b.id)
      updated++
    }
    await sleep(100)
  }

  return NextResponse.json({ success: true, updated, total: businesses.length })
}