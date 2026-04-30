import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { loginRateLimit, getClientIdentifier } from '@/lib/rate-limit'
import { createSecureResponse } from '@/lib/security-headers'

const authLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

// ✅ Tambah "as string"
const JWT_SECRET = process.env.JWT_SECRET as string;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL as string;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD as string;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required');
}

export async function POST(req: NextRequest) {
  try {
    const clientId = getClientIdentifier(req);
    const rateLimitResult = loginRateLimit(clientId);
    
    if (!rateLimitResult.success) {
      const resetTime = Math.ceil((rateLimitResult.resetTime! - Date.now()) / 1000 / 60);
      return createSecureResponse(
        { message: `Too many login attempts. Try again in ${resetTime} minutes.` },
        { 
          status: 429,
          headers: { 'Retry-After': resetTime.toString() }
        }
      );
    }

    const body = await req.json()
    const parsed = authLoginSchema.safeParse(body)
    if (!parsed.success) {
      return createSecureResponse({ message: parsed.error.errors[0]?.message ?? 'Invalid payload' }, { status: 400 })
    }

    const { email, password } = parsed.data
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return createSecureResponse({ message: 'Invalid credentials' }, { status: 401 })
    }

    // ✅ Tidak ada error lagi
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '12h' })
    return createSecureResponse({ token })

  } catch (error) {
    return createSecureResponse({ message: 'Internal server error' }, { status: 500 })
  }
}