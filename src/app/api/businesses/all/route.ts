import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Cacheado 1 h: /near-me es el unico consumidor y los datos cambian poco.
// Sin esto, cada visita golpeaba PostgREST con un select(*) de 1.04 MB.
export const revalidate = 3600

// Solo las columnas que /near-me renderiza. select(*) traia 1.04 MB por llamada.
const FIELDS = 'id, name, slug, address, latitude, longitude, phone, is_verified, tier, categories(slug, name, color)'

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data, error } = await supabase
    .from('businesses')
    .select(FIELDS)
    .eq('is_active', true)
    .order('tier', { ascending: false })
    .order('name')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const businesses = (data ?? []).map((b: any) => ({
    ...b,
    category_slug: b.categories?.slug ?? '',
    category_name: b.categories?.name ?? '',
  }))

  return NextResponse.json(businesses, {
    headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
  })
}
