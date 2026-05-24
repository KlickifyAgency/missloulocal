import crypto from 'crypto'
import { NextRequest } from 'next/server'

const COOKIE = 'admin-token'

function makeToken(): string {
  return crypto.createHmac('sha256', process.env.ADMIN_SECRET!).update('admin-valid').digest('hex')
}

export function isAdminAuthed(request: NextRequest): boolean {
  const token = request.cookies.get(COOKIE)?.value
  if (!token) return false
  const expected = makeToken()
  try {
    return crypto.timingSafeEqual(Buffer.from(token, 'hex'), Buffer.from(expected, 'hex'))
  } catch {
    return false
  }
}

export { COOKIE, makeToken }
