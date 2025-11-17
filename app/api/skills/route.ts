import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { authenticate, corsHeaders } from '@/lib/middleware'
import { z } from 'zod'

const skillSchema = z.object({
  name: z.string().min(1),
  category: z.enum(['hard', 'soft']),
  icon_name: z.string().nullable().optional(),
  proficiency: z.number().int().min(0).max(100).nullable().optional(),
  order_index: z.number().int().optional(),
})

export async function GET() {
  try {
    const { rows } = await query(
      'SELECT * FROM skills ORDER BY order_index ASC, created_at ASC',
    )
    return NextResponse.json(rows, { headers: corsHeaders() })
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500, headers: corsHeaders() },
    )
  }
}

export async function POST(req: NextRequest) {
  return authenticate(async (req: NextRequest) => {
    try {
      const body = await req.json()
      const parsed = skillSchema.safeParse(body)
      if (!parsed.success) {
        return NextResponse.json(
          { message: parsed.error.errors[0]?.message ?? 'Invalid payload' },
          { status: 400, headers: corsHeaders() },
        )
      }
      const data = parsed.data
      const { rows } = await query(
        `INSERT INTO skills (name, category, icon_name, proficiency, order_index)
         VALUES ($1, $2, $3, $4, COALESCE($5, (
           SELECT COALESCE(MAX(order_index), -1) + 1 FROM skills
         )))
         RETURNING *`,
        [
          data.name,
          data.category,
          data.icon_name ?? null,
          data.proficiency ?? null,
          data.order_index ?? null,
        ],
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
  })(req)
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() })
}

