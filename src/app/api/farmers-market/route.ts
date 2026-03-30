import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET() {
  const { data, error } = await supabase
    .from('farmers_market_vendors')
    .select('*')
    .eq('is_active', true)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { vendor_name, description, products, location, market_days, contact_name, contact_email, contact_phone, image_url, website } = body
  if (!vendor_name || !contact_email) return NextResponse.json({ error: 'Vendor name and email required' }, { status: 400 })
  const { error } = await supabase.from('farmers_market_vendors').insert({
    vendor_name, description, products, location: location || 'Downtown Natchez Farmers Market',
    market_days, contact_name, contact_email, contact_phone: contact_phone || null,
    image_url: image_url || null, website: website || null, is_active: true, is_approved: false
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  await resend.emails.send({
    from: 'MissLouLocal <noreply@klickifyagency.com>',
    to: 'support@klickifyagency.com',
    subject: 'New Farmers Market Vendor — MissLouLocal',
    html: `<div style="font-family:sans-serif;padding:20px"><h2 style="color:#65a30d">New Vendor Submission</h2><p><strong>Vendor:</strong> ${vendor_name}</p><p><strong>Products:</strong> ${products || 'Not specified'}</p><p><strong>Market Days:</strong> ${market_days || 'Not specified'}</p><p><strong>Contact:</strong> ${contact_name} — ${contact_email}</p><a href="https://www.missloulocal.com/admin" style="background:#65a30d;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;margin-top:16px">Review in Admin Panel</a></div>`
  }).catch(console.error)
  return NextResponse.json({ success: true })
}