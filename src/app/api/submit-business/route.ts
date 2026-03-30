import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, phone, email, address, category_slug, website, service_area_only, description } = body

  if (!name || !phone || !category_slug) {
    return NextResponse.json({ error: 'Name, phone and category are required' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: category } = await supabase
    .from('categories')
    .select('id, name')
    .eq('slug', category_slug)
    .single()

  if (!category) return NextResponse.json({ error: 'Invalid category' }, { status: 400 })

  const slug = name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/[\s]+/g, '-').substring(0, 80) + '-' + Date.now()

  const { error } = await supabase.from('businesses').insert({
    name, slug,
    category_id: category.id,
    phone,
    email: email || null,
    website: website || null,
    address: service_area_only ? 'Natchez, MS 39120' : (address || 'Natchez, MS 39120'),
    description: description || null,
    latitude: null, longitude: null,
    tier: 'free', is_active: false, is_verified: false,
    city: 'Natchez', state: 'MS', zip: '39120'
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Send email notification
  await resend.emails.send({
    from: 'MissLouLocal <noreply@klickifyagency.com>',
    to: 'support@klickifyagency.com',
    subject: '🏪 New Business Submission — ' + name,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px">
        <h2 style="color:#0f3460">New Business Submitted!</h2>
        <p>A new business is waiting for your approval in MissLouLocal.</p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0">
          <tr><td style="padding:8px;background:#f8fafc;font-weight:bold;width:140px">Business</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">${name}</td></tr>
          <tr><td style="padding:8px;background:#f8fafc;font-weight:bold">Category</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">${category.name}</td></tr>
          <tr><td style="padding:8px;background:#f8fafc;font-weight:bold">Phone</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">${phone}</td></tr>
          <tr><td style="padding:8px;background:#f8fafc;font-weight:bold">Email</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">${email || 'Not provided'}</td></tr>
          <tr><td style="padding:8px;background:#f8fafc;font-weight:bold">Address</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">${address || 'Mobile service'}</td></tr>
          <tr><td style="padding:8px;background:#f8fafc;font-weight:bold">Website</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">${website || 'Not provided'}</td></tr>
          <tr><td style="padding:8px;background:#f8fafc;font-weight:bold">Description</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">${description || 'Not provided'}</td></tr>
        </table>
        <a href="https://www.missloulocal.com/admin" style="display:inline-block;background:#0f3460;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Review in Admin Panel</a>
      </div>
    `
  }).catch(console.error)

  return NextResponse.json({ success: true })
}