import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const authLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

const JWT_SECRET = process.env.JWT_SECRET || 'change-me'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = authLoginSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.errors[0]?.message ?? 'Invalid payload' }, { status: 400 })
    }
    const { email, password } = parsed.data
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '12h' })
    return NextResponse.json({ token })
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

