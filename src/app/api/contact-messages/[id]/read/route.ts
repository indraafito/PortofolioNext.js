import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { authenticate, corsHeaders } from '@/lib/middleware';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return authenticate(async (req: NextRequest) => {
    try {
      const body = await req.json();
      const { read } = body;
      
      const { rows } = await query(
        `UPDATE contact_messages
         SET read = $1
         WHERE id = $2
         RETURNING *`,
        [!!read, params.id]
      );

      if (rows.length === 0) {
        return NextResponse.json(
          { message: 'Message not found' },
          { status: 404, headers: corsHeaders() }
        );
      }

      return NextResponse.json(rows[0], {
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