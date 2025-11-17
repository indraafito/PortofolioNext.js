// src/lib/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    email: string;
  };
}

/**
 * Middleware untuk authenticate protected routes
 * Usage:
 * export async function PUT(req: NextRequest) {
 *   return authenticate(async (req: NextRequest) => {
 *     // Your protected logic here
 *   })(req);
 * }
 */
export function authenticate(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401, headers: corsHeaders() }
      );
    }

    const token = authHeader.slice('Bearer '.length);

    try {
      const payload = jwt.verify(token, JWT_SECRET) as { email: string };
      
      // Attach user to request (for reference in handlers)
      (req as any).user = payload;
      
      return handler(req);
    } catch (error) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401, headers: corsHeaders() }
      );
    }
  };
}

/**
 * Generate CORS headers based on environment
 * Supports multiple origins from CORS_ORIGIN env variable
 */
export function corsHeaders(origin?: string): Record<string, string> {
  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
    : ['http://localhost:3000'];

  // If origin is provided, check if it's allowed
  const allowOrigin = origin && allowedOrigins.includes(origin)
    ? origin
    : allowedOrigins[0];

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
}

/**
 * Helper untuk handle OPTIONS request (preflight)
 * Usage:
 * export async function OPTIONS() {
 *   return handleOptions();
 * }
 */
export function handleOptions(req?: NextRequest): NextResponse {
  const origin = req?.headers.get('origin') || undefined;
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(origin),
  });
}