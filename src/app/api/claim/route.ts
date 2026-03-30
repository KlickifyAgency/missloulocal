import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { business_id, business_name, owner_name, owner_email, owner_phone } = await request.json()

  if (!business_id || !owner_name || !owner_email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data: existing } = await supabase
    .from('businesses')
    .select('is_claimed, claimed_by_email')
    .eq('id', business_id)
    .single()

  if (existing?.is_claimed) {
    return NextResponse.json({ error: 'This business has already been claimed.' }, { status: 400 })
  }

  const { data: claim, error } = await supabase
    .from('business_claims')
    .insert({ business_id, owner_name, owner_email, owner_phone: owner_phone || null })
    .select('verification_token')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const verifyUrl = `https://www.missloulocal.com/api/claim/verify?token=${claim.verification_token}`

  await resend.emails.send({
    from: 'MissLouLocal <noreply@klickifyagency.com>',
    to: owner_email,
    subject: 'Verify your business listing — MissLouLocal',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px">
        <div style="background:#0f3460;padding:24px;border-radius:16px 16px 0 0;text-align:center">
          <h1 style="color:white;margin:0;font-size:24px">MissLou<span style="color:#e94560">Local</span></h1>
          <p style="color:rgba(255,255,255,0.6);margin:4px 0 0;font-size:14px">Natchez & Miss-Lou Directory</p>
        </div>
        <div style="background:white;padding:32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 16px 16px">
          <h2 style="color:#0f172a;margin:0 0 16px">Hi ${owner_name}!</h2>
          <p style="color:#64748b;line-height:1.6;margin:0 0 16px">Thanks for claiming your listing for <strong style="color:#0f172a">${business_name}</strong> on MissLouLocal.</p>
          <p style="color:#64748b;line-height:1.6;margin:0 0 24px">Click the button below to verify your email and activate your listing:</p>
          <div style="text-align:center;margin:0 0 24px">
            <a href="${verifyUrl}" style="display:inline-block;background:#e94560;color:white;padding:16px 32px;border-radius:12px;text-decoration:none;font-weight:700;font-size:16px">Verify My Listing</a>
          </div>
          <p style="color:#94a3b8;font-size:13px;margin:0 0 24px">If you did not request this, you can safely ignore this email.</p>
          <div style="background:#f8fafc;border-radius:12px;padding:20px;border:1px solid #e2e8f0;margin-top:8px">
            <p style="color:#0f172a;font-weight:700;font-size:14px;margin:0 0 8px">Claiming your listing protects your business!</p>
            <p style="color:#64748b;font-size:13px;line-height:1.6;margin:0 0 12px">This is one more layer of protection to ensure no one else can claim what is yours. Only verified owners can update their listing information.</p>
            <p style="color:#0f172a;font-weight:600;font-size:13px;margin:0 0 8px">Know other local business owners?</p>
            <p style="color:#64748b;font-size:13px;line-height:1.6;margin:0">Please share MissLouLocal with friends, family and neighbors who have a business. Help us build the most complete local directory in Natchez & the Miss-Lou area — completely free!</p>
            <div style="text-align:center;margin-top:16px">
              <a href="https://www.missloulocal.com" style="display:inline-block;background:#0f3460;color:white;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:600;font-size:13px">Visit MissLouLocal</a>
            </div>
          </div>
        </div>
        <p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:16px">Questions? <a href="mailto:support@klickifyagency.com" style="color:#0f3460">support@klickifyagency.com</a></p>
      </div>
    `
  }).catch(console.error)

  await resend.emails.send({
    from: 'MissLouLocal <noreply@klickifyagency.com>',
    to: 'support@klickifyagency.com',
    subject: '🏪 New Claim Request — ' + business_name,
    html: `<div style="font-family:sans-serif;padding:20px"><h2>New Claim Request</h2><p><strong>Business:</strong> ${business_name}</p><p><strong>Owner:</strong> ${owner_name}</p><p><strong>Email:</strong> ${owner_email}</p><p><strong>Phone:</strong> ${owner_phone || 'Not provided'}</p></div>`
  }).catch(console.error)

  return NextResponse.json({ success: true })
}