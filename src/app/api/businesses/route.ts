import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug')
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  if (slug) {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .single()

    if (!category) return NextResponse.json([])

    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('category_id', category.id)
      .eq('is_active', true)
      .order('tier', { ascending: false })
      .order('name')

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data ?? [])
  }

  return NextResponse.json([])
}
