import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import webpush from 'web-push'
import { isAdminAuthed } from '@/lib/admin-auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export async function POST(request: NextRequest) {
  if (!isAdminAuthed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { title, body, icon, url, topic } = await request.json()
    if (!title || !body) return NextResponse.json({ error: 'Title and body required' }, { status: 400 })

    const { data: subs } = await supabase.from('push_subscriptions').select('*')
    if (!subs?.length) return NextResponse.json({ sent: 0 })

    let sent = 0
    for (const sub of subs) {
      try {
        const subscription = JSON.parse(sub.subscription)
        await webpush.sendNotification(subscription, JSON.stringify({
          title,
          body,
          icon: icon || '/icon-192x192.png',
          badge: '/icon-192x192.png',
          url: url || 'https://www.missloulocal.com'
        }))
        sent++
      } catch(e: any) {
        if (e.statusCode === 410) {
          await supabase.from('push_subscriptions').delete().eq('endpoint', sub.endpoint)
        }
      }
    }
    return NextResponse.json({ success: true, sent, total: subs.length })
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}