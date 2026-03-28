import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  const tab = request.nextUrl.searchParams.get('tab') ?? 'pending'
  const isActive = tab === 'active'

  const { data, error } = await supabase
    .from('businesses')
    .select('*, categories(slug)')
    .eq('is_active', isActive)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const businesses = (data ?? []).map((b: any) => ({
    ...b,
    category_slug: b.categories?.slug ?? ''
  }))

  return NextResponse.json(businesses)
}

export async function PATCH(request: NextRequest) {
  const { slug, action } = await request.json()

  if (action === 'approve') {
    const { error } = await supabase
      .from('businesses')
      .update({ is_active: true })
      .eq('slug', slug)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (action === 'reject') {
    const { error } = await supabase
      .from('businesses')
      .delete()
      .eq('slug', slug)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}