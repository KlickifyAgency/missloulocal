import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    const ext = file.name.split('.').pop() || 'jpg'
    const fileName = 'yardsale-' + Date.now() + '.' + ext
    const buffer = await file.arrayBuffer()
    const { error } = await supabase.storage.from('pet-photos').upload(fileName, buffer, { contentType: file.type || 'image/jpeg' })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    const { data: { publicUrl } } = supabase.storage.from('pet-photos').getPublicUrl(fileName)
    return NextResponse.json({ url: publicUrl })
  } catch(e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}