import { NextRequest, NextResponse } from 'next/server'
import { COOKIE, makeToken, isAdminAuthed } from '@/lib/admin-auth'

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 86400,
  path: '/',
}

export async function GET(request: NextRequest) {
  if (!isAdminAuthed(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ ok: true })
}

export async function POST(request: NextRequest) {
  const { password } = await request.json()
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const response = NextResponse.json({ ok: true })
  response.cookies.set(COOKIE, makeToken(), COOKIE_OPTS)
  return response
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(COOKIE, '', { ...COOKIE_OPTS, maxAge: 0 })
  return response
}
