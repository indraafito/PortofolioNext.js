import { NextRequest, NextResponse } from 'next/server'
import { authenticate, corsHeaders } from '@/lib/middleware'
import { query } from '@/lib/db'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  return authenticate(async (req: NextRequest) => {
    try {
      const body = await req.json()
      const { full_name, tagline, title, photo_url } = body
      const { rows } = await query(
        `UPDATE profiles
         SET full_name = $1,
             tagline = $2,
             title = $3,
             photo_url = $4,
             updated_at = NOW()
         WHERE id = $5
         RETURNING *`,
        [full_name, tagline ?? null, title ?? null, photo_url ?? null, params.id],
      )
      if (rows.length === 0) {
        return NextResponse.json(
          { message: 'Profile not found' },
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

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders() })
}

