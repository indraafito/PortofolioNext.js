import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { authenticate, corsHeaders } from '@/lib/middleware'
import { z } from 'zod'

const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  technologies: z.array(z.string().min(1)).optional(),
  github_url: z.string().url().nullable().optional(),
  live_url: z.string().url().nullable().optional(),
  thumbnail_url: z.string().url().nullable().optional(),
  order_index: z.number().int().optional(),
})

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  return authenticate(async (req: NextRequest) => {
    try {
      const body = await req.json()
      const parsed = projectSchema.partial().safeParse(body)
      if (!parsed.success) {
        return NextResponse.json(
          { message: parsed.error.errors[0]?.message ?? 'Invalid payload' },
          { status: 400, headers: corsHeaders() },
        )
      }
      const updates = parsed.data
      const fields: string[] = []
      const values: any[] = []
      let index = 1
      for (const [key, value] of Object.entries(updates)) {
        fields.push(`${key} = $${index}`)
        values.push(value)
        index++
      }
      if (fields.length === 0) {
        return NextResponse.json(
          { message: 'No fields to update' },
          { status: 400, headers: corsHeaders() },
        )
      }
      values.push(params.id)
      const { rows } = await query(
        `UPDATE projects SET ${fields.join(', ')}, updated_at = NOW() 
         WHERE id = $${values.length} RETURNING *`,
        values,
      )
      if (rows.length === 0) {
        return NextResponse.json(
          { message: 'Project not found' },
          { status: 404, headers: corsHeaders() },
        )
      }
      return NextResponse.json(rows[0], { headers: corsHeaders() })
    } catch (error) {
      return NextResponse.json(
        { message: 'Internal server error' },
        { status: 500, headers: corsHeaders() },
      )
    }
  })(req)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  return authenticate(async (req: NextRequest) => {
    try {
      const { rows } = await query(
        'DELETE FROM projects WHERE id = $1 RETURNING id',
        [params.id],
      )
      if (rows.length === 0) {
        return NextResponse.json(
          { message: 'Project not found' },
          { status: 404, headers: corsHeaders() },
        )
      }
      return new NextResponse(null, {
        status: 204,
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

