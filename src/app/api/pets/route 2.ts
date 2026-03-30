import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const { data, error } = await supabase
    .from('pet_posts')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { type, pet_name, pet_type, description, contact_name, contact_email, contact_phone, location, image_url } = body

  if (!type || !pet_type || !description || !contact_email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { error } = await supabase.from('pet_posts').insert({
    type, pet_name: pet_name || null, pet_type, description,
    contact_name, contact_email, contact_phone: contact_phone || null,
    location: location || 'Natchez, MS', image_url: image_url || null,
    is_active: true
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Notify admin
  await resend.emails.send({
    from: 'MissLouLocal <onboarding@resend.dev>',
    to: 'support@klickifyagency.com',
    subject: (type === 'lost' ? '🐾 Lost Pet Reported' : '🐾 Found Pet Reported') + ' — MissLouLocal',
    html: `<div style="font-family:sans-serif;padding:20px;max-width:600px">
      <h2 style="color:#f97316">${type === 'lost' ? 'Lost' : 'Found'} Pet Report</h2>
      <p><strong>Pet:</strong> ${pet_name || 'Unknown name'} (${pet_type})</p>
      <p><strong>Description:</strong> ${description}</p>
      <p><strong>Location:</strong> ${location}</p>
      <p><strong>Contact:</strong> ${contact_name} — ${contact_email} — ${contact_phone || 'No phone'}</p>
    </div>`
  }).catch(console.error)

  return NextResponse.json({ success: true })
}