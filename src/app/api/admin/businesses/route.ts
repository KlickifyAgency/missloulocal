import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  const tab = request.nextUrl.searchParams.get('tab') ?? 'pending'

  if (tab === 'deals') {
    const { data, error } = await supabase
      .from('deals')
      .select('*, businesses(name, phone, address)')
      .eq('is_active', false)
      .order('created_at', { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data ?? [])
  }

  if (tab === 'emails') {
    const { data, error } = await supabase
      .from('businesses')
      .select('id, name, email, phone, category_id, categories(slug)')
      .eq('is_active', true)
      .not('email', 'is', null)
      .order('name')
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json((data ?? []).map((b: any) => ({ ...b, category_slug: b.categories?.slug ?? '' })))
  }

  const isActive = tab === 'active'
  const { data, error } = await supabase
    .from('businesses')
    .select('*, categories(slug)')
    .eq('is_active', isActive)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json((data ?? []).map((b: any) => ({ ...b, category_slug: b.categories?.slug ?? '' })))
}

export async function PATCH(request: NextRequest) {
  const { slug, id, action, type } = await request.json()

  if (type === 'deal') {
    if (action === 'approve') {
      const { error } = await supabase.from('deals').update({ is_active: true }).eq('id', id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    }
    if (action === 'reject') {
      const { error } = await supabase.from('deals').delete().eq('id', id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  }

  if (action === 'approve') {
    const { error } = await supabase.from('businesses').update({ is_active: true }).eq('slug', slug)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }
  if (action === 'reject') {
    const { error } = await supabase.from('businesses').delete().eq('slug', slug)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}