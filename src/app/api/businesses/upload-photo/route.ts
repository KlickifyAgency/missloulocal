import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const businessId = formData.get('businessId') as string

    if (!file || !businessId) {
      return NextResponse.json({ error: 'Missing file or businessId' }, { status: 400 })
    }

    // Check tier - free gets 1 photo only
    const { data: biz } = await supabase
      .from('businesses')
      .select('tier, photo_url, photos')
      .eq('id', businessId)
      .single()

    if (!biz) return NextResponse.json({ error: 'Business not found' }, { status: 404 })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = businessId + '-' + Date.now() + '.' + ext
    const path = 'listings/' + fileName

    const { error: uploadError } = await supabase.storage
      .from('business-photos')
      .upload(path, buffer, {
        contentType: file.type,
        upsert: true
      })

    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

    const { data: { publicUrl } } = supabase.storage
      .from('business-photos')
      .getPublicUrl(path)

    if (biz.tier === 'free' || !biz.tier) {
      // Free tier - single photo_url
      await supabase.from('businesses').update({ photo_url: publicUrl }).eq('id', businessId)
    } else {
      // Premium tier - add to photos array
      const existing = biz.photos || []
      await supabase.from('businesses').update({ 
        photos: [...existing, publicUrl],
        photo_url: existing.length === 0 ? publicUrl : biz.photo_url
      }).eq('id', businessId)
    }

    return NextResponse.json({ success: true, url: publicUrl })
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}