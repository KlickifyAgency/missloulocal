import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  const { owner_email, owner_name, pet_name, pet_type, sender_name, sender_email, sender_phone, message } = await request.json()

  if (!owner_email || !sender_name || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  await resend.emails.send({
    from: 'MissLouLocal <noreply@klickifyagency.com>',
    to: owner_email,
    subject: 'Someone has information about your pet — MissLouLocal',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px">
        <div style="background:#f97316;padding:24px;border-radius:16px 16px 0 0;text-align:center">
          <h1 style="color:white;margin:0;font-size:22px">Someone has information about your pet!</h1>
        </div>
        <div style="background:white;padding:32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 16px 16px">
          <p style="color:#64748b;margin:0 0 8px">Hi <strong style="color:#0f172a">${owner_name}</strong>,</p>
          <p style="color:#64748b;margin:0 0 20px">Someone on MissLouLocal saw your post about <strong style="color:#f97316">${pet_name || pet_type}</strong> and wants to help:</p>
          <div style="background:#fff7ed;border-radius:12px;padding:16px;margin:0 0 20px;border-left:4px solid #f97316">
            <p style="margin:0;color:#0f172a;font-size:15px;line-height:1.6">${message}</p>
          </div>
          <p style="color:#374151;margin:0 0 4px"><strong>From:</strong> ${sender_name}</p>
          <p style="color:#374151;margin:0 0 4px"><strong>Email:</strong> <a href="mailto:${sender_email}" style="color:#f97316">${sender_email}</a></p>
          ${sender_phone ? '<p style="color:#374151;margin:0"><strong>Phone:</strong> ' + sender_phone + '</p>' : ''}
        </div>
        <p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:16px">Powered by <a href="https://missloulocal.com" style="color:#f97316">MissLouLocal</a> — Natchez & Miss-Lou Directory</p>
      </div>
    `
  })

  return NextResponse.json({ success: true })
}