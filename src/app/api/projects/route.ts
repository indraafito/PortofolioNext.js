import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { authenticate, corsHeaders } from '@/lib/middleware';
import { z } from 'zod';

const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  technologies: z.array(z.string().min(1)).optional(),
  github_url: z.string().url().nullable().optional(),
  live_url: z.string().url().nullable().optional(),
  thumbnail_url: z.string().url().nullable().optional(),
  order_index: z.number().int().optional(),
});

export async function GET() {
  try {
    const { rows } = await query(
      'SELECT * FROM projects ORDER BY order_index ASC, created_at ASC'
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
      const parsed = projectSchema.safeParse(body);
      
      if (!parsed.success) {
        return NextResponse.json(
          { message: parsed.error.errors[0]?.message ?? 'Invalid payload' },
          { status: 400, headers: corsHeaders() }
        );
      }

      const data = parsed.data;
      const { rows } = await query(
        `INSERT INTO projects (title, description, technologies, github_url, live_url, thumbnail_url, order_index)
         VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, (
           SELECT COALESCE(MAX(order_index), -1) + 1 FROM projects
         )))
         RETURNING *`,
        [
          data.title,
          data.description,
          data.technologies ?? [],
          data.github_url ?? null,
          data.live_url ?? null,
          data.thumbnail_url ?? null,
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