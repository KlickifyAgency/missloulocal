import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data, error } = await supabase
    .from('businesses')
    .select('*, categories(slug, name, color)')
    .eq('is_active', true)
    .order('tier', { ascending: false })
    .order('name')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const businesses = (data ?? []).map((b: any) => ({
    ...b,
    category_slug: b.categories?.slug ?? '',
    category_name: b.categories?.name ?? '',
  }))

  return NextResponse.json(businesses)
}