import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET() {
  const { data, error } = await supabase
    .from('yard_sales')
    .select('*')
    .eq('is_active', true)
    .eq('is_approved', true)
    .gte('sale_date', new Date().toISOString().split('T')[0])
    .order('sale_date', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { title, description, address, sale_date, start_time, end_time, contact_name, contact_email, image_url } = body
  if (!address || !sale_date || !contact_email) {
    return NextResponse.json({ error: 'Address, date and email are required' }, { status: 400 })
  }
  const { error } = await supabase.from('yard_sales').insert({
    title: title || 'Yard Sale', description, address, sale_date, start_time, end_time,
    contact_name, contact_email, image_url: image_url || null, is_active: true
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  await resend.emails.send({
    from: 'MissLouLocal <onboarding@resend.dev>',
    to: 'support@klickifyagency.com',
    subject: 'New Yard Sale Posted — MissLouLocal',
    html: `<div style="font-family:sans-serif;padding:20px"><h2>New Yard Sale</h2><p><strong>Address:</strong> ${address}</p><p><strong>Date:</strong> ${sale_date}</p><p><strong>Contact:</strong> ${contact_name} — ${contact_email}</p></div>`
  }).catch(console.error)
  return NextResponse.json({ success: true })
}