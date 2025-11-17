// app/api/education/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { authenticate, corsHeaders } from '@/lib/middleware';
import { z } from 'zod';

const educationSchema = z.object({
  institution: z.string().min(1),
  degree: z.string().min(1),
  field_of_study: z.string().nullable().optional(),
  start_year: z.number().int(),
  end_year: z.number().int().nullable().optional(),
  description: z.string().nullable().optional(),
  achievements: z.string().nullable().optional(),
  order_index: z.number().int().optional(),
});

export async function GET() {
  try {
    const { rows } = await query(
      'SELECT * FROM education ORDER BY order_index ASC, created_at ASC'
    );
    
    return NextResponse.json(rows, {
      headers: corsHeaders()
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function POST(req: NextRequest) {
  return authenticate(async (req: NextRequest) => {
    try {
      const body = await req.json();
      const parsed = educationSchema.safeParse(body);
      
      if (!parsed.success) {
        return NextResponse.json(
          { message: parsed.error.errors[0]?.message ?? 'Invalid payload' },
          { status: 400, headers: corsHeaders() }
        );
      }

      const data = parsed.data;
      const { rows } = await query(
        `INSERT INTO education (institution, degree, field_of_study, start_year, end_year, description, achievements, order_index)
         VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE($8, (
           SELECT COALESCE(MAX(order_index), -1) + 1 FROM education
         )))
         RETURNING *`,
        [
          data.institution,
          data.degree,
          data.field_of_study ?? null,
          data.start_year,
          data.end_year ?? null,
          data.description ?? null,
          data.achievements ?? null,
          data.order_index ?? null,
        ]
      );

      return NextResponse.json(rows[0], {
        status: 201,
        headers: corsHeaders()
      });
    } catch (error) {
      return NextResponse.json(
        { message: 'Internal server error' },
        { status: 500, headers: corsHeaders() }
      );
    }
  })(req);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders()
  });
}