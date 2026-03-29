import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.redirect('https://www.missloulocal.com?claim=invalid')

  const { data: claim, error } = await supabase
    .from('business_claims')
    .select('id, business_id, owner_email, is_verified')
    .eq('verification_token', token)
    .single()

  if (error || !claim) return NextResponse.redirect('https://www.missloulocal.com?claim=invalid')
  if (claim.is_verified) return NextResponse.redirect('https://www.missloulocal.com?claim=already')

  // Mark claim as verified
  await supabase.from('business_claims').update({
    is_verified: true,
    verified_at: new Date().toISOString()
  }).eq('id', claim.id)

  // Mark business as claimed
  await supabase.from('businesses').update({
    is_claimed: true,
    claimed_by_email: claim.owner_email
  }).eq('id', claim.business_id)

  return NextResponse.redirect('https://www.missloulocal.com?claim=success')
}