import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, phone, email, address, category_slug, website, service_area_only, description } = body

  if (!name || !phone || !category_slug) {
    return NextResponse.json({ error: 'Name, phone and category are required' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', category_slug)
    .single()

  if (!category) return NextResponse.json({ error: 'Invalid category' }, { status: 400 })

  const slug = name.toLowerCase().replace(/[^a-z0-9s-]/g, '').replace(/[s]+/g, '-').substring(0, 80) + '-' + Date.now()

  const { error } = await supabase.from('businesses').insert({
    name,
    slug,
    category_id: category.id,
    phone,
    email: email || null,
    website: website || null,
    address: service_area_only ? 'Natchez, MS 39120' : (address || 'Natchez, MS 39120'),
    description: description || null,
    latitude: null,
    longitude: null,
    tier: 'free',
    is_active: false,
    is_verified: false,
    city: 'Natchez',
    state: 'MS',
    zip: '39120'
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}