import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { authenticate, corsHeaders } from '@/lib/middleware';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return authenticate(async (req: NextRequest) => {
    try {
      const { rows } = await query(
        'DELETE FROM contact_messages WHERE id = $1 RETURNING id',
        [params.id]
      );
      
      if (rows.length === 0) {
        return NextResponse.json(
          { message: 'Message not found' },
          { status: 404, headers: corsHeaders() }
        );
      }

      return new NextResponse(null, {
        status: 204,
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