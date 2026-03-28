import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { business_name, business_phone, business_email, deal_title, deal_description, discount_text, expires_days } = body

  if (!business_name || !deal_title || !discount_text) {
    return NextResponse.json({ error: 'Business name, deal title and discount are required' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const expires = new Date()
  expires.setDate(expires.getDate() + (parseInt(expires_days) || 30))

  const { error } = await supabase.from('deals').insert({
    business_id: null,
    title: deal_title,
    description: deal_description || null,
    discount_text: discount_text.toUpperCase(),
    expires_at: expires.toISOString(),
    is_active: false,
    is_featured: false,
    category: 'general'
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Send email notification
  await resend.emails.send({
    from: 'MissLouLocal <onboarding@resend.dev>',
    to: 'support@klickifyagency.com',
    subject: '🎁 New Deal Submission — ' + business_name,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px">
        <h2 style="color:#ea580c">New Deal Submitted!</h2>
        <p>A business wants to publish a deal on MissLouLocal.</p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0">
          <tr><td style="padding:8px;background:#fff7ed;font-weight:bold;width:140px">Business</td><td style="padding:8px;border-bottom:1px solid #fed7aa">${business_name}</td></tr>
          <tr><td style="padding:8px;background:#fff7ed;font-weight:bold">Phone</td><td style="padding:8px;border-bottom:1px solid #fed7aa">${business_phone || 'Not provided'}</td></tr>
          <tr><td style="padding:8px;background:#fff7ed;font-weight:bold">Email</td><td style="padding:8px;border-bottom:1px solid #fed7aa">${business_email || 'Not provided'}</td></tr>
          <tr><td style="padding:8px;background:#fff7ed;font-weight:bold">Deal Title</td><td style="padding:8px;border-bottom:1px solid #fed7aa">${deal_title}</td></tr>
          <tr><td style="padding:8px;background:#fff7ed;font-weight:bold">Discount</td><td style="padding:8px;border-bottom:1px solid #fed7aa">${discount_text}</td></tr>
          <tr><td style="padding:8px;background:#fff7ed;font-weight:bold">Description</td><td style="padding:8px;border-bottom:1px solid #fed7aa">${deal_description || 'Not provided'}</td></tr>
          <tr><td style="padding:8px;background:#fff7ed;font-weight:bold">Expires in</td><td style="padding:8px;border-bottom:1px solid #fed7aa">${expires_days || 30} days</td></tr>
        </table>
        <a href="https://www.missloulocal.com/admin" style="display:inline-block;background:#ea580c;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Review in Admin Panel</a>
      </div>
    `
  }).catch(console.error)

  return NextResponse.json({ success: true })
}