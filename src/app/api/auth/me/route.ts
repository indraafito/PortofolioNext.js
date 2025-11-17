import { NextRequest, NextResponse } from 'next/server';
import { authenticate, corsHeaders } from '@/lib/middleware';

export async function GET(req: NextRequest) {
  return authenticate(async (req: NextRequest) => {
    const user = (req as any).user;
    
    return NextResponse.json(
      { email: user.email },
      { headers: corsHeaders() }
    );
  })(req);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders()
  });
}