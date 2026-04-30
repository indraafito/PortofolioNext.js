import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { authenticate, corsHeaders } from '@/lib/middleware'
import { z } from 'zod'
import { contactRateLimit, getClientIdentifier } from '@/lib/rate-limit'

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  message: z.string().min(1).max(1000),
})

export async function GET(req: NextRequest) {
  return authenticate(async (req: NextRequest) => {
    try {
      const { rows } = await query(
        'SELECT * FROM contact_messages ORDER BY created_at DESC',
      )
      return NextResponse.json(rows, { headers: corsHeaders() })
    } catch (error) {
      return NextResponse.json(
        { message: 'Internal server error' },
        { status: 500, headers: corsHeaders() },
      )
    }
  })(req)
}

export async function POST(req: NextRequest) {
  try {
    // Apply rate limiting
    const clientId = getClientIdentifier(req);
    const rateLimitResult = contactRateLimit(clientId);
    
    if (!rateLimitResult.success) {
      const resetTime = Math.ceil((rateLimitResult.resetTime! - Date.now()) / 1000 / 60);
      return NextResponse.json(
        { 
          message: `Too many contact form submissions. Try again in ${resetTime} minutes.` 
        },
        { 
          status: 429,
          headers: {
            ...corsHeaders(),
            'Retry-After': resetTime.toString(),
          }
        }
      );
    }

    const body = await req.json()
    const parsed = contactSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.errors[0]?.message ?? 'Invalid payload' },
        { status: 400, headers: corsHeaders() },
      )
    }
    const data = parsed.data
    const { rows } = await query(
      `INSERT INTO contact_messages (name, email, message)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [data.name, data.email, data.message],
    )
    return NextResponse.json(rows[0], {
      status: 201,
      headers: corsHeaders(),
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500, headers: corsHeaders() },
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() })
}

